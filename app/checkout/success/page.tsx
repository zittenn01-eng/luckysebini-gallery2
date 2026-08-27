'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-20240001';
  const amount = parseInt(searchParams.get('amount') || '150000', 10);
  const title = searchParams.get('title') || '작품';

  return (
    <div className="max-w-md mx-auto my-12 text-center bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
        ✓
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-stone-900">주문 및 결제 완료!</h1>
        <p className="text-sm text-stone-600">
          세비니의 갤러리 작품을 구매해주셔서 감사합니다.
        </p>
      </div>

      <div className="bg-stone-50 p-4 rounded-xl text-left space-y-2 text-xs text-stone-600 border border-stone-100">
        <div className="flex justify-between">
          <span className="text-stone-400">주문번호</span>
          <span className="font-mono font-medium text-stone-800">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">주문 작품</span>
          <span className="font-medium text-stone-800">{title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">결제 금액</span>
          <span className="font-bold text-amber-800">{amount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Link
          href="/"
          className="block w-full py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors shadow-sm"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">로딩 중...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
