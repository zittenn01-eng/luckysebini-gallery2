'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const artworkId = searchParams.get('artworkId') || '1';
  const artworkTitle = searchParams.get('title') || '행운을 부르는 해바라기';
  const price = parseInt(searchParams.get('price') || '150000', 10);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingDetail: '',
    orderNotes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulated payment flow or redirect to Toss payment widget / success
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `ORD-${Date.now()}`;
      router.push(`/checkout/success?orderId=${orderId}&amount=${price}&title=${encodeURIComponent(artworkTitle)}`);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">주문 / 결제하기</h1>
        <p className="text-stone-500 text-sm">작품 배송을 위한 정보를 입력해주세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Summary Card */}
        <div className="md:col-span-1 bg-stone-100/70 p-6 rounded-2xl border border-stone-200 h-fit space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">주문 요약</h2>
          <div className="space-y-2 border-b border-stone-200 pb-4">
            <p className="text-sm font-semibold text-stone-800">{artworkTitle}</p>
            <p className="text-xs text-stone-500">ID: {artworkId}</p>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>작품 가격</span>
              <span>{price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>배송비</span>
              <span className="text-green-600 font-medium">무료 (안심배송)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline font-extrabold text-lg text-stone-900">
            <span>총 결제금액</span>
            <span className="text-amber-800">{price.toLocaleString()}원</span>
          </div>
        </div>

        {/* Customer & Shipping Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-stone-900">주문자 및 배송지 정보</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">주문자 성함 *</label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">연락처 *</label>
              <input
                type="tel"
                name="customerPhone"
                required
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">이메일 주소 *</label>
            <input
              type="email"
              name="customerEmail"
              required
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">기본 배송 주소 *</label>
            <input
              type="text"
              name="shippingAddress"
              required
              value={formData.shippingAddress}
              onChange={handleChange}
              placeholder="도로명 주소 입력"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">상세 주소</label>
            <input
              type="text"
              name="shippingDetail"
              value={formData.shippingDetail}
              onChange={handleChange}
              placeholder="동/호수 등 상세 주소"
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">배송 요청사항</label>
            <textarea
              name="orderNotes"
              rows={2}
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="부재 시 경비실에 맡겨주세요."
              className="w-full px-3.5 py-2 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-4 py-3.5 rounded-xl bg-stone-900 text-white font-bold text-sm tracking-wide hover:bg-amber-800 transition-all disabled:bg-stone-400 cursor-pointer shadow-md"
          >
            {isProcessing ? '결제 처리 중...' : `${price.toLocaleString()}원 결제하기`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">결제 정보 로딩 중...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
