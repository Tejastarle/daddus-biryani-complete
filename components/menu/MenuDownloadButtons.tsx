'use client';

import { Download, MessageCircle } from 'lucide-react';
import { useLead } from '@/components/LeadProvider';
import { waLink } from '@/lib/site';

export default function MenuDownloadButtons() {
  const { openMenu } = useLead();
  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={openMenu} className="btn-brass"><Download size={18} /> Download menu (PDF & Excel)</button>
      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle size={18} /> Order on WhatsApp</a>
    </div>
  );
}
