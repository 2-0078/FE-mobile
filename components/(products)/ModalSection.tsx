
export default function ModalSection({
  productData,
  itemUuid,
  type,
}: {
  productData: FundingProductType;
  itemUuid: string;
  type: "FUNDING" | "PIECE";
}) {
  console.log(type);
  const commentPage = useSearchParams().get("commentPage") || "1";
  const [replies, setReplies] = useState<ReplyType[]>([]);
  useEffect(() => {
    const fetchReplies = async () => {
      const replyUuidList = await getRepliesUuid(
        "PIECE",
        itemUuid,
        commentPage
      );

      const replyData = await Promise.all(
        replyUuidList.map(async (reply) => {
          const replyData = await getReplies(reply.replyUuid);
          return replyData;
        })
      );
      setReplies(replyData);
    };
    fetchReplies();
  }, [itemUuid, commentPage]);

  const { currentModal, closeModal } = useModal();
  return (
    <>
      <ModalContainer
        isOpen={currentModal === 'comments'}
        onClose={() => closeModal()}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose}>
              <div className="px-6 pb-6">
                <h1 className="text-black text-lg font-bold">
                  {productData.productName}
                </h1>
                <p className="text-black text-sm">
                  {productData.mainCategory.categoryName} &gt;
                  {productData.subCategory.categoryName}
                </p>
              </div>
            </ModalHeader>
            <CommentsContent comments={replies} />
          </>
        )}
      </ModalContainer>

      <ModalContainer
        isOpen={currentModal === 'details'}
        onClose={() => closeModal()}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose} />
            <div className="space-y-4 px-6">
              <PriceInfo
                currentPrice={productData.funding.piecePrice}
                totalPieces={productData.funding.totalPieces}
                remainingPieces={productData.funding.remainingPieces}
              />
              <AmountSection
                depositBalance={120000}
                remainingPieces={productData.funding.remainingPieces}
                piecePrice={productData.funding.piecePrice}
              />
              <div className="sticky bottom-0 bg-white p-4">
                <Button className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full">
                  매수하기
                </Button>
              </div>
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
