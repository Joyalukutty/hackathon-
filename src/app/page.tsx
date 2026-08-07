import Link from "next/link";
import { ArrowRight, Activity, Shield, Zap, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20">
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">MedNexus Phase 1</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          The Future of Enterprise <br />
          <span className="text-primary">Healthcare Management</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
          An AI-ready platform designed for modern hospitals. Monitor patients, track vitals in real-time, and make data-driven decisions faster than ever before.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-base">
              Enter Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/intake">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Patient Intake
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/50 border-t border-border px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start text-left">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Vitals</h3>
            <p className="text-muted-foreground">
              Monitor patient telemetry in real-time with instant alerts for critical changes in condition.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start text-left">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Records</h3>
            <p className="text-muted-foreground">
              Enterprise-grade security ensuring all patient data is encrypted and HIPAA compliant.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border flex flex-col items-start text-left">
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6">
              <BarChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Diagnostics</h3>
            <p className="text-muted-foreground">
              Integrated AI decision support panel providing differential diagnoses and confidence scores.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>© 2026 MedNexus. All rights reserved.</p>
      </footer>
    </div>
  );
}
