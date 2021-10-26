export type CircuitBreakerOptions = {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

export enum CircuitBreakerState {
  Open = 'open',
  Closed = 'closed',
  Half = 'half-open',
}

export type CircuitBreakerLambdaState = {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  nextAttempt: number;
}
