import PageWrapper from "@/components/layout/PageWrapper";
import Price from "@/components/layout/Price";
import Header from "@/components/layout/Header";
import WalletSummarySection from "@/components/(main)/WalletSummarySection";
import StockItemSection from "@/components/(main)/StockItemSection";
import GraphSection from "@/components/(main)/graphsection";

export default function page() {
  return (
    <PageWrapper className=" px-0">
      <Header title="내 지갑" />
      <section className="text-center px-6 py-8">
        <p className="text-lg mb-2">현재 잔액</p>
        <h2>
          <Price price={32456000} className="text-white text-4xl font-bold" />
        </h2>
      </section>
      <WalletSummarySection />
      <div className="bg-white rounded-t-3xl px-6 py-6">
        <GraphSection />
        <StockItemSection />
      </div>
    </PageWrapper>
  );
}
