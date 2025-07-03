<<<<<<< HEAD
import React from "react";
import AlertButton from "@/components/common/AlertButton";
import ItemCard from "@/components/common/ItemCard";
import Search from "@/components/common/Search";
import TitleWrapper from "@/components/layout/TitleWrapper";
import PageWrapper from "@/components/layout/PageWrapper";
import MainProfile from "@/components/common/MainProfile";
import { auth } from "@/auth";
import { getMemberProfile } from "@/action/member-service";
import AmmountCard from "@/components/AmmountCard";
=======
import React from 'react';
import AlertButton from '@/components/common/AlertButton';
import ItemCard from '@/components/common/ItemCard';
import Search from '@/components/common/Search';
import TitleWrapper from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import MainProfile from '@/components/common/MainProfile';
import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';
import AmmountCard from '@/components/AmmountCard';
import PurchaseModalSection from '@/components/(main)/PurchaseModalSection';
>>>>>>> feat/productsPage

export default async function page() {
  const session = await auth();
  const user = session?.user;
  let memberProfile = undefined;
  if (user) {
    memberProfile = await getMemberProfile(user.memberUuid);
  }
  return (
    <PageWrapper>
      <header className="flex items-center justify-between">
        <MainProfile
          isLoggedIn={user ? true : false}
          userName={memberProfile?.nickname || undefined}
          userImageUrl={memberProfile?.profileImageUrl || undefined}
        />
        <AlertButton isActive={false} />
      </header>
      <TitleWrapper>
        투자는{' '}
        <span className="text-custom-green font-medium wrap-break-word">
          Piece of Cake
        </span>
        <br />
        Traiding Hub
      </TitleWrapper>
      <Search />
      {user && <AmmountCard />}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 items-center justify-center self-center gap-y-7 gap-x-4 ">
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </PageWrapper>
  );
}
