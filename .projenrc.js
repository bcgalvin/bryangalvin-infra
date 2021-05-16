const { AwsCdkTypeScriptApp } = require("projen");

const cdkVersion = "1.104.0";
const project = new AwsCdkTypeScriptApp({
  name: "site-infra",
  jsiiFqn: "projen.AwsCdkTypeScriptApp",
  repository: "https://github.com/bcgalvin/bryangalvin-infra",
  defaultReleaseBranch: "main",
  cdkVersion: cdkVersion,
  cdkVersionPinning: true,
  cdkDependencies: ["@aws-cdk/aws-amplify", "@aws-cdk/aws-codebuild"],
  eslintOptions: {
    prettier: true,
  },
});

project.synth();
