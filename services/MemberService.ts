import { getMemberProfile } from '@/action/member-service';
import { UserInfoType } from '@/types/UserTypes';

export class MemberService {
  /**
   * 회원 프로필 정보를 가져옵니다.
   */
  static async getMemberProfile(
    memberUuid: string
  ): Promise<UserInfoType | null> {
    try {
      const profile = await getMemberProfile(memberUuid);
      return profile;
    } catch (error) {
      console.error('Failed to fetch member profile:', error);
      return null;
    }
  }

  /**
   * 회원 정보가 유효한지 확인합니다.
   */
  static async validateMember(memberUuid: string): Promise<boolean> {
    try {
      const profile = await this.getMemberProfile(memberUuid);
      return profile !== null;
    } catch (error) {
      console.error('Failed to validate member:', error);
      return false;
    }
  }
}
