import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Loader2,
  Layers,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentAnalysisResponse } from '../types';

export const DocumentAnalyzerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResponse | null>(null);

  const sampleSpecs = [
    {
      title: 'Conforming Smart Electric Kettle Spec',
      text: `PRODUCT SPECIFICATION:
Model: Apex Boil-Pro Smart Kettle
Product Category: Household Electric Liquid Heating Appliance
Rated Power Input: 1500 Watts
Operating Voltage: 230 V AC, 50 Hz Single Phase
Primary Material: Food-Grade SUS 304 Stainless Steel Body + Polypropylene Outer Heat-Resistant Shell
Capacity: 1.7 Litres
Safety Mechanisms:
1. Automatic Steam Sensor Thermostat with dual-action Boil-Dry Thermal Cut-Out mechanism.
2. 360-degree Cordless Power Base with automatic contact disconnect shutter when kettle is lifted from base.
3. Class I Earthing Protection with 3-pin moulded plug and earth continuity bond.
4. Glow-wire ignition test certified at 850 degrees Celsius for polymer base.`
    },
    {
      title: 'Non-Compliant Generic Water Boiler Spec (Gap Detected)',
      text: `PRODUCT SPECIFICATION:
Model: FastHeater Instant Kettle
Product: Electric Water Kettle
Power: 1200 W
Voltage: 220V AC
Body: Plastic Container
Capacity: 1 Litre
Features: On/off switch with pilot LED lamp. Concealed heating element.`
    },
    {
      title: 'Packaged Drinking Water Plant Spec',
      text: `WATER PURIFICATION & BOTTLING SPECIFICATION:
Product: Packaged Drinking Water (Other than Natural Mineral Water)
Capacity: 2000 Litres Per Hour Bottling Line
Treatment Process:
1. Sand Filtration and Activated Carbon Filtration
2. Reverse Osmosis (RO) Demineralization
3. Remineralization and Micro-filtration (0.2 micron)
4. Ozonation & Ultraviolet (UV) disinfection chamber
Packaging: Food grade virgin PET bottles (500ml, 1L, 2L) and 20L polycarbonate multi-use jars conforming to food migration limits.`
    }
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setLoading(true);

    try {
      const data = await api.analyzeDocumentFile(file);
      setAnalysisResult(data);
    } catch (err: any) {
      alert(`Error analyzing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = async (specText: string, title: string = 'Sample Product Specification') => {
    setLoading(true);
    try {
      const data = await api.analyzeDocumentText(title, specText);
      setAnalysisResult(data);
    } catch (err: any) {
      alert(`Error analyzing text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Automated Compliance Gap Analysis</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Product Specification Document Analyzer
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload product technical sheets (PDF/Text) to automatically extract electrical, mechanical, and safety specifications and verify compliance gaps against Indian Standards.
        </p>
      </div>

      {/* Upload & Sample Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Upload / Samples (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* File Dropzone */}
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 transition text-center shadow-subtle flex flex-col items-center justify-center min-h-[220px]">
            <Upload className="w-10 h-10 text-indigo-600 mb-3" />
            <h3 className="font-bold text-sm text-slate-800 font-heading">
              Upload Product Specification (PDF)
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
              Upload datasheets, test reports, or engineering manuals (Max 15MB)
            </p>
            <label className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow transition inline-flex items-center space-x-1.5">
              <span>Choose PDF File</span>
              <input
                type="file"
                accept=".pdf,.txt,.json,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <span className="text-[11px] text-slate-500 mt-2 font-mono">
                Selected: {selectedFile.name}
              </span>
            )}
          </div>

          {/* Preloaded Sample Specifications */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Or Test Pre-Loaded Test Specs:</span>
            </div>

            <div className="space-y-2">
              {sampleSpecs.map((spec, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTextInput(spec.text);
                    handleTextAnalyze(spec.text, spec.title);
                  }}
                  className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 transition text-xs group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-indigo-900 font-heading">
                    {spec.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    Click to run instant compliance extraction
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Analysis Result Window (7 Cols) */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-subtle flex flex-col items-center justify-center h-full min-h-[350px]">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
              <h3 className="font-bold text-sm text-slate-800 font-heading">
                Analyzing Technical Specification...
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Parsing electrical parameters, safety protection cut-outs, and matching against mandatory QCOs.
              </p>
            </div>
          ) : !analysisResult ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[350px]">
              <FileCheck className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-sm text-slate-700 font-heading">
                No Specification Analyzed Yet
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Upload a specification PDF or click one of the pre-loaded sample specs on the left to see the compliance gap checklist.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-5 animate-fade-in">
              {/* Product Detected & Standard */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white space-y-2">
                <div className="text-[11px] font-bold text-orange-300 uppercase tracking-wider">
                  Product Detected
                </div>
                <h3 className="text-lg font-bold font-heading">
                  {analysisResult.detected_product}
                </h3>
                <div className="text-xs text-slate-200 font-mono bg-white/10 px-3 py-1.5 rounded-lg inline-block">
                  Applicable Standard: {analysisResult.applicable_standard}
                </div>
              </div>

              {/* Mandatory Alert Banner */}
              {analysisResult.mandatory_qco_alert && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Mandatory Quality Control Order Alert:</span>
                    <span>{analysisResult.mandatory_qco_alert}</span>
                  </div>
                </div>
              )}

              {/* Extracted Attributes */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-700" />
                  <span>Extracted Technical Attributes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {analysisResult.detected_attributes.map((attr, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-[10px] text-slate-400 block font-medium">{attr.attribute}</span>
                      <strong className="text-slate-900 font-mono">{attr.detected_value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Compliance Checklist */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Compliance Checklist vs Indian Standard Clauses</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.compliance_checklist.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        item.status === 'Conforming'
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : item.status === 'Missing/Non-Compliant'
                          ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                          : 'bg-amber-50/60 border-amber-200 text-amber-950'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center space-x-1.5">
                          {item.status === 'Conforming' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : item.status === 'Missing/Non-Compliant' ? (
                            <ShieldAlert className="w-4 h-4 text-rose-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                          )}
                          <span>{item.aspect}</span>
                        </span>
                        <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.clause_ref}
                        </span>
                      </div>
                      <div className="text-[11px] opacity-80 pl-5">
                        {item.observation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gap Analysis Summary */}
              {analysisResult.gap_analysis.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1.5">
                  <span className="font-bold flex items-center space-x-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Compliance Gaps to Address Before Application:</span>
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
                    {analysisResult.gap_analysis.map((gap, gIdx) => (
                      <li key={gIdx}>{gap}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
