import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class DynamoDBTable extends Construct {
  constructor(scope: Construct, id: string, tableName: string) {
    super(scope, id);

    const ddbTable = new dynamodb.Table(this, tableName, {
      tableName,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const ddbLambda = new NodejsFunction(this, 'ddbStreamLambda', {
      functionName: 'PublishDynamoDBStreamsFunction',
      runtime: lambda.Runtime.NODEJS_12_X,
      memorySize: 128,
      timeout: cdk.Duration.seconds(5),
      handler: 'handler',
      entry: path.join(__dirname, './lambda/index.ts'),
    });

    ddbLambda.addEventSource(
      new DynamoEventSource(ddbTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
      }),
    );
    ddbLambda.addToRolePolicy(new PolicyStatement({ resources: ['*'], actions: ['dynamodb:*'] }));
  }
}
