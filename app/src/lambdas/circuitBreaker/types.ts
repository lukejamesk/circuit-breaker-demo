export type CircuitBreakerOptions = {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

export enum CircuitState {
  Open = 'open',
  Closed = 'closed',
  Half = 'half-open',
}

export type CircuitBreakerLambdaState = {
  circuitState: CircuitState;
  failureCount: number;
  successCount: number;
  nextAttempt: number;
}
