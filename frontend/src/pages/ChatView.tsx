import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  ExternalLink,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { ChatResponse, ActionItem } from '../types';
import { EvidencePanel } from '../components/EvidencePanel';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  responseMeta?: ChatResponse;
  timestamp: string;
}

interface ChatViewProps {
  initialQuery?: string;
  language: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialQuery,
  language,
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<ChatResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    {
      title: 'Electric Kettle (1500W)',
      prompt: 'I want to manufacture a 1500W electric kettle in India. Which Indian Standard applies, is BIS certification required, what tests are needed, and where can I get it tested?'
    },
    {
      title: 'Packaged Drinking Water',
      prompt: 'Is BIS certification compulsory for packaged drinking water, and what are the microbiological requirements under IS 14543?'
    },
    {
      title: 'Children Toys Safety',
      prompt: 'Which standard governs the safety of children plastic toys, and is the Toys QCO mandatory for domestic manufacturers?'
    },
    {
      title: 'HUID & Gold Jewellery',
      prompt: 'What is HUID in gold jewellery, what does 22K916 fineness mean, and how does BIS CARE app verify it?'
    },
    {
      title: 'Grounded Refusal Test',
      prompt: 'Does BIS require certification for an experimental quantum telepathy helmet?'
    }
  ];

  // If initialQuery is provided, submit it automatically
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.sendChatMessage(text, language);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        responseMeta: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveEvidence(data);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error connecting to BIS Knowledge Service: ${err.message || 'Please ensure the backend server is running.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown hashtags and asterisks for cleaner speech
      const cleaned = text.replace(/[#*`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleActionClick = (action: ActionItem) => {
    if (action.action_type === 'link') {
      window.open(action.target, '_blank');
    } else {
      if (action.target.startsWith('/standards/')) {
        onNavigate('standards', action.target.replace('/standards/', ''));
      } else if (action.target.startsWith('/laboratories')) {
        onNavigate('laboratories');
      } else if (action.target === '/certification') {
        onNavigate('certification');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Chat Window (8 Columns) */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-subtle overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm text-slate-900 font-heading">
                  MANAK AI RAG Assistant
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Strictly Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Department of Consumer Affairs • Authorized BIS Knowledge Corpus
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMessages([]);
                setActiveEvidence(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 p-1.5 rounded-md transition flex items-center space-x-1"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 font-heading">
                How can MANAK AI guide your BIS compliance today?
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-md">
                Ask any question regarding Indian Standards, QCO mandates, factory testing requirements, LIMS laboratories, or hallmarking regulations.
              </p>

              {/* Sample Prompts */}
              <div className="w-full space-y-2 text-left">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Sample Compliance Scenarios:
                </div>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(p.prompt)}
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition text-xs flex items-center justify-between group shadow-subtle"
                  >
                    <div>
                      <span className="font-bold text-blue-900 block font-heading">{p.title}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">{p.prompt}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-700 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isUser
                        ? 'bg-blue-900 text-white'
                        : 'bg-gradient-to-tr from-blue-700 to-indigo-700 text-white shadow'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-blue-700 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3'
                      }`}
                    >
                      {/* Markdown-like rendering */}
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.content}
                      </div>

                      {/* Assistant Actions & Evidence Button */}
                      {!isUser && msg.responseMeta && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          {msg.responseMeta.suggested_actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-900 px-2.5 py-1 rounded-md text-[11px] font-semibold transition"
                            >
                              <span>{act.label}</span>
                              {act.action_type === 'link' ? (
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              ) : (
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                              )}
                            </button>
                          ))}

                          <button
                            onClick={() => setActiveEvidence(msg.responseMeta!)}
                            className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-blue-200 ml-auto"
                          >
                            <span>Inspect Evidence Panel ➔</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer Tools: Timestamp, Copy, Speak */}
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-slate-600 transition flex items-center space-x-0.5"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => handleSpeak(msg.content)}
                            className="hover:text-slate-600 transition flex items-center space-x-0.5"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Read Out</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex items-center space-x-3 text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center space-x-2 text-xs">
                <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
                <span className="font-medium text-slate-700">
                  Synthesizing answer from Know Your Standards & QCO Registry...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Indian Standards, QCOs, labs, or testing requirements..."
              className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 px-4 py-3 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-slate-400 text-center">
            Grounded against Bureau of Indian Standards (BIS) knowledge base. Always verify before statutory filing.
          </div>
        </div>
      </div>

      {/* Right Evidence Panel (4 Columns) */}
      <div className="lg:col-span-4 h-full">
        <EvidencePanel
          evidence={activeEvidence?.evidence}
          productDetected={activeEvidence?.product_detected}
          isMandatory={activeEvidence?.is_mandatory}
          isRefusal={activeEvidence?.is_refusal}
        />
      </div>
    </div>
  );
};
