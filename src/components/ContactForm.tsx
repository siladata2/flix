'use client';
import { useState } from 'react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: 'general', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setStatus(res.ok ? 'sent' : 'error');
  }

  if (status === 'sent') return <p className="text-sm text-ink-dim">Thanks — your message has been sent. We&apos;ll get back to you soon.</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Honeypot — hidden from real users via CSS, bots fill every field */}
      <input type="text" name="website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

      <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm" />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm" />
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm">
        <option value="general">General inquiry</option>
        <option value="technical">Technical support</option>
        <option value="account">Account support</option>
        <option value="copyright">Copyright report</option>
      </select>
      <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm" />
      <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-bg-card border border-line rounded-lg px-3.5 py-2.5 text-sm" />
      {status === 'error' && <p className="text-brand text-sm">Could not send — please try again.</p>}
      <button type="submit" disabled={status === 'sending'} className="self-start bg-gold text-[#171412] font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-[#f0b25a] disabled:opacity-50">
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
