'use client';
import { useState } from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-mono">
      {/* Header */}
      <header className="border-b border-slate-800 pb-4 mb-8">
        <h1 className="text-2xl font-bold tracking-wider text-emerald-400">RISK_MGMT_TERMINAL_v1.0</h1>
        <p className="text-xs text-slate-400">Logged in as: Underwriter_01</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">New Applicant Assessment</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Annual Income ($)</label>
              <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Credit Score</label>
              <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 focus:outline-none focus:border-emerald-500" />
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2 rounded transition-colors">
              RUN RISK ASSESSMENT
            </button>
          </form>
        </div>

        {/* Right Column: Historical Analytics Dashboard */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-slate-200">Recent Audit Decisions Logs</h2>
          {/* We will map over historical backend data here to build a data table */}
          <div className="text-sm text-slate-500 italic">Awaiting API logs connection...</div>
        </div>
      </div>
    </div>
  );
}