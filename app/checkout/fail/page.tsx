'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || '결제 진행 중 오류가 발생했습니다.';
  const code = searchParams.get('code') || 'PAYMENT_FAILED';

  return (
    <div className="max-w-md mx-auto my-12 text-center bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
        ✕
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-stone-900">결제에 실패하였습니다</h1>
        <p className="text-sm text-stone-600">{message}</p>
        <p className="text-xs text-stone-400 font-mono">오류 코드: {code}</p>
      </div>

      <div className="space-y-2 pt-4">
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

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">로딩 중...</div>}>
      <FailContent />
    </Suspense>
  );
}
