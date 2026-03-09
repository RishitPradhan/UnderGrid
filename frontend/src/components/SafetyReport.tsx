import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Brain, RefreshCw, FileText, AlertTriangle, Users, Shield, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SERVER = "http://localhost:3000";

export default function SafetyReport() {
    const [report, setReport] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedAt, setGeneratedAt] = useState<string | null>(null);

    const generate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(`${SERVER}/report/generate`, {}, { timeout: 30000 });
            if (res.data.success) {
                setReport(res.data.data.report);
                setStats(res.data.data.stats);
                setGeneratedAt(res.data.data.generatedAt);
            } else {
                setError(res.data.message || "Failed to generate report");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="glass-card-accent p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <Brain className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI Safety Report</h2>
                            <p className="text-[13px] text-white/35 mt-0.5">Gemini-powered safety analysis from live data</p>
                        </div>
                    </div>
                    <button
                        onClick={generate}
                        disabled={loading}
                        className="btn-primary px-5 py-2.5 flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        {loading ? (
                            <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
                        ) : (
                            <><FileText className="w-4 h-4" /> Generate Report</>
                        )}
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card p-4 border-red-400/20 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!report && !loading && !error && (
                <div className="glass-card p-12 text-center">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-white/10" />
                    <h3 className="text-lg font-semibold text-white/30 mb-1">No report generated yet</h3>
                    <p className="text-[13px] text-white/20">Click "Generate Report" to create an AI safety analysis from current mine data.</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="glass-card p-12 text-center">
                    <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-white/40">Analyzing mine data with Gemini AI...</p>
                    <p className="text-[11px] text-white/20 mt-1">This may take 5-10 seconds</p>
                </div>
            )}

            {/* Report */}
            {report && !loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                            <div className="stat-card">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="w-4 h-4 text-cyan-400" />
                                    <span className="text-[12px] text-white/35">Total Workers</span>
                                </div>
                                <div className="text-xl font-bold text-cyan-400">{stats.totalWorkers}</div>
                            </div>
                            <div className="stat-card">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                    <span className="text-[12px] text-white/35">At Risk</span>
                                </div>
                                <div className="text-xl font-bold text-red-400">{stats.atRisk}</div>
                            </div>
                            <div className="stat-card">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[12px] text-white/35">Safe</span>
                                </div>
                                <div className="text-xl font-bold text-emerald-400">{stats.safe}</div>
                            </div>
                            <div className="stat-card">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                    <span className="text-[12px] text-white/35">Incidents</span>
                                </div>
                                <div className="text-xl font-bold text-amber-400">{stats.recentIncidents}</div>
                            </div>
                        </div>
                    )}

                    {/* Report content */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-semibold text-white/60">Generated Report</h3>
                            {generatedAt && (
                                <span className="text-[11px] text-white/25">
                                    {new Date(generatedAt).toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div className="prose prose-invert prose-sm max-w-none
                            prose-headings:text-white/80 prose-headings:font-semibold prose-headings:text-[15px] prose-headings:mb-2 prose-headings:mt-5
                            prose-p:text-white/50 prose-p:text-[13px] prose-p:leading-relaxed
                            prose-li:text-white/50 prose-li:text-[13px]
                            prose-strong:text-white/70
                            prose-ul:my-2 prose-ol:my-2
                        ">
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
