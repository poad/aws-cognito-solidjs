# Cognito OIDC IdP CDK Stack

## deploy

1. `npm -g i aws-cdk` および `pnpm install` を実行する
2. cdk.json 内の domain を未取得のものに書き換える
3. アプリを Entra ID に追加する
4. クライアントシークレットを発行する
5. `xms_edov` を返すようにマニュフェストを変更する
6. 「テナント ID」、「クライアント ID」、「クライアントシークレット」をコピーする
7. 「テナント ID」、「クライアント ID」、「クライアントシークレット」を metaURL に指定して cdk deploy し直す
8. Cognito のユーザープール ID とアプリケーションクライアント ID、ID プール ID を控えておく

### アプリを Entra ID に追加する

#### プラットフォーム

「認証」からプラットフォームを追加する。
種類は Web (SPA だと動かない)。

「リダイレクト URI」には `https://${domain}.auth.${region}.amazoncognito.com/oauth2/idpresponse` を指定する。

「暗黙的な許可およびハイブリッド フロー」の各チェックを入れる。

#### クライアントシークレットを発行する

「証明書とシークレット」からクライアントシークレットを発行する。
24 ヶ月を指定する。

#### `xms_edov` を返すようにマニュフェストを変更する

「マニフェスト」から以下の設定を行う。

<https://supabase.com/docs/guides/auth/social-login/auth-azure>


### ユーザープールを作成

```sh
cdk deploy -c env=dev -c clientId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -c clientSecret=XXXXXXXXXXXXXXXXXXXXXXXX -c tenant=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Cognito のユーザープール ID とアプリケーションクライアント ID、ID プール ID を控えておく

それぞれ控えておく。(フロント側で使うため)
