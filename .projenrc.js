const { awscdk } = require('projen');
const cdkVersion = '2.15.0';
const commonExclude = ['.idea', '.Rproj', '.vscode', 'cdk.context.json', '.DS_Store'];

const project = new awscdk.AwsCdkTypeScriptApp({
  name: 'site-infra',
  jsiiFqn: 'projen.AwsCdkTypeScriptApp',
  repository: 'https://github.com/bcgalvin/bryangalvin-infra',
  defaultReleaseBranch: 'main',
  // Dependencies
  cdkVersion: cdkVersion,
  deps: [`aws-cdk-lib@${cdkVersion}`, 'constructs@10.0.5', `@aws-cdk/aws-amplify-alpha@${cdkVersion}-alpha.0`],
  githubOptions: {
    pullRequestLint: false,
  },
  devDeps: [
    `aws-cdk-lib@${cdkVersion}`,
    'constructs@10.0.5',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'prettier',
    '@types/cfn-response',
  ],
  eslintOptions: {
    prettier: true,
  },
  githubOptions: {
    pullRequestLint: false,
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['bcgalvin'],
    label: 'auto-approve',
    secret: 'GITHUB_TOKEN',
  },
  codeCov: true,
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      trailingComma: 'all',
      arrowParens: 'always',
      singleQuote: true,
    },
  },
});

project.addTask('format', {
  description: 'Format with prettier',
  exec: 'prettier --write src/{**/,}*.ts test/{**/,}*.ts .projenrc.js README.md',
});

project.gitignore.exclude(...commonExclude);

project.synth();
