import { signInWithRedirect } from "aws-amplify/auth";
import { ConsoleLogger } from "aws-amplify/utils";

import { type JSX } from "solid-js/jsx-runtime";

export const SignInButton = (): JSX.Element => {
  const logger = new ConsoleLogger("SignInButton");

  const idpName = import.meta.env.VITE_FEDERATION_TARGET;

  const onClick = async (): Promise<void> => {
    await signInWithRedirect({
      provider: {
        custom: idpName,
      },
    }).catch((err) => {
      /* Nothing to do */
      logger.error(err);
    });
  };

  return (
    <button
      onClick={onClick}
      style={`
        text-transform: none;
        background-color: #ff8c00;
        color: #fff;
        :hover: {
          background-color: #ffd700;
          color: #2d2d2d;
        }`}
    >
      Sign in with {idpName}
    </button>
  );
};

export default SignInButton;
