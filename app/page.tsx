"use client";

import { useState, useEffect } from "react";

// Animated webhook event for the hero
function WebhookEvent({ delay, type }: { delay: number; type: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colors: Record<string, string> = {
    stripe: "bg-violet-500",
    docusign: "bg-yellow-500",
    dodo: "bg-emerald-500",
    github: "bg-zinc-400",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-elevated border border-border transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${colors[type]} animate-pulse`} />
      <span className="font-mono text-sm text-muted">POST</span>
      <span className="font-mono text-sm text-foreground">/webhook/{type}</span>
      <span className="ml-auto text-xs text-emerald-400">200 OK</span>
    </div>
  );
}

// Live event stream visualization
function EventStream() {
  const events = [
    { type: "stripe", delay: 0 },
    { type: "docusign", delay: 400 },
    { type: "dodo", delay: 800 },
    { type: "github", delay: 1200 },
  ];

  return (
    <div className="space-y-2">
      {events.map((event, i) => (
        <WebhookEvent key={i} delay={event.delay} type={event.type} />
      ))}
    </div>
  );
}

// Feature card component
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`group p-6 rounded-2xl bg-surface border border-border hover:border-accent/30 transition-all duration-300 animate-slide-up opacity-0 ${delay}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Platform logo component
function PlatformLogo({ name, color }: { name: string; color: string }) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border hover:border-${color}/50 transition-colors cursor-default`}
    >
      <div className={`w-3 h-3 rounded-full bg-${color}`} />
      <span className="text-sm text-foreground">{name}</span>
    </div>
  );
}

// Pricing card component
function PricingCard({
  tier,
  price,
  description,
  features,
  highlighted,
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative p-8 rounded-2xl border transition-all duration-300 ${
        highlighted
          ? "bg-surface-elevated border-accent/50 glow-amber-sm"
          : "bg-surface border-border hover:border-accent/30"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-background text-xs font-medium rounded-full">
          Popular
        </div>
      )}
      <h3 className="text-xl font-semibold mb-1">{tier}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        {price !== "Free" && <span className="text-muted">/month</span>}
      </div>
      <p className="text-muted text-sm mb-6">{description}</p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <svg
              className="w-4 h-4 text-accent flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
          highlighted
            ? "bg-accent text-background hover:bg-accent-dim"
            : "bg-surface-elevated border border-border hover:border-accent/50 text-foreground"
        }`}
      >
        {price === "Free" ? "Start Free" : "Get Started"}
      </button>
    </div>
  );
}

