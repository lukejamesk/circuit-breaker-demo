import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import handlers from '../../handlers.json';
import getConfig from '../common/getConfig';

const { CIRCUIT_BREAKER_TABLE } = getConfig();

export class CircuitBreakerDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, CIRCUIT_BREAKER_TABLE, {
      tableName: CIRCUIT_BREAKER_TABLE,
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    });

    const lambdaFunction = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_12_X,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(180),
      memorySize: 512,
      code: new lambda.AssetCode('../dist'),
      handler: handlers.exampleLambda,
      environment: {
        CIRCUIT_BREAKER_TABLE: table.tableName,
      },
    });

    // const permissionStatement = new iam.PolicyStatement();
    // permissionStatement.addResources(lambdaFunction.functionArn);

    // permissionStatement.addResources(table.tableArn);

    table.grantReadWriteData(lambdaFunction);

  }
}
