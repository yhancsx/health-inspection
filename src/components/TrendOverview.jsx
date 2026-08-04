import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, Heart, Droplet, Flame, ShieldAlert, Scale, TableProperties } from 'lucide-react';
import Badge from './Badge';

export default function TrendOverview({ yearsData }) {
  if (!yearsData || yearsData.length === 0) return null;

  // Prepare chart dataset chronologically
  const chartData = yearsData.map((data) => {
    const getVal = (key) => {
      for (const cat of data.categories || []) {
        const item = cat.items?.find((i) => i.key === key);
        if (item && typeof item.value === 'number') return item.value;
      }
      return null;
    };

    return {
      year: data.year,
      height: getVal('height'),
      weight: getVal('weight'),
      bmi: getVal('bmi'),
      waist: getVal('waist'),
      bp_sys: getVal('bp_sys'),
      bp_dia: getVal('bp_dia'),
      glucose: getVal('fasting_glucose'),
      total_chol: getVal('total_cholesterol'),
      hdl: getVal('hdl_cholesterol'),
      ldl: getVal('ldl_cholesterol'),
      triglycerides: getVal('triglyceride'),
      ast: getVal('ast'),
      alt: getVal('alt'),
      gamma_gtp: getVal('gamma_gtp'),
      egfr: getVal('egfr'),
      creatinine: getVal('creatinine'),
      uric_acid: getVal('uric_acid'),
      hscrp: getVal('hscrp'),
    };
  });

  // All metrics grouped into categories for multi-year side-by-side comparison
  const allMetricGroups = [
    {
      group: '계측 및 비만 / 혈압 지표',
      items: [
        { key: 'height', name: '키', unit: 'cm' },
        { key: 'weight', name: '몸무게', unit: 'kg' },
        { key: 'bmi', name: '체질량지수(BMI)', unit: 'kg/㎡' },
        { key: 'waist', name: '허리둘레', unit: 'cm' },
        { key: 'bp_sys', name: '수축기 혈압', unit: 'mmHg' },
        { key: 'bp_dia', name: '이완기 혈압', unit: 'mmHg' },
        { key: 'pulse', name: '맥박수', unit: '회/분' }
      ]
    },
    {
      group: '당뇨 & 지질대사 / 심혈관 지표',
      items: [
        { key: 'fasting_glucose', name: '공복혈당', unit: 'mg/dL' },
        { key: 'hba1c', name: '당화혈색소(HbA1c)', unit: '%' },
        { key: 'total_cholesterol', name: '총콜레스테롤', unit: 'mg/dL' },
        { key: 'hdl_cholesterol', name: 'HDL 콜레스테롤', unit: 'mg/dL' },
        { key: 'ldl_cholesterol', name: 'LDL 콜레스테롤', unit: 'mg/dL' },
        { key: 'triglyceride', name: '중성지방', unit: 'mg/dL' }
      ]
    },
    {
      group: '간기능 지표',
      items: [
        { key: 'ast', name: 'AST (SGOT)', unit: 'IU/L' },
        { key: 'alt', name: 'ALT (SGPT)', unit: 'IU/L' },
        { key: 'gamma_gtp', name: '감마지티피(γ-GTP)', unit: 'IU/L' },
        { key: 'total_protein', name: '총단백', unit: 'g/dL' },
        { key: 'albumin', name: '알부민', unit: 'g/dL' },
        { key: 'globulin', name: '글로불린', unit: 'g/dL' },
        { key: 'ag_ratio', name: 'A/G 비율', unit: '-' }
      ]
    },
    {
      group: '신장기능 & 염증 지표',
      items: [
        { key: 'bun', name: '요소질소 (BUN)', unit: 'mg/dL' },
        { key: 'creatinine', name: '혈청 크레아티닌', unit: 'mg/dL' },
        { key: 'egfr', name: '신사구체여과율(e-GFR)', unit: 'mL/min/1.73㎡' },
        { key: 'hscrp', name: 'hs-CRP 염증수치', unit: 'mg/L' }
      ]
    },
    {
      group: '혈액학 & 종양표지자 / 갑상선 / 전해질',
      items: [
        { key: 'hemoglobin', name: '혈색소(Hb)', unit: 'g/dL' },
        { key: 'wbc', name: '백혈구수', unit: 'x10³/uL' },
        { key: 'platelet', name: '혈소판수', unit: 'x10³/uL' },
        { key: 'uric_acid', name: '요산 (Uric Acid)', unit: 'mg/dL' },
        { key: 'rf', name: '류마티스인자 (RF)', unit: '-' },
        { key: 'tsh', name: '갑상선자극호르몬 (TSH)', unit: 'uIU/mL' },
        { key: 'free_t4', name: '游離 갑상선호르몬 (Free T4)', unit: 'ng/dL' },
        { key: 'cea', name: 'CEA (대장/폐암)', unit: 'ng/mL' },
        { key: 'ca19_9', name: 'CA 19-9 (췌장/담도암)', unit: 'U/mL' },
        { key: 'afp', name: 'AFP (간암)', unit: 'ng/mL' },
        { key: 'psa', name: 'PSA (전립선암)', unit: 'ng/mL' },
        { key: 'natrium', name: 'Na+ (나트륨)', unit: 'mmol/L' },
        { key: 'kalium', name: 'K+ (칼륨)', unit: 'mmol/L' },
        { key: 'chlorine', name: 'Cl- (염소)', unit: 'mmol/L' },
        { key: 'magnesium', name: 'Mg (마그네슘)', unit: 'mg/dL' }
      ]
    },
    {
      group: '안과 / 청력 / 안압 & 체성분',
      items: [
        { key: 'vision_left', name: '시력 (좌)', unit: '-' },
        { key: 'vision_right', name: '시력 (우)', unit: '-' },
        { key: 'hearing', name: '청력 (좌/우)', unit: '-' },
        { key: 'iop_left', name: '안압 (좌)', unit: 'mmHg' },
        { key: 'iop_right', name: '안압 (우)', unit: 'mmHg' },
        { key: 'tbw', name: '체수분', unit: 'kg' },
        { key: 'body_protein', name: '단백질', unit: 'kg' },
        { key: 'minerals', name: '무기질', unit: 'kg' },
        { key: 'body_fat', name: '체지방량', unit: 'kg' }
      ]
    },
    {
      group: '기타 영상 / 생체기능 / 특수 검사 소견',
      items: [
        { key: 'ecg', name: '심전도검사', unit: '-' },
        { key: 'chest_xray', name: '흉부 X-ray', unit: '-' },
        { key: 'stomach_exam', name: '위장검사', unit: '-' },
        { key: 'us_gb', name: '담낭 초음파', unit: '-' },
        { key: 'us_prostate', name: '전립선 초음파', unit: '-' },
        { key: 'us_thyroid', name: '갑상선 초음파', unit: '-' },
        { key: 'bmd', name: '골밀도 검사', unit: '-' },
        { key: 'allergy', name: '알레르기 107종', unit: '-' }
      ]
    },
    {
      group: '소변 검사 지표',
      items: [
        { key: 'urine_protein', name: '요단백', unit: '-' },
        { key: 'urine_glucose', name: '요당', unit: '-' },
        { key: 'urine_sg', name: '요비중', unit: '-' },
        { key: 'urine_ph', name: '요 pH', unit: '-' }
      ]
    }
  ];

  // Helper to extract item details for a specific year
  const getItemDetails = (yearStr, key) => {
    const data = yearsData.find((d) => d.year === yearStr);
    if (!data || !data.categories) return null;
    for (const cat of data.categories) {
      const item = cat.items?.find((i) => i.key === key);
      if (item) return item;
    }
    return null;
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            연도별 핵심 건강지표 변화 추이 (2023 - 2025)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            건강검진 수치를 바탕으로 주요 추이 그래프 및 전체 지표 비교표를 제공합니다.
          </p>
        </div>
      </div>

      {/* Grid of Visual Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Body Composition & BMI */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-400" />
              체중 및 체질량지수 (BMI)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
              표준 체중 유지 중
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis yAxisId="left" domain={[55, 75]} stroke="#38bdf8" />
                <YAxis yAxisId="right" orientation="right" domain={[15, 30]} stroke="#a855f7" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="weight" name="체중 (kg)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="bmi" name="BMI (kg/m²)" stroke="#a855f7" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Blood Pressure Trend */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              혈압 추이 (수축기 / 이완기)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              정상 범위 (120/80 미만)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis domain={[40, 140]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <ReferenceLine y={120} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '고혈압 경계 (120)', fill: '#f43f5e', fontSize: 10 }} />
                <Line type="monotone" dataKey="bp_sys" name="수축기 (mmHg)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="bp_dia" name="이완기 (mmHg)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Fasting Glucose (Diabetes) */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-amber-400" />
              공복혈당 추이 (mg/dL)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              공복혈당장애 경계 관찰 필요
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis domain={[80, 130]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '정상 기준치 (100 미만)', fill: '#f59e0b', fontSize: 11 }} />
                <Line type="monotone" dataKey="glucose" name="공복혈당 (mg/dL)" stroke="#fbbf24" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Lipid Profile (Cholesterol) */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Flame className="w-5 h-5 text-purple-400" />
              지질 프로필 추이 (콜레스테롤 & 중성지방)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
              2025년 LDL/총콜레스테롤 상승 주의
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis domain={[30, 260]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '총콜레스테롤 기준 (200)', fill: '#ef4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="total_chol" name="총콜레스테롤" stroke="#c084fc" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ldl" name="LDL (나쁜 콜레스테롤)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="hdl" name="HDL (좋은 콜레스테롤)" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="triglycerides" name="중성지방" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Liver Function (AST / ALT / GTP) */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              간기능 수치 (AST / ALT / γ-GTP)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              3년 연속 매우 양호 (정상 A)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis domain={[0, 50]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="ast" name="AST (IU/L)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="alt" name="ALT (IU/L)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="gamma_gtp" name="γ-GTP (IU/L)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Kidney Function & Inflammation (eGFR / hs-CRP) */}
        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              신장기능 및 염증 수치 (e-GFR & hs-CRP)
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              2023년 hs-CRP 상승 후 2025년 정상 회복 (0.1mg/L)
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis yAxisId="left" domain={[50, 90]} stroke="#38bdf8" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 12]} stroke="#f43f5e" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="egfr" name="신사구체여과율 e-GFR" stroke="#38bdf8" strokeWidth={3} dot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="hscrp" name="hs-CRP 염증수치 (mg/L)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* --- All Metrics Multi-Year Comparison Table --- */}
      <div className="glass-panel p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <TableProperties className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-100 flex items-center gap-2">
                전체 검사 지표 연도별 종합 비교표 (2023 - 2025)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                TSH, Free T4, 당화혈색소, 전해질, 안과, 청력, 체성분 및 주요 기능 지표 100% 통합 비교표입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {allMetricGroups.map((groupObj) => (
            <div key={groupObj.group} className="space-y-3">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2 border-l-4 border-indigo-500 pl-3 py-0.5">
                {groupObj.group}
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950/80 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-5">검사항목 (임상 참고치)</th>
                      <th className="py-3.5 px-4 text-center">단위</th>
                      <th className="py-3.5 px-5 text-center bg-slate-900/80 text-slate-300">2023년</th>
                      <th className="py-3.5 px-5 text-center bg-slate-900/80 text-slate-300">2024년</th>
                      <th className="py-3.5 px-5 text-center bg-slate-900/80 text-slate-300">2025년</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {groupObj.items.map((def) => {
                      const d2023 = getItemDetails('2023', def.key);
                      const d2024 = getItemDetails('2024', def.key);
                      const d2025 = getItemDetails('2025', def.key);
                      const refRange = d2025?.ref_range || d2024?.ref_range || d2023?.ref_range || '-';

                      return (
                        <tr key={def.key} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-5">
                            <div className="font-medium text-slate-200">{def.name}</div>
                            {refRange && refRange !== '-' && (
                              <div className="text-xs text-slate-400 font-mono mt-0.5">
                                참고치: {refRange}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">
                            {def.unit}
                          </td>

                          {/* 2023 Column */}
                          <td className="py-3 px-5 text-center bg-slate-950/20">
                            {d2023 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-mono font-semibold text-slate-100">{d2023.value}</span>
                                <Badge status={d2023.status} />
                              </div>
                            ) : (
                              <span className="text-slate-600 text-xs">미실시</span>
                            )}
                          </td>

                          {/* 2024 Column */}
                          <td className="py-3 px-5 text-center bg-slate-950/20">
                            {d2024 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-mono font-semibold text-slate-100">{d2024.value}</span>
                                <Badge status={d2024.status} />
                              </div>
                            ) : (
                              <span className="text-slate-600 text-xs">미실시</span>
                            )}
                          </td>

                          {/* 2025 Column */}
                          <td className="py-3 px-5 text-center bg-slate-950/20">
                            {d2025 ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-mono font-semibold text-slate-100">{d2025.value}</span>
                                <Badge status={d2025.status} />
                              </div>
                            ) : (
                              <span className="text-slate-600 text-xs">미실시</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
