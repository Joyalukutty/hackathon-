"use client";

import { useEffect, useState } from "react";
import { Search, Activity, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/patients");
      const data = await res.json();
      setPatients(data);
      if (data.length > 0) setSelectedPatient(data[0]);
    } catch (e) {
      console.error("Failed to fetch patients", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Loading MedNexus Clinical Telemetry...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* LEFT: Patient Queue */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-sm tracking-wide">Patient Queue</h2>
          <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono">
            {patients.length} Active
          </span>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              placeholder="Search ID or Name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 p-3">
          {patients.map((p) => (
            <div
              key={p.patient_id}
              onClick={() => setSelectedPatient(p)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                selectedPatient?.patient_id === p.patient_id
                  ? "bg-slate-800 border-blue-500/50"
                  : "bg-slate-900 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{p.full_name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    p.esi_level === 1
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  ESI Level {p.esi_level}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">{p.chief_complaint}</p>
              <div className="mt-2 flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{p.patient_id}</span>
                <span>{p.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MIDDLE & RIGHT: Selected Patient Records & AI Decisions */}
      {selectedPatient && (
        <div className="flex-1 flex overflow-y-auto">
          {/* Middle Details */}
          <div className="flex-1 p-6 space-y-6 border-r border-slate-800">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold">{selectedPatient.full_name}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  ID: <span className="font-mono text-blue-400">{selectedPatient.patient_id}</span> | {selectedPatient.gender} | Room {selectedPatient.room}
                </p>
              </div>
            </div>

            {/* Current Vitals */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Current Vitals</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">HEART RATE</span>
                  <span className="text-lg font-bold text-slate-100">{selectedPatient.vitals.heart_rate} <span className="text-xs font-normal text-slate-400">bpm</span></span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">BLOOD PRESSURE</span>
                  <span className="text-lg font-bold text-slate-100">{selectedPatient.vitals.bp} <span className="text-xs font-normal text-slate-400">mmHg</span></span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">SPO2</span>
                  <span className="text-lg font-bold text-slate-100">{selectedPatient.vitals.spo2}%</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">TEMPERATURE</span>
                  <span className="text-lg font-bold text-slate-100">{selectedPatient.vitals.temperature} °C</span>
                </div>
              </div>
            </div>

            {/* Differential Diagnoses */}
            <div>
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3">Differential Diagnoses</h3>
              <div className="space-y-2">
                {selectedPatient.differential_diagnosis.map((d: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{d.condition}</span>
                    <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">{d.probability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right AI Intelligence Panel */}
          <div className="w-96 p-6 space-y-6 bg-slate-900/30">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">AI Intelligence</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                selectedPatient.execution_mode === "CLOUD_GEMINI" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {selectedPatient.execution_mode === "CLOUD_GEMINI" ? "Cloud Gemini" : "Local GPU"}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <div className="text-3xl font-black text-emerald-400">
                {(selectedPatient.confidence_score * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-slate-400">AI Confidence Score</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Reasoning Trace</h4>
              <ul className="space-y-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                {selectedPatient.clinical_reasoning_trace.map((t: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-blue-400">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}