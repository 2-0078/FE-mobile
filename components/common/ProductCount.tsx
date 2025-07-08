interface ProductCountProps {
  totalElements: number;
}

export default function ProductCount({ totalElements }: ProductCountProps) {
  return (
    <div className="px-4 mb-4">
      <p className="text-sm text-gray-400">
        총 <span className="text-green-400 font-medium">{totalElements}</span>
        개의 상품
      </p>
    </div>
  );
}
