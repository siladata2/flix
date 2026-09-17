'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

export function NewCategoryForm() {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('categories').insert({ name: name.trim(), slug: slugify(name) });
    setSaving(false);
    setName('');
    router.refresh();
  }

  return (
    <form onSubmit={add} className="flex gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="bg-bg-card border border-line rounded-lg px-3.5 py-2 text-sm" />
      <button disabled={saving} className="bg-gold text-[#171412] font-semibold rounded-lg px-4 py-2 text-sm hover:bg-[#f0b25a] disabled:opacity-50">Add</button>
    </form>
  );
}
