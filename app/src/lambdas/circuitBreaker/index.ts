import getCircuitBreakerState from './getCircuitBreakerState';
import updateCircuitBreakerState from './updateCircuitBreakerState';
import { CircuitBreakerLambdaState, CircuitBreakerOptions, CircuitBreakerState } from './types';

const onSuccess = async (options: CircuitBreakerOptions, existingState: CircuitBreakerLambdaState, response: any) => {
  const newSuccessCount = existingState.successCount + 1;
  const newOpenState = (existingState.state === CircuitBreakerState.Half && newSuccessCount > options.successThreshold)
    ? CircuitBreakerState.Closed
    : CircuitBreakerState.Half;

  const newState: CircuitBreakerLambdaState = {
    ...existingState,
    successCount: newSuccessCount,
    state: newOpenState,
  }

  console.log('newState success:', existingState, newState)
  await updateCircuitBreakerState(newState);

  return response;
};

const onFailed = async (options: CircuitBreakerOptions, existingState: CircuitBreakerLambdaState, err: any): Promise<void> => {
  const newFailureCount = existingState.failureCount + 1;
  const newOpenState = newFailureCount > options.failureThreshold ? CircuitBreakerState.Open : CircuitBreakerState.Half;
  const newSuccessCount = newOpenState === CircuitBreakerState.Open ? 0 : existingState.successCount;

  const newState: CircuitBreakerLambdaState = {
    ...existingState,
    failureCount: newFailureCount,
    state: newOpenState,
    successCount: newSuccessCount,
  }

  console.log('newState failed:', existingState, newState)
  await updateCircuitBreakerState(newState);

  return err;
};

const getCircuitBreaker = (options: CircuitBreakerOptions) => async (fn: () => void) => {
  const currentState = await getCircuitBreakerState();
  let newCurrentState = currentState.state;

  if (currentState?.state === CircuitBreakerState.Open) {
    if (currentState?.nextAttempt <= Date.now()) {
      newCurrentState = CircuitBreakerState.Half;
    } else {
      throw new Error('Circuit Breaker State: OPEN');
    }
  }

  try {
    const response = await fn();
    return onSuccess(options, {
      ...currentState,
      state: newCurrentState,
    }, response);
  } catch (err) {
    return onFailed(options, currentState, err);
  }
}

export default getCircuitBreaker;
