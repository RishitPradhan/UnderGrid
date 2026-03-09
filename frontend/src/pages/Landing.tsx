import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Shield, Radio, MapPin, Bell, Brain, Activity, ArrowRight,
    Wifi, Satellite, HardHat, AlertTriangle, BarChart3, Github, ArrowUpRight
} from "lucide-react";

const features = [
    { icon: MapPin, title: "Real-Time Tracking", desc: "GPS + RFID powered live location tracking for every miner underground with sub-meter accuracy.", color: "#00d4ff" },
    { icon: AlertTriangle, title: "Hazard Zone Detection", desc: "Haversine distance monitoring with 20m threshold alerts when workers approach unstable zones.", color: "#ef4444" },
    { icon: Bell, title: "Instant SMS Alerts", desc: "Twilio-powered emergency notifications sent to supervisors when workers enter risk zones.", color: "#f59e0b" },
    { icon: Brain, title: "ML Heatmaps", desc: "AI-powered geological deformation analysis with interactive heatmaps from satellite data.", color: "#a855f7" },
    { icon: BarChart3, title: "Predictive Analytics", desc: "Machine learning models predict land displacement with actual vs predicted visualization.", color: "#34d399" },
    { icon: Activity, title: "System Observability", desc: "Prometheus metrics + Winston-Loki logging for complete production monitoring.", color: "#ec4899" },
];

const steps = [
    { num: "01", title: "Deploy Smart Helmets", desc: "Each helmet has RFID + GPS sensors that feed real-time location into the system." },
    { num: "02", title: "AI Monitors Everything", desc: "Our ML models analyze geological data and worker positions continuously." },
    { num: "03", title: "Instant Alerts", desc: "When a worker enters a risk zone, supervisors receive SMS and dashboard alerts immediately." },
    { num: "04", title: "Predictive Safety", desc: "Satellite InSAR data is analyzed to predict land deformation before it becomes dangerous." },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* ─── Navbar ─── */}
            <nav className="fixed top-0 w-full z-50 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center">
                            <HardHat className="w-4 h-4 text-black" />
                        </div>
                        <span className="text-[15px] font-semibold tracking-tight">undergrid<span className="text-cyan-400">.ai</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-7 text-[13px] text-white/40">
                        <a href="#features" className="hover:text-white/80 transition-colors">Features</a>
                        <a href="#how" className="hover:text-white/80 transition-colors">How It Works</a>
                        <a href="https://github.com/RishitPradhan/UnderGrid" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors flex items-center gap-1">
                            <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                    </div>
                    <Link to="/dashboard" className="text-[13px] font-medium text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-1.5 rounded-lg transition-colors">
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* ─── Hero ─── */}
            <section className="relative pt-28 pb-20 overflow-hidden">
                {/* Dot grid background */}
                <div className="absolute inset-0 dot-grid" />
                {/* Subtle glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-400/[0.04] rounded-full blur-[120px]" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/50 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Mining Safety Intelligence
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
                            Underground
                            <br />
                            <span className="text-cyan-400">Command Center</span>
                        </h1>
                        <p className="text-base md:text-lg text-white/35 max-w-lg mb-8 leading-relaxed">
                            Real-time monitoring that keeps every miner safe. Track personnel,
                            detect hazards, and receive instant alerts — from one unified dashboard.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link to="/dashboard" className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2">
                                Launch Dashboard <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a href="#features" className="btn-ghost text-sm px-6 py-2.5">
                                Learn More
                            </a>
                        </div>
                    </motion.div>

                    {/* Tech Status Strip */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mt-16 flex flex-wrap gap-3 max-w-2xl"
                    >
                        {[
                            { icon: Satellite, label: "InSAR", status: "Connected" },
                            { icon: Radio, label: "LoRa", status: "Active" },
                            { icon: Wifi, label: "RFID", status: "Online" },
                            { icon: Shield, label: "AI", status: "Running" },
                        ].map((t) => (
                            <div key={t.label} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[12px]">
                                <t.icon className="w-3.5 h-3.5 text-white/30" />
                                <span className="text-white/50">{t.label}</span>
                                <span className="text-emerald-400/80 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                                    {t.status}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Features ─── */}
            <section id="features" className="py-20 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <p className="text-[12px] uppercase tracking-widest text-cyan-400/60 mb-2 font-medium">Capabilities</p>
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Everything you need to monitor
                            <br />
                            underground operations.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                className="group p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                                    style={{ background: `${f.color}0a`, border: `1px solid ${f.color}18` }}>
                                    <f.icon className="w-4 h-4" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-[15px] font-semibold mb-1.5">{f.title}</h3>
                                <p className="text-[13px] text-white/30 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section id="how" className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="mb-12">
                        <p className="text-[12px] uppercase tracking-widest text-cyan-400/60 mb-2 font-medium">Process</p>
                        <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
                    </div>
                    <div className="max-w-xl relative">
                        <div className="timeline-line" />
                        <div className="space-y-10">
                            {steps.map((item, i) => (
                                <motion.div
                                    key={item.num}
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="flex gap-5 items-start relative"
                                >
                                    <div className="flex-shrink-0 w-[54px] h-[54px] rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-cyan-400/70 font-mono text-sm font-bold z-10">
                                        {item.num}
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="text-[15px] font-semibold mb-1">{item.title}</h3>
                                        <p className="text-[13px] text-white/30 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400/[0.06] to-transparent border border-white/[0.05] p-10 md:p-14">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-400/[0.03] rounded-full blur-[100px]" />
                        <div className="relative z-10 max-w-lg">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to go underground?</h2>
                            <p className="text-white/35 mb-6 text-[15px]">
                                Access the real-time command center and monitor your mining operations with AI-powered intelligence.
                            </p>
                            <Link to="/dashboard" className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
                                Open Command Center <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-white/[0.04] py-10">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-md bg-cyan-400 flex items-center justify-center">
                                    <HardHat className="w-3.5 h-3.5 text-black" />
                                </div>
                                <span className="text-[14px] font-semibold">undergrid<span className="text-cyan-400">.ai</span></span>
                            </div>
                            <p className="text-[12px] text-white/25">Underground Intelligence Platform</p>
                        </div>
                        <div className="flex items-center gap-6 text-[12px] text-white/25">
                            <a href="https://github.com/RishitPradhan/UnderGrid" target="_blank" rel="noopener noreferrer"
                                className="hover:text-white/50 transition-colors flex items-center gap-1">
                                <Github className="w-3.5 h-3.5" /> GitHub
                            </a>
                            <span>Built for Hackathon 2026</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
