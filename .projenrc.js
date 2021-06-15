const { AwsCdkTypeScriptApp } = require("projen");

const cdkVersion = "1.108.1";
const commonExclude = [".DS_Store"];

const project = new AwsCdkTypeScriptApp({
  name: "site-infra",
  jsiiFqn: "projen.AwsCdkTypeScriptApp",
  repository: "https://github.com/bcgalvin/bryangalvin-infra",
  defaultReleaseBranch: "main",
  cdkVersion: cdkVersion,
  cdkVersionPinning: true,
  cdkDependencies: [
    "@aws-cdk/aws-amplify",
    "@aws-cdk/aws-codebuild",
    "@aws-cdk/aws-dynamodb",
    "@aws-cdk/aws-iam",
    "@aws-cdk/aws-lambda",
    "@aws-cdk/aws-lambda-event-sources",
    "@aws-cdk/aws-lambda-nodejs",
  ],
  eslintOptions: {
    prettier: true,
  },
  context: {
    "@aws-cdk/core:enableStackNameDuplicates": true,
    "@aws-cdk/core:stackRelativeExports": true,
    "@aws-cdk/aws-ecr-assets:dockerIgnoreSupport": true,
    "@aws-cdk/aws-kms:defaultKeyPolicies": true,
    "@aws-cdk/aws-s3:grantWriteWithoutAcl": true,
    "@aws-cdk/core:newStyleStackSynthesis": true,
  },
});

project.gitignore.exclude(...commonExclude);

project.synth();
