import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';

export class AuthService {
  /**
   * 현재 사용자의 인증 상태와 프로필 정보를 가져옵니다.
   */
  static async getCurrentUser() {
    try {
      const session = await auth();
      const isAuth = !!session?.user;

      let memberProfile = undefined;

      if (isAuth && session.user.memberUuid) {
        memberProfile = await getMemberProfile(session.user.memberUuid);
      }

      return {
        isAuthenticated: isAuth,
        user: session?.user || null,
        profile: memberProfile || null,
      };
    } catch (error) {
      console.error('Failed to get current user:', error);
      return {
        isAuthenticated: false,
        user: null,
        profile: null,
      };
    }
  }

  /**
   * 사용자가 로그인되어 있는지 확인합니다.
   */
  static async isAuthenticated() {
    try {
      const session = await auth();
      return !!session?.user;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  }

  /**
   * 사용자의 프로필 정보만 가져옵니다.
   */
  static async getUserProfile() {
    try {
      const session = await auth();
      if (!session?.user?.memberUuid) {
        return null;
      }

      return await getMemberProfile(session.user.memberUuid);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }
}