// Testimonial component
function Testimonial({
  quote,
  author,
  role,
  company,
}: {
  quote: string;
  author: string;
  role: string;
  company: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border">
      <p className="text-foreground mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <span className="text-accent font-medium">{author[0]}</span>
        </div>
        <div>
          <div className="font-medium text-foreground text-sm">{author}</div>
          <div className="text-muted text-xs">
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("npx hookone relay");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg
                className="w-5 h-5 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg">HookOne</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
              Docs
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-muted hover:text-foreground transition-colors">
              Sign in
            </button>
            <button className="px-4 py-2 bg-accent text-background text-sm font-medium rounded-lg hover:bg-accent-dim transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-slide-up opacity-0" style={{ animationFillMode: "forwards" }}>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-accent font-medium">Your URL never changes</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 animate-slide-up opacity-0 delay-100" style={{ animationFillMode: "forwards" }}>
                Webhook testing,{" "}
                <span className="text-accent text-glow">simplified</span>
              </h1>
              <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg animate-slide-up opacity-0 delay-200" style={{ animationFillMode: "forwards" }}>
                Get a permanent URL for all your webhooks. Inspect payloads, replay events, and relay to localhost. No more ngrok URL shuffling.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up opacity-0 delay-300" style={{ animationFillMode: "forwards" }}>
                <button className="px-6 py-3 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all duration-300 glow-amber-sm hover:glow-amber">
                  Start for Free
                </button>
                <button className="px-6 py-3 bg-surface border border-border font-medium rounded-lg hover:border-accent/50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </button>
              </div>

              {/* CLI Install */}
              <div className="animate-slide-up opacity-0 delay-400" style={{ animationFillMode: "forwards" }}>
                <p className="text-xs text-muted mb-2">Or relay to localhost with our CLI:</p>
                <div
                  className="code-block cursor-pointer group"
                  onClick={copyCommand}
                >
                  <div className="code-header">
                    <div className="code-dot bg-red-500/80" />
                    <div className="code-dot bg-yellow-500/80" />
                    <div className="code-dot bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted">terminal</span>
                    <span className="ml-auto text-xs text-muted group-hover:text-accent transition-colors">
                      {copied ? "Copied!" : "Click to copy"}
                    </span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <span className="text-muted">$</span>{" "}
                    <span className="text-emerald-400">npx</span>{" "}
                    <span className="text-foreground">hooklab relay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Event Stream */}
            <div className="relative animate-slide-in-right opacity-0 delay-300" style={{ animationFillMode: "forwards" }}>
              <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl" />
              <div className="relative p-6 rounded-2xl bg-surface border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium">Live Events</span>
                  </div>
                  <span className="text-xs text-muted font-mono">
                    hookone.dev/wh/a1b2c3
                  </span>
                </div>
                <EventStream />
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted">4 events received</span>
                  <button className="text-xs text-accent hover:text-accent-dim transition-colors">
                    View all →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-6 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-muted mb-6">Works with your favorite platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            <PlatformLogo name="Stripe" color="violet-500" />
            <PlatformLogo name="DocuSign" color="yellow-500" />
            <PlatformLogo name="DodoPayments" color="emerald-500" />
            <PlatformLogo name="GitHub" color="zinc-400" />
            <PlatformLogo name="Shopify" color="lime-500" />
            <PlatformLogo name="Twilio" color="red-500" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for webhook testing
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              From development to production, HookOne gives you the tools to build reliable webhook integrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="Permanent URLs"
              description="Your webhook URL never expires or changes. Set it once in Stripe, DocuSign, or any platform and forget about it."
              delay="delay-100"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="Localhost Relay"
              description="Forward webhooks to your local development server with a single CLI command. No network configuration needed."
              delay="delay-200"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              title="Event Replay"
              description="Replay any webhook event with one click. Perfect for debugging edge cases and testing error handling."
              delay="delay-300"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Payload Inspector"
              description="View headers, body, and metadata of every webhook in a clean interface. Export to JSON or cURL."
              delay="delay-400"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
              title="Mock Workflows"
              description="Test your integration without signing up for third-party services. We simulate webhooks from Stripe, Dodo, and more."
              delay="delay-500"
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Secure by Default"
              description="Signature verification, HTTPS only, and automatic secret rotation. Your webhooks are protected at every step."
              delay="delay-500"
            />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 px-6 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              A dashboard built for developers
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Clean, fast, and packed with the details you need. No bloat, no confusion.
            </p>
          </div>

          {/* Mock Dashboard */}
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl border border-border overflow-hidden bg-surface">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-elevated">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                      <svg className="w-4 h-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-sm">HookOne</span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <span className="text-sm text-muted">my-project</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-muted">hookone.dev/wh/a1b2c3</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-48 border-r border-border p-4 hidden md:block">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Events
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted text-sm hover:bg-surface-elevated transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Workflows
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted text-sm hover:bg-surface-elevated transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Recent Events</h3>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs rounded-lg bg-surface-elevated border border-border hover:border-accent/50 transition-colors">
                        Filter
                      </button>
                      <button className="px-3 py-1.5 text-xs rounded-lg bg-accent text-background hover:bg-accent-dim transition-colors">
                        + New Workflow
                      </button>
                    </div>
                  </div>

                  {/* Event List */}
                  <div className="space-y-2">
                    {[
                      { event: "payment_intent.succeeded", source: "Stripe", time: "2s ago", status: "success" },
                      { event: "envelope.completed", source: "DocuSign", time: "1m ago", status: "success" },
                      { event: "payment.created", source: "Dodo", time: "5m ago", status: "success" },
                      { event: "push", source: "GitHub", time: "12m ago", status: "success" },
                      { event: "payment_intent.failed", source: "Stripe", time: "1h ago", status: "error" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface-elevated border border-border hover:border-accent/30 transition-colors cursor-pointer group"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.status === "success" ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        <span className="font-mono text-sm text-foreground flex-1">{item.event}</span>
                        <span className="text-xs text-muted">{item.source}</span>
                        <span className="text-xs text-muted w-16 text-right">{item.time}</span>
                        <button className="opacity-0 group-hover:opacity-100 text-xs text-accent transition-opacity">
                          Replay
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Workflows Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="text-xs text-emerald-400 font-medium">Mock Workflows</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Test without signing up for anything
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Skip the account creation dance. Use our pre-built workflows to simulate webhooks from popular platforms. Perfect for testing your integration logic before going live.
              </p>
              <div className="space-y-4">
                {[
                  { name: "Stripe", desc: "Payment intents, subscriptions, invoices" },
                  { name: "DodoPayments", desc: "Payment events, refunds, disputes" },
                  { name: "DocuSign", desc: "Envelope status, recipient events" },
                  { name: "GitHub", desc: "Push, PR, issue, and deployment events" },
                ].map((platform, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{platform.name}</div>
                      <div className="text-xs text-muted">{platform.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl" />
              <div className="relative p-6 rounded-2xl bg-surface border border-border">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-medium">Stripe Payment Flow</h4>
                  <span className="text-xs text-emerald-400 px-2 py-1 rounded-full bg-emerald-500/10">Ready</span>
                </div>
                <div className="space-y-3">
                  {[
                    "payment_intent.created",
                    "payment_intent.processing",
                    "charge.succeeded",
                    "payment_intent.succeeded",
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-xs text-muted">
                        {i + 1}
                      </div>
                      <span className="font-mono text-sm text-foreground">{event}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-colors">
                  Run Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted">
              Start free. Scale when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <PricingCard
              tier="Free"
              price="Free"
              description="Perfect for side projects and learning"
              features={[
                "1 permanent webhook URL",
                "100 events / month",
                "7-day event history",
                "CLI localhost relay",
                "3 mock workflows",
              ]}
            />
            <PricingCard
              tier="Pro"
              price="$12"
              description="For professional developers and teams"
              features={[
                "Unlimited webhook URLs",
                "Unlimited events",
                "30-day event history",
                "Priority localhost relay",
                "All mock workflows",
                "Team collaboration",
                "Webhook signature verification",
              ]}
              highlighted
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by developers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              quote="Finally, a webhook URL that doesn't change every time I restart my tunnel. Game changer for Stripe testing."
              author="Sarah Chen"
              role="Senior Engineer"
              company="Fintech Startup"
            />
            <Testimonial
              quote="The mock workflows saved me hours of setup time. I tested my entire DocuSign integration without creating a single real envelope."
              author="Marcus Johnson"
              role="Full Stack Dev"
              company="LegalTech Co"
            />
            <Testimonial
              quote="Simple, fast, does exactly what it says. The CLI relay is incredibly responsive. Ditched ngrok and never looked back."
              author="Alex Rivera"
              role="Indie Hacker"
              company="SaaSBuilder"
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to simplify your webhook testing?
          </h2>
          <p className="text-muted mb-8 text-lg">
            Get your permanent webhook URL in seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-all duration-300 glow-amber-sm hover:glow-amber text-lg">
              Start for Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="font-semibold">HookOne</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted">
              <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
            </div>
            <p className="text-sm text-muted">
              © 2025 HookOne. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
