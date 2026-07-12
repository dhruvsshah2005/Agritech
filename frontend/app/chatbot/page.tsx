'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatbotRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/voice-assistant');
  }, [router]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
