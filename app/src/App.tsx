import { Show, type Component } from 'solid-js';

import * as auth from './auth';
import Comp from './Comp';

const App: Component = () => {
  const [session] = auth.useSession();
  const [user] = auth.useCurrentUser();
  const [attributes] = auth.useUserAttributes();
  return (
    <>
      <Show when={!session.loading && session().tokens} fallback={<auth.SignInButton />}>
        <h1>Hello world!!!!</h1>
        <Comp />
        <Show when={!user.loading && user()}>
          <p>{attributes()?.name}</p>
        </Show>
        <auth.SignOutButton />
      </Show>
    </>
  );
};

export default App;
