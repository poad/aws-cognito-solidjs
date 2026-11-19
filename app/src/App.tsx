import { Loading, Show, type Component } from 'solid-js';

import * as auth from './auth/index.js';
import Comp from './Comp.jsx';

const App: Component = () => {
  const session = auth.useSession();
  const user = auth.useCurrentUser();
  const attributes = auth.useUserAttributes();
  return (
    <Loading fallback={<auth.SignInButton />}>
      <Show when={session()?.tokens} fallback={<auth.SignInButton />}>
        <h1>Hello world!!!!</h1>
        <Comp />
        <Show when={user()}>
          <p>{attributes()?.name}</p>
        </Show>
        <auth.SignOutButton />
      </Show>
    </Loading>
  );
};

export default App;
