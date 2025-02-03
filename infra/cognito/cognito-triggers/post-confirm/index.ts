import {
  AdminDeleteUserCommand,
  AdminLinkProviderForUserCommand,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  Callback,
  Context,
  PostConfirmationTriggerEvent,
  PostConfirmationTriggerHandler,
} from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import 'source-map-support/register';

const logger = new Logger({});

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent,
  _: Context,
  callback: Callback<unknown>
): Promise<unknown> => {
  logger.debug(JSON.stringify(event));

  const { userPoolId, userName, request, triggerSource } = event;
  if (triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const { userAttributes } = request;
    const email = userAttributes['email'];
    const identities = userAttributes['identities'];
    const { userId, providerName } = JSON.parse(identities)[0];

    logger.debug(identities);

    const identityProvider = new CognitoIdentityProviderClient({});

    const user = (
      await identityProvider.send(
        new ListUsersCommand({
          UserPoolId: userPoolId,
          Filter: `email = "${email}"`,
        })
      )
    ).Users?.find(
      (user) => (user.UserStatus as string | undefined) === 'EXTERNAL_PROVIDER'
    );

    if (user) {
      await identityProvider.send(
        new AdminUserGlobalSignOutCommand({
          UserPoolId: userPoolId,
          Username: userName,
        })
      );
      await identityProvider.send(
        new AdminDeleteUserCommand({
          UserPoolId: userPoolId,
          Username: userName,
        })
      );

      await identityProvider.send(
        new AdminLinkProviderForUserCommand({
          UserPoolId: userPoolId,
          DestinationUser: {
            ProviderName: 'Cognito',
            ProviderAttributeValue: user.Username ?? '',
          },
          SourceUser: {
            ProviderName: providerName,
            ProviderAttributeName: 'Cognito_Subject',
            ProviderAttributeValue: userId,
          },
        })
      );

      event.userName = user.Username ?? '';

      return {
          statusCode: 200
      };
    }
  }
  logger.debug(JSON.stringify(event));

  callback(null, event);
};
