import LoginSection from '@/components/organisms/LoginSection';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  return <LoginSection searchParams={searchParams} />;
}
