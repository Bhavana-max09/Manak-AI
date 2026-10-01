import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Building2,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { LaboratoryItem } from '../types';

interface LaboratoriesViewProps {
  initialStandardFilter?: string;
  onAskAI: (query: string) => void;
}

export const LaboratoriesView: React.FC<LaboratoriesViewProps> = ({
  initialStandardFilter,
  onAskAI
}) => {
  const [laboratories, setLaboratories] = useState<LaboratoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStandard, setSelectedStandard] = useState(initialStandardFilter || '');
  const [selectedState, setSelectedState] = useState('all');

  const standardOptions = [
    { label: 'All Standards', value: '' },
    { label: 'IS 302-2-15 (Electric Kettles)', value: 'IS 302-2-15' },
    { label: 'IS 14543 (Packaged Water)', value: 'IS 14543' },
    { label: 'IS 9873-1 (Toys Safety)', value: 'IS 9873-1' },
    { label: 'IS 2347 (Pressure Cookers)', value: 'IS 2347' },
    { label: 'IS 4151 (Two-Wheeler Helmets)', value: 'IS 4151' },
    { label: 'IS 1786 (TMT Steel Bars)', value: 'IS 1786' },
    { label: 'IS 269 (Portland Cement)', value: 'IS 269' },
    { label: 'IS 15844-1 (Sports Footwear)', value: 'IS 15844-1' }
  ];

  const stateOptions = [
    { label: 'All States', value: 'all' },
    { label: 'Karnataka (Bengaluru)', value: 'Karnataka' },
    { label: 'Delhi-NCR (Ghaziabad/Noida)', value: 'Delhi-NCR' },
    { label: 'Maharashtra (Mumbai)', value: 'Maharashtra' },
    { label: 'Tamil Nadu (Chennai)', value: 'Tamil Nadu' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' }
  ];

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const data = await api.getLaboratories(selectedStandard, selectedState);
      setLaboratories(data.laboratories);
    } catch (err) {
      console.error('Error fetching laboratories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, [selectedStandard, selectedState]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-purple-800 text-xs font-bold uppercase tracking-wider mb-1">
          <FlaskConical className="w-4 h-4 text-purple-600" />
          <span>BIS LIMS Testing Ecosystem</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Authorized Testing Laboratories (LIMS)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Search BIS Central, Regional, and Recognized independent laboratories accredited under ISO/IEC 17025 for conformity sample testing.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row gap-3">
        {/* Standard Dropdown */}
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Filter by Indian Standard:
          </label>
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-medium px-3 py-2 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            {standardOptions.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div className="w-full md:w-64">
          <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
            Location / State:
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-medium px-3 py-2 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            {stateOptions.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Laboratories List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          Loading authorized testing laboratories...
        </div>
      ) : laboratories.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-700">No matching laboratories found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try choosing 'All States' or clearing the Indian Standard filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {laboratories.map((lab) => (
            <div
              key={lab.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-subtle hover:border-purple-300 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-mono">
                      {lab.lab_code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mt-1 font-heading">
                      {lab.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full shrink-0">
                    {lab.lab_type}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{lab.address}, {lab.district}, {lab.state} - {lab.pincode}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{lab.phone} (Contact: {lab.contact_person})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{lab.email}</span>
                  </div>
                </div>

                {/* Supported Test Scopes */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1">
                    <Tag className="w-3 h-3 text-purple-600" />
                    <span>Accredited Testing Capabilities ({lab.supported_standards.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {lab.supported_standards.map((scope, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900">{scope.is_number}</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                            ₹{scope.testing_charge_inr.toLocaleString()} (Est. {scope.sample_turnaround_days} Days)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {scope.product}
                        </div>
                        <div className="pt-1 flex flex-wrap gap-1">
                          {scope.tests_supported.map((test, tIdx) => (
                            <span key={tIdx} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                              ✓ {test}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Accreditation: <strong className="text-slate-600">{lab.accreditation_status}</strong>
                </span>
                <button
                  onClick={() => onAskAI(`What is the sample testing procedure at ${lab.name} for ${lab.supported_standards[0]?.is_number}?`)}
                  className="font-bold text-purple-700 hover:text-purple-900"
                >
                  Ask AI About This Lab ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
