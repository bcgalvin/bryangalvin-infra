import * as amplify from "@aws-cdk/aws-amplify";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as cdk from "@aws-cdk/core";

interface AmplifyCICDProps extends cdk.StackProps {
  GitHubUsername: string;
  GitHubRepoName: string;
  GitHubPATSM: {
    SecretName: string;
    SecretKey?: string;
  };
  FrontendBaseDirectory: string;
  FrontendBuildCommand: string;
  Domain: string;
}

export class AmplifyCICD extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: AmplifyCICDProps) {
    super(scope, id);

    const buildSpecs = {
      version: 1,
      frontend: {
        phases: {
          preBuild: {
            commands: ["ls -lah", "yarn"],
          },
          build: {
            commands: [`yarn run ${props.FrontendBuildCommand}`],
          },
        },
        artifacts: {
          baseDirectory: props.FrontendBaseDirectory,
          files: ["**/*"],
        },
        cache: {
          paths: ["node_modules/**/*"],
        },
      },
    };

    const amplifyCICD = new amplify.App(this, "pipeline", {
      appName: `${id}Pipeline`,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.GitHubUsername,
        repository: props.GitHubRepoName,
        oauthToken: cdk.SecretValue.secretsManager(
          props.GitHubPATSM.SecretName,
          {
            jsonField: props.GitHubPATSM.SecretKey,
          }
        ),
      }),
      buildSpec: codebuild.BuildSpec.fromObject(buildSpecs),
    });

    const mainBranch = amplifyCICD.addBranch("main");

    const domain = amplifyCICD.addDomain(props.Domain, {
      subDomains: [{ branch: mainBranch, prefix: "www" }],
    });

    domain.mapRoot(mainBranch);
    amplifyCICD.addCustomRule(
      amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT
    );
  }
}
