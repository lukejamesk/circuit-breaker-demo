import getCircuitBreaker from './index';
import getCircuitBreakerState from './getCircuitBreakerState';
import updateCircuitBreakerState from './updateCircuitBreakerState';
import { CircuitState } from './types';

jest.mock('./getCircuitBreakerState');
jest.mock('./updateCircuitBreakerState');

const getCircuitBreakerStateMock = getCircuitBreakerState as jest.Mock;
const updateCircuitBreakerStateMock = updateCircuitBreakerState as jest.Mock;

const now = Date.now();

jest.useFakeTimers();

const defaultSettings = {
  failureThreshold: 5,
  timeout: 10000,
  successThreshold: 2,
};

const circuitBreaker = getCircuitBreaker(defaultSettings);

describe('Circuit breaker', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('and is open', () => {
    const currentFailureState = {
      failureCount: 6,
      circuitState: CircuitState.Open,
      successCount: 0,
      nextAttempt: now + 10000,
    };

    beforeEach(() => {
      getCircuitBreakerStateMock.mockResolvedValue(currentFailureState);
    });

    it('should not run the provided function', async () => {
      const serviceFn = jest.fn();
     
      try {
        await circuitBreaker(serviceFn);
      } catch (e) { }

      expect(serviceFn).not.toHaveBeenCalled();
    });

    describe('and enough time has passed the nextAttempt time', () => {
      beforeEach(() => {
        jest.advanceTimersByTime(10000);
      });

      it('should run the function', async () => {
        const serviceFn = jest.fn();
     
        try {
          await circuitBreaker(serviceFn);
        } catch (e) { }
  
        expect(serviceFn).toHaveBeenCalled();
        expect(updateCircuitBreakerStateMock).toHaveBeenCalledWith({
          circuitState: CircuitState.Half,
          failureCount: currentFailureState.failureCount,
          nextAttempt: 0,
          successCount: 1,
        });
      });
    });
  });

  describe('and is half-open', () => {
    const currentFailureState = {
      failureCount: 6,
      circuitState: CircuitState.Half,
      successCount: 1,
      nextAttempt: now + 10000,
    };

    beforeEach(() => {
      getCircuitBreakerStateMock.mockResolvedValue(currentFailureState);
    });

    it('should run the function', async () => {
      const serviceFn = jest.fn();
     
      try {
        await circuitBreaker(serviceFn);
      } catch (e) { }

      expect(serviceFn).toHaveBeenCalled();
      expect(updateCircuitBreakerStateMock).toHaveBeenCalledWith({
        circuitState: CircuitState.Half,
        failureCount: currentFailureState.failureCount,
        nextAttempt: 0,
        successCount: 2,
      });
    });

    describe('and the function fails', () => {
      let serviceFn: () => void;

      beforeEach(() => {
        serviceFn = jest.fn(() => {
          throw new Error('Failed');
        });
      })

      it('should reset to open state', async () => {
        try {
          await circuitBreaker(serviceFn);
        } catch (e) { }

        expect(updateCircuitBreakerStateMock).toHaveBeenCalledWith({
          circuitState: CircuitState.Open,
          failureCount: 7,
          nextAttempt: Date.now() + defaultSettings.timeout,
          successCount: 0,
        });
      });

    })

    describe('and successCount is at success threshold', () => {
      const currentFailureState = {
        failureCount: 6,
        circuitState: CircuitState.Half,
        successCount: defaultSettings.successThreshold,
        nextAttempt: now + 10000,
      };
      
      beforeEach(() => {
        getCircuitBreakerStateMock.mockResolvedValue(currentFailureState);
      });

      it('it should change the circuit to closed', async () => {
        const serviceFn = jest.fn();
     
        try {
          await circuitBreaker(serviceFn);
        } catch (e) { }
  
        expect(serviceFn).toHaveBeenCalled();
        expect(updateCircuitBreakerStateMock).toHaveBeenCalledWith({
          circuitState: CircuitState.Closed,
          failureCount: 0,
          nextAttempt: 0,
          successCount: 0,
        });
      });
    });
  });
});
