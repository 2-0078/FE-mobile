import { logoutAction } from '@/action/auth-service';

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="bg-custom-slate border-gray-800 p-4 w-full text-custom-light-red">
        로그아웃
      </button>
    </form>
  );
}
