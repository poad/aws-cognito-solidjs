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
const tenant = app.node.tryGetContext('tenant') ?? 'common';
const clientId = app.node.tryGetContext('clientId');
const clientSecret = app.node.tryGetContext('clientSecret');

new CognitoEntraIdOidcStack(app, `${env}-cognito-oidc-stack`, {
  environment: env,
  ...context,
  tenant,
  clientId,
  clientSecret,
});
