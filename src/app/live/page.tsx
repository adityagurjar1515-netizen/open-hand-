'use client';

import { AutoFactsFeed } from '@/components/auto-generation';

export default function LivePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-violet-950/50" />
      </div>
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <AutoFactsFeed intervalMs={60000} factsPerInterval={3} />
        </div>
      </div>
    </main>
  );
}
