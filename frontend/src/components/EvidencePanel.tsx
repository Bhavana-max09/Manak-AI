import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  FileCheck,
  Scale,
  Calendar,
  Layers,
  HelpCircle
} from 'lucide-react';
import { EvidenceSummary } from '../types';

interface EvidencePanelProps {
  evidence?: EvidenceSummary | null;
  productDetected?: string;
  isMandatory?: boolean;
  isRefusal?: boolean;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  productDetected,
  isMandatory,
  isRefusal
}) => {
  if (!evidence) {
    return (
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
          <BookOpen className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-slate-800 text-sm mb-1 font-heading">
          Real-Time Evidence Panel
        </h4>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Ask a question or enter a product description to view traceable citations, verified BIS clauses, and Quality Control Orders.
        </p>
      </div>
    );
  }

  const getStrengthBadge = (strength: string) => {
    switch (strength) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Evidence: HIGH</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200">
            <Scale className="w-3.5 h-3.5" />
            <span>Evidence: MEDIUM</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Evidence: LIMITED</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-subtle flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-sm text-slate-900 font-heading">
            Grounded BIS Evidence
          </h3>
        </div>
        {getStrengthBadge(evidence.strength)}
      </div>

      <div className="p-5 space-y-4 overflow-y-auto max-h-[750px]">
        {/* Status Callout */}
        {isRefusal ? (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <div className="flex items-center space-x-1.5 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Grounded Refusal Triggered</span>
            </div>
            <p className="leading-relaxed">
              To prevent hallucination, MANAK AI refrains from inventing standards for unverified or experimental concepts not in the authorized BIS corpus.
            </p>
          </div>
        ) : (
          <div className="p-3.5 bg-blue-50/80 border border-blue-100 rounded-lg text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Product Identified:</span>
              <span className="font-bold text-slate-800">{productDetected || 'General Product'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Certification Requirement:</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                isMandatory
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isMandatory ? 'COMPULSORY (QCO)' : 'VOLUNTARY (Scheme I)'}
              </span>
            </div>
            {evidence.governing_qco && (
              <div className="pt-1 text-[11px] text-slate-600 border-t border-blue-200/60">
                <span className="font-semibold text-slate-700">Order: </span>
                {evidence.governing_qco}
              </div>
            )}
          </div>
        )}

        {/* Traceable Citations List */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Authorized Sources Used ({evidence.citations.length})</span>
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">Level 1-4 Trust</span>
          </div>

          {evidence.citations.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No direct sources found for this inquiry.</p>
          ) : (
            <div className="space-y-2.5">
              {evidence.citations.map((cite, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-lg text-xs transition duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-0.5">
                        {cite.source_type}
                      </span>
                      <h5 className="font-bold text-slate-900 leading-snug">{cite.title}</h5>
                    </div>
                    {cite.url && (
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-white rounded transition"
                        title="Open authorized source in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="mt-2 text-slate-600 space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-medium text-slate-500">Document Ref:</span>
                      <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">
                        {cite.document_ref}
                      </span>
                    </div>
                    {cite.section_clause && (
                      <div>
                        <span className="font-medium text-slate-500">Clauses / Detail: </span>
                        <span>{cite.section_clause}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verification Timestamp & Disclaimer */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Database Last Verified: <strong className="text-slate-600">30 Sep 2026</strong></span>
          </div>
          <div className="flex items-start space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="leading-tight">
              BIS web terms: Content reproduced for accurate public compliance information. Verify with relevant BIS office for official proceedings.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
