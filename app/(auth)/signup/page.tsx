import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import SignupSteps from '@/components/(auth)/SignupSteps';

export default function SignupPage() {
  return (
    <PageWrapper>
      <Header isAlert={false} title="SIGN UP" />

      <SignupSteps />
    </PageWrapper>
  );
}
