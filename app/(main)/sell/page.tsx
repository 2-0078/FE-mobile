'use client';

import { Upload, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { useState } from 'react';

interface ProductForm {
  title: string;
  description: string;
  price: string;
  category: string;
  images: File[];
}

export default function SellPage() {
  const [form, setForm] = useState<ProductForm>({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    '전자기기',
    '의류',
    '도서',
    '스포츠용품',
    '가구',
    '식품',
    '기타',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('상품 등록:', form);
      alert('상품이 성공적으로 등록되었습니다!');
    } catch (error) {
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="상품 판매하기" isAlert={false} />
      <PageWrapper>
        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          <FloatingInput
            id="title"
            name="title"
            label="상품명"
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            placeholder="상품명을 입력해주세요"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              카테고리
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              required
              className="w-full bg-custom-slate border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-custom-green"
            >
              <option value="">카테고리를 선택해주세요</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <FloatingInput
            id="price"
            name="price"
            label="가격"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, price: e.target.value }))
            }
            required
            placeholder="가격을 입력해주세요"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              상품 설명
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
              rows={4}
              placeholder="상품에 대한 자세한 설명을 입력해주세요"
              className="w-full bg-custom-slate border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-green resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              상품 이미지 (최대 5개)
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-gray-400 text-sm">
                  이미지를 선택하거나 드래그하여 업로드하세요
                </span>
              </label>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {form.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`상품 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-2">판매 시 주의사항</p>
                <ul className="space-y-1 text-xs">
                  <li>• 정확한 상품 정보를 입력해주세요</li>
                  <li>• 상품 이미지는 명확하게 촬영해주세요</li>
                  <li>• 거래 수수료 3%가 적용됩니다</li>
                  <li>• 부정한 판매는 제재 대상입니다</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !form.title ||
              !form.category ||
              !form.price ||
              !form.description
            }
            className="w-full bg-custom-green text-black font-bold py-4 rounded-md h-14 disabled:opacity-50"
          >
            {isSubmitting ? '등록 중...' : '상품 등록하기'}
          </Button>
        </form>
      </PageWrapper>
    </>
  );
}
