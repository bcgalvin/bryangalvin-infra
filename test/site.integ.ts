import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AmplifyStack } from '../src/main';

class TestSiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new AmplifyStack(this, 'amplify-stack');
  }
}

const app = new App();

new TestSiteStack(app, 'integration', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();
