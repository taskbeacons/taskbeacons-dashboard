import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How do I secure an agent sandbox environment?',
    a: 'Every AI agent runs inside an isolated, stateless Docker container instance. Network requests are filtered via custom firewall rules configured in your integrations tab, preventing credential leak and securing database connection lines.'
  },
  {
    q: 'What happens when a webhook rate limit is reached?',
    a: 'TaskBeacons registers rate limits according to your enterprise tier. When exceeded, tasks are gracefully suspended and queued for replay with exponential backoff timers, preventing duplicate task dispatching.'
  },
  {
    q: 'Can I integrate custom Python scripting engines?',
    a: 'Yes, through our upcoming Developer SDK. You will be able to upload custom runtime scripts which are executed on-demand within dedicated executor pods with secure credential bindings.'
  }
];

export const Help: React.FC = () => {
  const toast = useToast();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Ticket form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.showToast('Please fill out all fields in the support ticket form.', 'error');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.showToast('Security incident ticket submitted. A SecOps engineer will contact you shortly.', 'success');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black uppercase text-white tracking-wide">
          Operations Help Desk
        </h2>
        <p className="text-xs text-white/40 mt-1 leading-relaxed">
          Access system FAQs, read docker isolation guides, and dispatch high-priority support tickets to TaskBeacons support staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* FAQs Accordions left */}
        <div className="bg-[#121212] border border-white/5 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 mb-4">
            <HelpCircle size={14} className="text-brand" /> Operation Guidelines
          </h3>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="border border-white/5 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 flex justify-between items-center text-left bg-black/20 hover:bg-black/40 transition-colors"
                  >
                    <span className="text-xs font-bold text-white uppercase font-sans tracking-wide">{faq.q}</span>
                    {isOpen ? <ChevronUp size={14} className="text-brand" /> : <ChevronDown size={14} className="text-white/30" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-[#0e0e0e]/50 border-t border-white/5 text-xs text-white/55 leading-relaxed font-mono">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support ticket submission form right */}
        <form 
          onSubmit={handleSendTicket}
          className="bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2 mb-6">
              <Mail size={14} className="text-brand" /> Open High-Priority Support Ticket
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Ticket Subject (Objective Summary)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rate limit increase request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1.5 font-mono">
                  Detailed Diagnostic Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Specify system errors, sandbox configurations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-brand/50 font-mono resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-[#00d4b4] hover:bg-[#00b89e] disabled:opacity-50 text-[#0a0a0a] font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={12} /> Dispatch Ticket
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
