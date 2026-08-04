import React from 'react';

export default function Badge({ status }) {
  if (!status) return null;

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (status.includes('정상A') || status === '정상') {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (status.includes('경과관찰') || status.includes('경계') || status.includes('주의') || status.includes('약양성')) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (status.includes('상담필요') || status.includes('높음') || status.includes('양성') || status.includes('E(')) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs border ${colorClasses}`}>
      {status}
    </span>
  );
}
