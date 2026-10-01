import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  FileCheck,
  Building,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';

export const CertificationView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScheme, setSelectedScheme] = useState<'scheme1' | 'scheme2' | 'scheme4'>('scheme1');

  const steps = [
    {
      step: 1,
      title: 'Standard Identification',
      duration: '1-3 Days',
      desc: 'Verify applicable Indian Standard (IS Code) and confirm product technical parameters conform to all specifications.'
    },
    {
      step: 2,
      title: 'In-House Laboratory Setup',
      duration: '10-20 Days',
      desc: 'Procure and calibrate mandatory testing equipment at the factory according to the BIS Scheme of Inspection and Testing (SIT).'
    },
    {
      step: 3,
      title: 'Online Application (Manakonline)',
      duration: '2-4 Days',
      desc: 'Submit Form-I on the official Manakonline portal with factory layout, machine list, test staff credentials, and ₹1,000 application fee.'
    },
    {
      step: 4,
      title: 'Factory Inspection & Audit',
      duration: '15-30 Days',
      desc: 'BIS Inspecting Officer visits premises, audits manufacturing quality control, witnesses testing, and draws independent verification samples.'
    },
    {
      step: 5,
      title: 'Sample Testing in BIS Lab',
      duration: '15-30 Days',
      desc: 'Drawn samples are sealed and tested at an authorized BIS Central/Regional or recognized independent laboratory.'
    },
    {
      step: 6,
      title: 'Scrutiny & Resolution',
      duration: '7-15 Days',
      desc: 'BIS evaluates test reports. Any non-conformities are resolved by corrective action plans.'
    },
    {
      step: 7,
      title: 'Grant of Licence (CM/L)',
      duration: 'Immediate',
      desc: 'Licence is granted with a unique 7 or 8 digit CM/L number. Manufacturer authorizes affixation of the prestigious ISI Mark.'
    }
  ];

  const documents = [
    'Factory premises legal ownership or registered lease agreement',
    'Plant layout plan and manufacturing process flow diagram',
    'Machinery list with nameplate capacity and serial numbers',
    'Complete list of in-house testing equipment with NABL calibration certificates',
    'Appointment letter and degree certificates of Qualified Quality Control personnel',
    'Consent to Operate (CTO) from State Pollution Control Board',
    'MSME / Udyam Registration Certificate and PAN/GST registrations',
    'Undertaking committing to the BIS Scheme of Inspection and Testing (SIT)'
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Statutory Conformity Assessment</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          BIS Certification Roadmap & Guidelines
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Interactive workflow navigator for obtaining the Standard Mark (ISI Mark) under Scheme I and Compulsory Registration (CRS) under Scheme II.
        </p>
      </div>

      {/* Scheme Selector Tabs */}
      <div className="flex space-x-3">
        <button
          onClick={() => setSelectedScheme('scheme1')}
          className={`flex-1 p-4 rounded-xl border text-left transition ${
            selectedScheme === 'scheme1'
              ? 'bg-blue-50/80 border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
              SCHEME I
            </span>
            <span className="text-[11px] font-bold text-emerald-700">Flagship ISI Mark</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 font-heading">Product Certification Scheme</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Factory audit + independent lab testing. Applies to appliances, steel, cement, water, toys, and cookers.
          </p>
        </button>

        <button
          onClick={() => setSelectedScheme('scheme2')}
          className={`flex-1 p-4 rounded-xl border text-left transition ${
            selectedScheme === 'scheme2'
              ? 'bg-blue-50/80 border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
              SCHEME II
            </span>
            <span className="text-[11px] font-bold text-purple-700">CRS Registration</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 font-heading">Compulsory Registration Scheme</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Self-declaration of conformity based on test report from BIS recognized lab. For electronics, IT, and LED.
          </p>
        </button>

        <button
          onClick={() => setSelectedScheme('scheme4')}
          className={`flex-1 p-4 rounded-xl border text-left transition ${
            selectedScheme === 'scheme4'
              ? 'bg-blue-50/80 border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              SCHEME IV
            </span>
            <span className="text-[11px] font-bold text-amber-700">HUID Hallmarking</span>
          </div>
          <h3 className="font-bold text-sm text-slate-900 font-heading">Grant of Hallmark for Gold</h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Registered jewellers through recognized Assaying & Hallmarking Centres (A&HCs) with 6-digit HUID.
          </p>
        </button>
      </div>

      {/* 7-Step Visual Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-6">
        <h2 className="text-base font-bold text-slate-900 font-heading flex items-center space-x-2">
          <span>Scheme I: 7-Stage End-to-End Visual Workflow</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-normal">
            Click any step for requirements
          </span>
        </h2>

        {/* Stepper Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {steps.map((s) => {
            const isCurrent = activeStep === s.step;
            const isCompleted = activeStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-xl border text-left transition ${
                  isCurrent
                    ? 'bg-blue-700 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[11px]">
                  <span className={`font-black ${isCurrent ? 'text-orange-300' : 'text-blue-700'}`}>
                    STEP {s.step}
                  </span>
                  <span className="text-[10px] opacity-80">{s.duration}</span>
                </div>
                <div className="font-bold text-xs leading-snug line-clamp-2">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Details Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded">
              Active Stage: Step {activeStep} of 7
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Estimated Duration: <strong>{steps[activeStep - 1].duration}</strong>
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
            {steps[activeStep - 1].title}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {steps[activeStep - 1].desc}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="text-slate-600 disabled:opacity-30 font-bold hover:text-slate-900"
            >
              ← Previous Stage
            </button>

            <a
              href="https://www.manakonline.in"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-800 transition"
            >
              <span>Apply on Manakonline Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setActiveStep((prev) => Math.min(7, prev + 1))}
              disabled={activeStep === 7}
              className="text-blue-700 disabled:opacity-30 font-bold hover:text-blue-900"
            >
              Next Stage →
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Documents Checklist & Fee Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Checklist */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm font-heading">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Document Checklist for Scheme I (ISI Mark)</span>
          </div>
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Structure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm font-heading">
            <Building className="w-4 h-4 text-blue-700" />
            <span>Statutory BIS Fee Schedule (Domestic Units)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
              <span className="font-semibold text-slate-700">Application Fee:</span>
              <span className="font-mono font-bold text-slate-900">₹1,000 (Non-refundable)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
              <span className="font-semibold text-slate-700">Preliminary Inspection Charge:</span>
              <span className="font-mono font-bold text-slate-900">₹7,000 per man-day + travel</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
              <span className="font-semibold text-slate-700">Annual Licence Fee:</span>
              <span className="font-mono font-bold text-slate-900">₹1,000 / Year</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
              <span className="font-semibold text-slate-700">Annual Minimum Marking Fee:</span>
              <span className="font-mono font-bold text-slate-900">₹25,000 to ₹75,000 (Product specific)</span>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
              <span className="font-bold block mb-1">MSME & Women Entrepreneur Concession:</span>
              <span>DPIIT and BIS offer 20% concession on marking fee for registered Micro and Small Enterprises and 50% concession for start-ups.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
