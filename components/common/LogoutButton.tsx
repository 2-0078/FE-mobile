'use client';

import { logoutAction } from '@/action/auth-service';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-custom-slate border-gray-800 p-4 w-full text-custom-light-red"
    >
      로그아웃
    </button>
  );
}
