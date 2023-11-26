import { Show, type Component } from "solid-js";
import Comp from "./Comp";
import * as auth from "./auth";

const App: Component = () => {
  const [session] = auth.useSession();
  const [user] = auth.useCurrentUser();
  return (
    <>
      <Show
        when={!session.loading && session().tokens}
        fallback={<auth.SignInButton />}
      >
        <h1>Hello world!!!!</h1>
        <Comp />
        <Show when={!user.loading && user()}>
          <p>{user().username}</p>
        </Show>
        <auth.SignOutButton />
      </Show>
    </>
  );
};

export default App;
