import { signOut } from "@/auth";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/main" });
      }}
    >
      <button className="bg-custom-slate border-gray-800 p-4 w-full text-custom-light-red">
        로그아웃
      </button>
    </form>
  );
}
