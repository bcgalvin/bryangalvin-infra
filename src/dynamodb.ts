import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as cdk from "@aws-cdk/core";

export class DynamoDBTable extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, tableName: string) {
    super(scope, id);

    new dynamodb.Table(this, tableName, {
      tableName,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
