import { DynamoDB } from 'aws-sdk';
import { CircuitBreakerLambdaState, CircuitState } from './types';

const tableName = process.env.CIRCUIT_BREAKER_TABLE as string;
const lambdaFunctionName = process.env.AWS_LAMBDA_FUNCTION_NAME;

const dynamoDB = new DynamoDB.DocumentClient();

const getCircuitBreakerState = async (): Promise<CircuitBreakerLambdaState> => {
  try {
    const ddbParams = {
      TableName: tableName,
      Key: {
        id: lambdaFunctionName
      }
    }
    const data = await dynamoDB.get(ddbParams).promise()

    if (data.Item) {
      return data.Item as CircuitBreakerLambdaState
    }

    return {
      failureCount: 0,
      circuitState: CircuitState.Closed,
      successCount: 0,
      nextAttempt: 0,
    };
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default getCircuitBreakerState;