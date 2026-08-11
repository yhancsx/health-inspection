import React, { useState } from 'react';
import Badge from './Badge';
import DoctorOpinionCard from './DoctorOpinionCard';
import { Calendar, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function YearlyDetail({ yearData, prevYearData, searchQuery }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  if (!yearData) return null;

  const toggleCategory = (catName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Helper to find previous year value for delta calculation
  const getPrevVal = (key) => {
    if (!prevYearData || !prevYearData.categories) return null;
    for (const cat of prevYearData.categories) {
      const item = cat.items?.find((i) => i.key === key);
      if (item && typeof item.value === 'number') return item.value;
    }
    return null;
  };

  // Filter categories and items by search query
  const filteredCategories = (yearData.categories || []).map((category) => {
    if (!searchQuery) return category;
    const q = searchQuery.toLowerCase();
    const items = (category.items || []).filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.key && item.key.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q))
    );
    return { ...category, items };
  }).filter((category) => category.items && category.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Doctor Opinion Section */}
      <DoctorOpinionCard
        doctorOpinion={yearData.doctor_opinion}
        examDate={yearData.basic_info?.exam_date}
        year={yearData.year}
      />

      {/* Category Tables Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          {yearData.year}년 검사 항목별 세부 결과
        </h3>
        <span className="text-xs text-slate-400">
          총 {filteredCategories.reduce((acc, c) => acc + c.items.length, 0)}개 항목 표시 중
        </span>
      </div>

      {/* Category Tables */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const isCollapsed = expandedCategories[category.name] === false;

          return (
            <div
              key={category.name}
              className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-slate-800 transition-all"
            >
              {/* Category Bar */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/60 hover:bg-slate-900/90 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200">{category.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {category.items.length}개 항목
                  </span>
                </div>
                <div className="text-slate-400 hover:text-slate-200">
                  {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </div>
              </button>

              {/* Table Contents */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/60 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800/80">
                      <tr>
                        <th className="py-3 px-6">검사항목</th>
                        <th className="py-3 px-6 text-right">검사결과</th>
                        <th className="py-3 px-6 text-center">전년 대비 ($\Delta$)</th>
                        <th className="py-3 px-6">임상 참고치</th>
                        <th className="py-3 px-6 text-center">판정 구분</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {category.items.map((item, idx) => {
                        const prevVal = getPrevVal(item.key);
                        let delta = null;
                        if (typeof item.value === 'number' && typeof prevVal === 'number') {
                          delta = (item.value - prevVal).toFixed(1);
                        }

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-slate-800/30 transition-colors group"
                          >
                            <td className="py-3.5 px-6 font-medium text-slate-200 group-hover:text-indigo-300">
                              {item.name}
                            </td>
                            <td className="py-3.5 px-6 text-right font-mono font-semibold text-slate-100">
                              {item.value} <span className="text-xs font-normal text-slate-400 ml-0.5">{item.unit !== '-' ? item.unit : ''}</span>
                            </td>
                            <td className="py-3.5 px-6 text-center font-mono text-xs">
                              {delta !== null ? (
                                parseFloat(delta) > 0 ? (
                                  <span className="inline-flex items-center text-rose-400 font-medium">
                                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{delta}
                                  </span>
                                ) : parseFloat(delta) < 0 ? (
                                  <span className="inline-flex items-center text-sky-400 font-medium">
                                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />{delta}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center text-slate-500">
                                    <Minus className="w-3.5 h-3.5 mr-0.5" />0.0
                                  </span>
                                )
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-slate-400 font-mono text-xs">
                              {item.ref_range}
                            </td>
                            <td className="py-3.5 px-6 text-center">
                              <Badge status={item.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
