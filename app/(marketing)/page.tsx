'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Lazy load 3D scene for performance
const BrainScene = dynamic(() => import('@/components/3d/BrainScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading 3D scene...</div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 -z-10">
          <Suspense fallback={null}>
            <BrainScene />
          </Suspense>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background -z-10" />

        {/* Hero Content */}
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-in">
            Build AI-Native{' '}
            <span className="text-primary">SaaS</span> Platforms
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in">
            NeuroFlow combines generative UI, real-time collaboration, and stunning visuals 
            to create the future of AI-powered dashboards.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Link href="/register">
              <Button size="lg" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard/overview">
              <Button size="lg" variant="outline" className="px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features for Modern SaaS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Generative UI"
              description="Create dynamic user interfaces with AI-powered component generation."
              icon="🎨"
            />
            <FeatureCard
              title="Real-time Collaboration"
              description="Work together with your team in real-time with live cursors and updates."
              icon="⚡"
            />
            <FeatureCard
              title="Analytics Dashboard"
              description="Track performance metrics and Web Vitals out of the box."
              icon="📊"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join developers building next-generation AI applications.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8">
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
