import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';

import { Construct } from 'constructs';

interface CognitoEntraIdOidcStackProps extends cdk.StackProps {
  environment: string;
  domain: string;
  tenant: string;
  clientId?: string;
  clientSecret?: string;
  callbackUrls?: string[];
  logoutUrls?: string[];
}

export class CognitoEntraIdOidcStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: CognitoEntraIdOidcStackProps
  ) {
    super(scope, id, props);

    const {
      environment,
      domain,
      tenant,
      clientId,
      clientSecret,
      callbackUrls,
      logoutUrls,
    } = props;

    const preSignUpFunctionName = `${environment}-entra-id-oidc-pre-sign-up-trigger`;
    const preSignUpLogGroup = new logs.LogGroup(
      this,
      'PreSignUpLambdaFunctionLogGroup',
      {
        logGroupName: `/aws/lambda/${preSignUpFunctionName}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_DAY,
      }
    );

    const preSignUpFn = new nodejs.NodejsFunction(
      this,
      'PreSignUpLambdaFunction',
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        entry: 'cognito-triggers/pre-sign-up/index.ts',
        functionName: preSignUpFunctionName,
        retryAttempts: 0,
        environment: {
          PROVIDERS: 'EntraID',
          NODE_OPTIONS: '--enable-source-maps',
        },
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: nodejs.SourceMapMode.BOTH,
          sourcesContent: true,
          keepNames: true,
        },
        role: new iam.Role(this, 'PreSignUpExecutionRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
          inlinePolicies: {
            'logs-policy': new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                  resources: [`${preSignUpLogGroup.logGroupArn}:*`],
                }),
              ],
            }),
            'assumed-role-policy': new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['cognito-identity:*', 'cognito-idp:*'],
                  resources: ['*'],
                }),
              ],
            }),
          },
        }),
      }
    );

    const postConfirmFunctionName = `${environment}-entra-id-oidc-post-confirm-trigger`;
    const postConfirmLogGroup = new logs.LogGroup(
      this,
      'PostConfirmLambdaFunctionLogGroup',
      {
        logGroupName: `/aws/lambda/${postConfirmFunctionName}`,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        retention: logs.RetentionDays.ONE_DAY,
      }
    );

    const postConfirmFn = new nodejs.NodejsFunction(
      this,
      'PostConfirmLambdaFunction',
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        entry: 'cognito-triggers/post-confirm/index.ts',
        functionName: postConfirmFunctionName,
        retryAttempts: 0,
        environment: {
          PROVIDERS: 'EntraID',
          NODE_OPTIONS: '--enable-source-maps',
        },
        bundling: {
          minify: true,
          sourceMap: true,
          sourceMapMode: nodejs.SourceMapMode.BOTH,
          sourcesContent: true,
          keepNames: true,
        },
        role: new iam.Role(this, 'PostConfirmExecutionRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
          inlinePolicies: {
            'logs-policy': new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                  resources: [`${postConfirmLogGroup.logGroupArn}:*`],
                }),
              ],
            }),
            'assumed-role-policy': new iam.PolicyDocument({
              statements: [
                new iam.PolicyStatement({
                  effect: iam.Effect.ALLOW,
                  actions: ['cognito-identity:*', 'cognito-idp:*'],
                  resources: ['*'],
                }),
              ],
            }),
          },
        }),
      }
    );

    const userPool = new cognito.UserPool(this, 'CognitoOidcUserPool', {
      userPoolName: `${environment}-entra-id-oidc-user-pool`,
      signInAliases: {
        username: false,
        email: true,
        preferredUsername: false,
        phone: false,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
        preferredUsername: {
          required: false,
        },
        phoneNumber: {
          required: false,
        },
      },
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        preSignUp: preSignUpFn,
        postConfirmation: postConfirmFn,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    userPool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: domain,
      },
    });

    if (clientId && clientSecret) {
      new cognito.UserPoolIdentityProviderOidc(this, 'CognitoOidcIdPEntraID', {
        name: 'EntraID',
        clientId,
        clientSecret,
        attributeRequestMethod: cognito.OidcAttributeRequestMethod.GET,
        issuerUrl: `https://login.microsoftonline.com/${tenant}/v2.0`,
        scopes: ['openid', 'email', 'profile', 'offline_access'],
        attributeMapping: {
          email: cognito.ProviderAttribute.other('email'),
          profilePage: cognito.ProviderAttribute.other('profile'),
          preferredUsername: cognito.ProviderAttribute.other('name'),
          custom: {
            name: cognito.ProviderAttribute.other('name'),
            email_verified: cognito.ProviderAttribute.other('xms_edov'),
          },
        },
        userPool,
      });
    }

    const client = new cognito.UserPoolClient(this, 'CognitoOidcAppClient', {
      userPool: userPool,
      userPoolClientName: `${environment}-entra-id-oidc`,
      authFlows: {
        adminUserPassword: true,
        userSrp: true,
        userPassword: true,
      },
      oAuth: {
        callbackUrls,
        logoutUrls,
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.COGNITO_ADMIN,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
      },
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        familyName: true,
        givenName: true,
        fullname: true,
        preferredUsername: true,
        emailVerified: true,
        profilePage: true,
      }),
      writeAttributes: new cognito.ClientAttributes().withStandardAttributes({
        email: true,
        familyName: true,
        givenName: true,
        fullname: true,
        preferredUsername: true,
        profilePage: true,
      }),
    });

    const identityPoolProvider = {
      clientId: client.userPoolClientId,
      providerName: userPool.userPoolProviderName,
    };

    const identityPool = new cognito.CfnIdentityPool(
      this,
      'CognitoOidcIdPool',
      {
        allowUnauthenticatedIdentities: false,
        allowClassicFlow: true,
        cognitoIdentityProviders: [identityPoolProvider],
        identityPoolName: `${environment} Cognito OIDC idp`,
      }
    );

    const unauthenticatedRole = new iam.Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        roleName: `${environment}-oidc-unauth-role`,
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ),
        maxSessionDuration: cdk.Duration.hours(12),
      }
    );

    unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      })
    );
    unauthenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:*'],
        resources: ['*'],
      })
    );

    const authenticatedRole = new iam.Role(
      this,
      'CognitoDefaultAuthenticatedRole',
      {
        roleName: `${environment}-entra-id-oidc-auth-role`,
        assumedBy: new iam.FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': identityPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'authenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ).withSessionTags(),
        maxSessionDuration: cdk.Duration.hours(12),
      }
    );
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      })
    );
    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['sts:*'],
        resources: ['*'],
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(
      this,
      'CognitoOidcIdPoolRoleAttachment',
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: authenticatedRole.roleArn,
          unauthenticated: unauthenticatedRole.roleArn,
        },
      }
    );

    new ssm.StringParameter(this, 'CognitoDomainUrl', {
      parameterName: `/${environment}/entra-id-oidc-next-js/CognitoDomainUrl`,
      stringValue: `https://${domain}.auth.${this.region}.amazoncognito.com`,
    });

    new ssm.StringParameter(this, 'CognitoAppClientIdl', {
      parameterName: `/${environment}/entra-id-oidc-next-js/CognitoAppClientId`,
      stringValue: client.userPoolClientId,
    });
  }
}
