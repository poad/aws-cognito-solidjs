import { signOut } from "aws-amplify/auth";
import { ConsoleLogger } from "aws-amplify/utils";

import { type JSX } from "solid-js/jsx-runtime";

export const SignOutButton = (): JSX.Element => {
  const logger = new ConsoleLogger("SignOutButton");

  return (
    <button
      onClick={() =>
        void signOut({ global: true }).catch((err) => {
          /* Nothing to do */
          logger.error(err);
        })
      }
      style={`
        text-transform: none;
        background-color: #ff8c00;
        color: #fff;
        :hover: {
          background-color: #ffd700;
          color: #2d2d2d;
        }`}
    >
      Sign out
    </button>
  );
};

export default SignOutButton;
