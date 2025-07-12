'use server';

import { signOut, auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  await signOut();
  revalidatePath('/', 'layout');
}

export async function getCurrentSession() {
  const session = await auth();
  return session;
}

export async function getCurrentUserProfile() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  try {
    const profile = await getMemberProfile(session.user.memberUuid);
    return { user: session.user, profile };
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return { user: session.user, profile: null };
  }
}
