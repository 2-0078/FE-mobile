import React, { Suspense } from 'react';
import Search from '@/components/common/Search';
import TitleWrapper from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import HeaderLayout from '@/components/layout/HeaderLayout';
import ProductGrid from '@/components/common/ProductGrid';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';
import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';
import AmmountCard from '@/components/AmmountCard';

export default async function page() {
  const session = await auth();
  const isAuth = !!session?.user;
  let memberProfile = undefined;
  
  if (isAuth) {
    memberProfile = await getMemberProfile(session.user.memberUuid);
  }
  
  return (
    <>
      <HeaderLayout
        isLoggedIn={isAuth}
        userName={memberProfile?.nickname || undefined}
        userImageUrl={memberProfile?.profileImageUrl || undefined}
      />
      <PageWrapper>
        <TitleWrapper>
          투자는{' '}
          <span className="text-custom-green font-medium wrap-break-word">
            Piece of Cake
          </span>
          <br />
          Traiding Hub
        </TitleWrapper>
        <Search />
        <AmmountCard user={isAuth}/>
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </PageWrapper>
    </>
  );
}
