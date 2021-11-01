import { DynamoDB } from 'aws-sdk';
import { CircuitBreakerLambdaState } from './types';

const tableName = process.env.CIRCUIT_BREAKER_TABLE as string;
const lambdaFunctionName = process.env.AWS_LAMBDA_FUNCTION_NAME;

const dynamoDB = new DynamoDB.DocumentClient();

const updateCircuitBreakerState = async (state: CircuitBreakerLambdaState): Promise<void> => {
  try {
    const ddbParams = {
      TableName: tableName,
      Key: {
        id: lambdaFunctionName
      },
      UpdateExpression:
        'set circuitState=:st, failureCount=:fc, successCount=:sc, nextAttempt=:na, stateTimestamp=:ts',
      ExpressionAttributeValues: {
        ':st': state.circuitState,
        ':fc': state.failureCount,
        ':sc': state.successCount,
        ':na': state.nextAttempt,
        ':ts': Date.now()
      },
      ReturnValues: 'UPDATED_NEW'
    }
    await dynamoDB.update(ddbParams).promise()
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default updateCircuitBreakerState;