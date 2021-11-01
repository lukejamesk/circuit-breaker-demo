import getCircuitBreakerState from './getCircuitBreakerState';
import updateCircuitBreakerState from './updateCircuitBreakerState';
import { CircuitBreakerLambdaState, CircuitBreakerOptions, CircuitState } from './types';

const onSuccess = async (options: CircuitBreakerOptions, existingState: CircuitBreakerLambdaState, response: any) => {
  const newSuccessCount = existingState.successCount + 1;
  const newOpenState = (existingState.circuitState === CircuitState.Half && newSuccessCount > options.successThreshold)
    ? CircuitState.Closed
    : CircuitState.Half;

  const newState: CircuitBreakerLambdaState = {
    failureCount: newOpenState === CircuitState.Closed ? 0 : existingState.failureCount,
    successCount: newOpenState === CircuitState.Closed ? 0 : newSuccessCount,
    circuitState: newOpenState,
    nextAttempt: 0,
  }

  await updateCircuitBreakerState(newState);

  return response;
};

const onFailed = async (options: CircuitBreakerOptions, existingState: CircuitBreakerLambdaState, err: any): Promise<void> => {
  const newFailureCount = existingState.failureCount + 1;
  const newOpenState = newFailureCount > options.failureThreshold ? CircuitState.Open : CircuitState.Half;
  const newSuccessCount = newOpenState === CircuitState.Open ? 0 : existingState.successCount;
  const newNextAttempt =  newOpenState === CircuitState.Open ? Date.now() + options.timeout : 0;

  const newState: CircuitBreakerLambdaState = {
    ...existingState,
    failureCount: newFailureCount,
    circuitState: newOpenState,
    successCount: newSuccessCount,
    nextAttempt: newNextAttempt,
  }

  await updateCircuitBreakerState(newState);

  return err;
};

const getCircuitBreaker = (options: CircuitBreakerOptions) => async (fn: () => void) => {
  const currentState = await getCircuitBreakerState();
  let newCurrentState = currentState.circuitState;

  if (currentState.circuitState === CircuitState.Open) {
    if (currentState.nextAttempt <= Date.now()) {
      newCurrentState = CircuitState.Half;
    } else {
      throw new Error('Circuit Breaker State: OPEN');
    }
  }

  try {
    const response = await fn();
    return onSuccess(options, {
      ...currentState,
      circuitState: newCurrentState,
    }, response);
  } catch (err) {
    return onFailed(options, currentState, err);
  }
}

export default getCircuitBreaker;
