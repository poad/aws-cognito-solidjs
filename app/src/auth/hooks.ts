import { fetchAuthSession, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { createMemo } from 'solid-js';

export function useSession() {
  const session = createMemo(() => fetchAuthSession());
  return session;
}

export function useCurrentUser() {
  const user = createMemo(() => getCurrentUser());
  return user;
}

export function useUserAttributes() {
  const attributes = createMemo(() => fetchUserAttributes());
  return attributes;
}
