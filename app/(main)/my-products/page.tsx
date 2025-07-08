import React from 'react';
import { Package, Edit, Trash2, Eye, Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function MyProductsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <PageWrapper>
        <Header title="내 상품" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">로그인이 필요합니다.</p>
        </div>
      </PageWrapper>
    );
  }

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  const mockProducts = [
    {
      id: 1,
      name: '애플 맥북 프로 16인치',
      category: '전자기기',
      price: 2500000,
      status: '판매중',
      image: '/example.png',
      views: 45,
      likes: 12,
    },
    {
      id: 2,
      name: '나이키 에어맥스 270',
      category: '의류',
      price: 150000,
      status: '판매완료',
      image: '/example.png',
      views: 23,
      likes: 8,
    },
  ];

  const statusColors = {
    판매중: 'text-green-400',
    판매완료: 'text-gray-400',
    예약중: 'text-yellow-400',
  };

  return (
    <>
      <Header title="내 상품" isAlert={false} />
      <PageWrapper>
        {/* Add Product Button */}
        <div className="mb-6">
          <Link href="/sell">
            <button className="w-full bg-custom-green text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-400 transition-colors">
              <Plus className="w-5 h-5" />새 상품 등록하기
            </button>
          </Link>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {mockProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">등록된 상품이 없습니다</p>
              <p className="text-gray-500 text-sm">
                새로운 상품을 등록해보세요!
              </p>
            </div>
          ) : (
            mockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-custom-slate border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {product.category}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${statusColors[product.status as keyof typeof statusColors]}`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="text-white font-semibold">
                          {product.price.toLocaleString()}원
                        </span>
                        <span>조회 {product.views}</span>
                        <span>찜 {product.likes}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Link href={`/product/${product.id}`}>
                          <button className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <Link href={`/edit-product/${product.id}`}>
                          <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          onClick={() => {
                            if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
                              console.log('Delete product:', product.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {mockProducts.length > 0 && (
          <div className="mt-8 p-4 bg-custom-slate border-gray-800 rounded-lg">
            <h3 className="text-white font-medium mb-3">판매 통계</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-custom-green">
                  {mockProducts.length}
                </p>
                <p className="text-gray-400 text-sm">등록 상품</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">
                  {mockProducts.filter((p) => p.status === '판매완료').length}
                </p>
                <p className="text-gray-400 text-sm">판매 완료</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {mockProducts.reduce((sum, p) => sum + p.views, 0)}
                </p>
                <p className="text-gray-400 text-sm">총 조회수</p>
              </div>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
