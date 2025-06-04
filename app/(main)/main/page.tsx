import React from "react";
import AlertButton from "@/components/common/AlertButton";
import ItemCard from "@/components/common/ItemCard";
import Search from "@/components/common/Search";
import TitleWrapper from "@/components/layout/TitleWrapper";
import PageWrapper from "@/components/layout/PageWrapper";
import MainProfile from "@/components/common/MainProfile";
export default function page() {
  return (
    <PageWrapper>
      <header className="flex items-center justify-between">
        <MainProfile
          isLoggedIn={true}
          userName="홍길동"
          userImageUrl="https://previews.123rf.com/images/adrian1991/adrian19912109/adrian1991210900001/174101000-%EB%B3%84%EC%9D%B4-%EB%B9%9B%EB%82%98%EB%8A%94-%EB%B0%A4-%EB%B9%88%EC%84%BC%ED%8A%B8-%EB%B0%98-%EA%B3%A0%ED%9D%90-%EA%B7%B8%EB%A6%BC.jpg"
        />
        <AlertButton isActive={true} />
      </header>
      <TitleWrapper>
        투자는{" "}
        <span className="text-custom-green font-medium wrap-break-word">
          Piece of Cake
        </span>
        <br />
        Traiding Hub
      </TitleWrapper>
      <Search />
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
