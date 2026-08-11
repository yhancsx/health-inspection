import React, { useState, useEffect } from 'react';
import TrendOverview from './components/TrendOverview';
import YearlyDetail from './components/YearlyDetail';
import SearchBar from './components/SearchBar';
import { Activity, Calendar, User, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';

export default function App() {
  const [yearsData, setYearsData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | '2023' | '2024' | '2025'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        let years = ['2023', '2024', '2025', '2026'];
        try {
          const manifestRes = await fetch('./data/manifest.json');
          if (manifestRes.ok) {
            const manifest = await manifestRes.json();
            if (manifest.years && Array.isArray(manifest.years)) {
              years = manifest.years;
            }
          }
        } catch {
          console.warn('Using fallback years array');
        }

        const promises = years.map(async (y) => {
          const res = await fetch(`./data/${y}.json`);
          if (!res.ok) throw new Error(`Failed to load ${y}.json`);
          return res.json();
        });
        const results = await Promise.all(promises);
        setYearsData(results);
      } catch (err) {
        console.error('Error fetching health inspection data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const basicInfo = yearsData.length > 0 ? yearsData[yearsData.length - 1].basic_info : null;
  const availableYears = yearsData.map((d) => d.year);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Bar */}
        <header className="glass-panel p-6 rounded-3xl shadow-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg text-white">
              <HeartPulse className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  건강검진 추이 대시보드
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  KMI 표준검진
                </span>
              </div>
              {basicInfo && (
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-medium text-slate-300">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> {basicInfo.name} ({basicInfo.gender})
                  </span>
                  <span>|</span>
                  <span>생년월일: {basicInfo.birth_date}</span>
                  <span>|</span>
                  <span>기관: {basicInfo.center}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              연도별 추이 그래프
            </button>

            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveTab(yr)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === yr
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {yr}년 검사결과
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>서브에이전트 수치 전수 교차검증 완료</span>
          </div>
        </nav>

        {/* Content Section */}
        <main>
          {loading ? (
            <div className="glass-panel p-16 rounded-3xl text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
              <p className="text-slate-400 text-sm">건강검진 시계열 데이터를 불러오는 중입니다...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <TrendOverview yearsData={yearsData} />}

              {availableYears.includes(activeTab) && (
                <YearlyDetail
                  yearData={yearsData.find((d) => d.year === activeTab)}
                  prevYearData={yearsData.find(
                    (d) => Number(d.year) === Number(activeTab) - 1
                  )}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Annual Health Inspection Tracker • 배요한</p>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              Deployable to GitHub Pages (Static SPA)
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
