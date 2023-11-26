import {
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";
import { createResource } from "solid-js";

export function useSession() {
  return createResource(async () => await fetchAuthSession());
}

export function useCurrentUser() {
  return createResource(async () => await getCurrentUser());
}
