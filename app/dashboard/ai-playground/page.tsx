'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

export default function AIPlaygroundPage() {
  const [copied, setCopied] = useState(false);

  const {
    completion,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    stop,
  } = useCompletion({
    api: '/api/ai/stream',
  });

  const handleCopy = () => {
    if (completion) {
      navigator.clipboard.writeText(completion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as any);
  };

  if (isLoading && !completion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Playground</h1>
          <p className="text-muted-foreground">
            Generate UI components with AI. Describe what you want to build.
          </p>
        </div>
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-32 w-full bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Playground</h1>
        <p className="text-muted-foreground">
          Generate UI components with AI. Describe what you want to build.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generative UI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Describe the UI component you want to generate... e.g., 'Create a dashboard stats card with three metrics showing users, revenue, and growth'"
              value={input}
              onChange={handleInputChange}
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
              {isLoading && (
                <Button type="button" variant="outline" onClick={stop}>
                  Stop
                </Button>
              )}
            </div>
          </form>

          {(completion || isLoading) && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Generated Output</h3>
                {completion && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
              <div className="p-4 rounded-lg bg-muted font-mono text-sm whitespace-pre-wrap border">
                {completion || 'Generating...'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Prompts */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <QuickPrompt
          prompt="Create a pricing card with three tiers: Basic, Pro, and Enterprise"
          onSelect={handleSelectPrompt}
        />
        <QuickPrompt
          prompt="Build an analytics dashboard widget showing monthly revenue chart"
          onSelect={handleSelectPrompt}
        />
        <QuickPrompt
          prompt="Generate a user profile settings form with avatar upload"
          onSelect={handleSelectPrompt}
        />
        <QuickPrompt
          prompt="Create a marketing hero section with headline and CTA buttons"
          onSelect={handleSelectPrompt}
        />
      </div>
    </div>
  );
}

function QuickPrompt({
  prompt,
  onSelect,
}: {
  prompt: string;
  onSelect: (_prompt: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(prompt)}
      className="p-3 text-left text-sm rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      {prompt}
    </button>
  );
}
