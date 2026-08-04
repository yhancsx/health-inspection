import React from 'react';
import { Stethoscope, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import Badge from './Badge';

export default function DoctorOpinionCard({ doctorOpinion, examDate, year }) {
  if (!doctorOpinion) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
              {year}년 건강검진 종합의학소견
            </h3>
            <p className="text-xs text-slate-400">검진일자: {examDate || `${year}년`}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-sm leading-relaxed text-slate-200">
          {doctorOpinion.summary}
        </div>

        {doctorOpinion.evaluations && doctorOpinion.evaluations.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              주요 사후관리 항목 및 판단 소견
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctorOpinion.evaluations.map((evalItem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {evalItem.status.includes('A') || evalItem.status.includes('정상') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : evalItem.status.includes('E') || evalItem.status.includes('높음') ? (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-semibold text-slate-300 block">
                        [{evalItem.category}] {evalItem.finding}
                      </span>
                    </div>
                  </div>
                  <Badge status={evalItem.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
