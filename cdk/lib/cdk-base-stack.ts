import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import handlers from '../../handlers.json';

export class CdkBaseStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, id, {
      runtime: lambda.Runtime.NODEJS_12_X,
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(180),
      memorySize: 512,
      code: new lambda.AssetCode('../dist'),
      handler: handlers.exampleLambda
    });

    const permissionStatement = new iam.PolicyStatement();
    permissionStatement.addResources(lambdaFunction.functionArn);
  }
}
