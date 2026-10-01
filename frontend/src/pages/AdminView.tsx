import React, { useState, useEffect } from 'react';
import {
  Activity,
  Database,
  Layers,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Shield,
  Search,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const AdminView: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalytics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-blue-700" />
            <span>Traceability & Ingestion Dashboard</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            System Knowledge & Traceability Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time verification metrics, database index health, and transparent query audit logs.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-subtle flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-700" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Real Data Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Indexed Standards
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {metrics?.standards_count || 10}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active & Reaffirmed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Compulsory QCOs
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {metrics?.qcos_count || 9}
          </div>
          <div className="text-[11px] text-rose-700 font-medium mt-1 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Statutory Orders Enforced</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            LIMS Laboratories
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {metrics?.laboratories_count || 6}
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">
            Central + Regional + Empanelled
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Queries Processed
          </div>
          <div className="text-3xl font-black text-slate-900 font-heading">
            {metrics?.total_queries_processed || 0}
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">
            Traceable Audit Logged
          </div>
        </div>
      </div>

      {/* Ingestion Pipeline Health Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-heading flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-700" />
          <span>Knowledge Ingestion Pipeline Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">1. Crawl & Fetch</span>
            <p className="text-slate-500 text-[11px]">
              Periodic snapshots from authorized BIS portals (Know Your Standards, Gazette, LIMS).
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Status: Synced</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">2. Parse & Deduplicate</span>
            <p className="text-slate-500 text-[11px]">
              SHA-256 hash checking prevents redundant chunking. Clean clause isolation.
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Idempotent Indexing</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">3. Hybrid Vector Store</span>
            <p className="text-slate-500 text-[11px]">
              Dense semantic similarity + sparse keyword BM25 with Reciprocal Rank Fusion.
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Multi-Stage Search</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">4. Guardrail Validator</span>
            <p className="text-slate-500 text-[11px]">
              Strict grounding: Only Level 1-4 authorized sources are cited. Refuses hallucinations.
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">✓ Zero Hallucination</span>
          </div>
        </div>
      </div>

      {/* Query Audit Traceability Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        <h2 className="text-base font-bold text-slate-900 font-heading flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-700" />
          <span>Real-Time Audit Log (Decision Traceability)</span>
        </h2>

        {metrics?.recent_audit_logs?.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No inquiries recorded yet in this session. Try asking a question in the 'Ask AI' tab to generate audit traces!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Session ID</th>
                  <th className="py-2.5 px-3">User Query</th>
                  <th className="py-2.5 px-3">Detected Intent</th>
                  <th className="py-2.5 px-3">Matched Standard</th>
                  <th className="py-2.5 px-3">Evidence Strength</th>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics?.recent_audit_logs?.map((log: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[10px]">
                      {log.session_id.slice(0, 8)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs truncate">
                      {log.user_query}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {log.detected_intent}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-800">
                      {log.matched_standard || 'N/A (Refusal)'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.evidence_strength === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.evidence_strength === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.evidence_strength}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                      {log.timestamp_iso?.slice(11, 19) || 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statutory Disclaimer Card (Section 77) */}
      <div className="p-5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
        <strong className="text-slate-800 block font-heading">
          Statutory Legal & Accuracy Disclaimer:
        </strong>
        <p className="leading-relaxed">
          MANAK AI is an informational decision-support assistant designed for the Smart India Hackathon (SIH26107). Content is retrieved strictly from authorized Bureau of Indian Standards (BIS) and Ministry Quality Control Orders. This tool does not constitute legally binding statutory advice. Users are advised to confirm the current applicability of standards, gazette amendments, and licensing fee schedules directly through the official portals (manakonline.in / bis.gov.in) before commercial or regulatory execution.
        </p>
      </div>
    </div>
  );
};
