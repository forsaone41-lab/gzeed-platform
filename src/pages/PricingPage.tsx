import React from 'react';
import { PricingSection } from '../components/PricingSection';

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="pt-24 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Pricing Plans</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transparent pricing that scales with your business. Choose the plan that fits your needs perfectly.
          </p>
        </div>
      </div>
      <PricingSection bgClass="bg-slate-50" titleClass="hidden" />
    </div>
  );
}
