#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CognitoEntraIdOidcStack } from '../lib/aws-cognito-solidjs-cognito-stack';

interface EnvProps {
  domain: string;
}

const app = new cdk.App();

const env = app.node.tryGetContext('env') as string;
const context = app.node.tryGetContext(env) as EnvProps;
const tenant =
  (app.node.tryGetContext('tenant') as string | undefined) ?? 'common';
const clientId = app.node.tryGetContext('clientId') as string | undefined;
const clientSecret = app.node.tryGetContext('clientSecret') as
  | string
  | undefined;

new CognitoEntraIdOidcStack(app, `${env}-cognito-oidc-stack`, {
  environment: env,
  ...context,
  tenant,
  clientId,
  clientSecret,
});
