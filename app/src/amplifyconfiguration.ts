const amplifyconfiguration = {
    'aws_project_region': 'us-west-2',
    'aws_cognito_identity_pool_id': import.meta.env.VITE_AWS_COGNITO_ID_POOL_ID,
    'aws_cognito_region': 'us-west-2',
    'aws_user_pools_id': import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID,
    'aws_user_pools_web_client_id': import.meta.env.VITE_AWS_WEB_CLIENT_ID,
    'oauth': {
      domain: import.meta.env.VITE_AWS_COGNITO_OAUTH_DOMAIN,
      scope: [
        'email',
        'profile',
        'openid',
        'aws.cognito.signin.user.admin'
      ],
      redirectSignIn: import.meta.env.VITE_AWS_COGNITO_OAUTH_REDIRECT_SIGNIN,
      redirectSignOut: import.meta.env.VITE_AWS_COGNITO_OAUTH_REDIRECT_SIGNOUT,
      clientId: import.meta.env.VITE_AWS_WEB_CLIENT_ID,
      responseType: 'code'
    },
    'aws_cognito_username_attributes': [],
    'aws_cognito_social_providers': [],
    'aws_cognito_signup_attributes': [
      'EMAIL'
    ],
    'aws_cognito_mfa_configuration': 'OFF',
    'aws_cognito_mfa_types': [
      'TOTP'
    ],
    'aws_cognito_password_protection_settings': {
      'passwordPolicyMinLength': 8,
      'passwordPolicyCharacters': []
    },
    'aws_cognito_verification_mechanisms': [
      'EMAIL'
    ]
  };

  export default amplifyconfiguration;
