"use client";
import React, { useState, useEffect } from "react";
import { 
  BarChart3, Users, AlertTriangle, TrendingUp, 
  MapPin, RefreshCw, Layers 
} from "lucide-react";

export default function Dashboard(){
  const [summary, setSummary] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedState, setSelectedState] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (stateFilter: string = "") => {
    setLoading(true);
    try {
      const summaryRes = await fetch("http://127.0.0.1:8000/api/dashboard-summary");
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      let url = "http://127.0.0.1:8000/api/districts";
      if (stateFilter) {
        url += `?state=${stateFilter}`;
      }
      const districtRes = await fetch(url);
      const districtData = await districtRes.json();
      setDistricts(districtData);
    } catch (error) {
      console.error("Error connecting to Python backend:", error);
    }
    setLoading(false);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    setSelectedState(state);
    fetchData(state);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">SIH 26246</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">MSDE Decision Support System</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">SkillSight AI Dashboard</h1>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <button 
            onClick={() => fetchData(selectedState)}
            className="flex items-center gap-2 bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} /> Refresh Live Feed
          </button>
        </div>
      </header>

      <div>className="max-w-7xl mx-auto space-y-8"</div> 
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Active Demand</p>
                <h3 className="text-2xl font-bold text-slate-900">{summary.total_demand?.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><BarChart3 size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Training Supply</p>
                <h3 className="text-2xl font-bold text-slate-900">{summary.total_supply?.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Critical Shortage Trades</p>
                <h3 className="text-2xl font-bold text-slate-900">{summary.critical_shortages}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg"><TrendingUp size={24} /></div>
              <div>
                <p className="text-sm font-medium text-slate-500">Saturated / Oversupply</p>
                <h3 className="text-2xl font-bold text-slate-900">{summary.saturated_trades}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MapPin size={18} className="text-blue-600" /> Filter State:
          </span>
         <select 
  value={selectedState} 
  onChange={handleStateChange}
  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">All States (Pan-India National View)</option>
  <option value="Maharashtra">Maharashtra</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Delhi">Delhi</option>
  <option value="Telangana">Telangana</option>
  <option value="West Bengal">West Bengal</option>
</select>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers size={20} className="text-blue-600" /> District-Level Gap Analysis & AI Policy Recommendations
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
              Showing {districts.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Sector / Trade</th>
                  <th className="p-4 font-semibold">Demand vs Supply</th>
                  <th className="p-4 font-semibold">Net Gap</th>
                  <th className="p-4 font-semibold">Market Status</th>
                  <th className="p-4 font-semibold">AI Policy Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading AI intelligence model...</td>
                  </tr>
                ) : districts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">No records found.</td>
                  </tr>
                ) : (
                  districts.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-medium text-slate-900">
                        {item.district} <span className="block text-xs text-slate-400 font-normal">{item.state}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-800">{item.trade}</span>
                        <span className="block text-xs text-blue-600">{item.sector}</span>
                      </td>
                      <td className="p-4 text-slate-600">
                        D: <strong className="text-slate-900">{item.current_demand}</strong> / S: <strong className="text-slate-900">{item.current_supply}</strong>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${item.gap > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {item.gap > 0 ? `+${item.gap}` : item.gap}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status.includes("Shortage") 
                            ? 'bg-amber-100 text-amber-800' 
                            : item.status.includes("Saturated") 
                            ? 'bg-rose-100 text-rose-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-600 max-w-xs bg-slate-50/50 rounded">
                        {item.recommendation}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};