# Solid.js ベースフロントエンド

.env で Cognito 周りの値を設定する。

| 環境変数名 | 説明 |
|:---------|:-----|
| VITE_AWS_COGNITO_USER_POOL_ID | Cognito ユーザープールの ID |
| VITE_AWS_COGNITO_ID_POOL_ID | Cognito ID プールの ID |
| VITE_AWS_WEB_CLIENT_ID | Cognito ユーザープールの `dev-entra-id-oidc` のクライアント ID |
| VITE_AWS_COGNITO_OAUTH_DOMAIN | Cognito ユーザープールのドメイン (スキーマは指定しない) |
| VITE_AWS_COGNITO_OAUTH_REDIRECT_SIGNIN | サインインリダイレクト URL (フロントエンド自体の URL) |
| VITE_AWS_COGNITO_OAUTH_REDIRECT_SIGNOUT | サインイアウトリダイレクト URL (フロントエンド自体の URL) |
| VITE_FEDERATION_TARGET | `EntraID ` 固定 |
