import { App, Stack, StackProps, Construct } from "@aws-cdk/core";

import { AmplifyCICD } from "./amplify";
import { DynamoDBTable } from "./dynamodb";

const blogRepo = "bryangalvin-site";
export class AmplifyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new DynamoDBTable(this, `${id}Table`, "app-backend");

    new AmplifyCICD(this, `${id}Cicd`, {
      GitHubUsername: "bcgalvin",
      GitHubRepoName: blogRepo,
      GitHubPATSM: {
        SecretName: "bcgalvin-github-pat",
        SecretKey: "token",
      },
      FrontendBaseDirectory: "dist",
      FrontendBuildCommand: "generate",
      Domain: "bryangalvin.com",
    });
  }
}

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new AmplifyStack(app, "amplify-stack", { env: env });

app.synth();
