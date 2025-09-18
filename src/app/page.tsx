'use client';

import PlatformCard from '@/components/PlatformCard';
import { platforms } from '@/data/mockData';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Chamartín Smart Resilience
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de monitorización y predicción climática en tiempo real
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </main>
  );
}