import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Shield, Radio, MapPin, Bell, Brain, Activity, ChevronRight,
    Wifi, Satellite, HardHat, AlertTriangle, BarChart3, Layers
} from "lucide-react";

const features = [
    { icon: MapPin, title: "Real-Time Tracking", desc: "GPS + RFID powered live location tracking for every miner underground with sub-meter accuracy.", color: "#00d4ff" },
    { icon: AlertTriangle, title: "Hazard Zone Detection", desc: "Haversine distance monitoring with 20m threshold alerts when workers approach unstable zones.", color: "#ff3333" },
    { icon: Bell, title: "Instant SMS Alerts", desc: "Twilio-powered emergency notifications sent to supervisors when workers enter risk zones.", color: "#ffaa00" },
    { icon: Brain, title: "ML Heatmaps", desc: "AI-powered geological deformation analysis with interactive heatmaps from satellite data.", color: "#a855f7" },
    { icon: BarChart3, title: "Predictive Analytics", desc: "Machine learning models predict land displacement with actual vs predicted visualization.", color: "#00ff88" },
    { icon: Activity, title: "System Observability", desc: "Prometheus metrics + Winston-Loki logging for complete production monitoring.", color: "#ec4899" },
];

const techStack = [
    { icon: Satellite, label: "InSAR Satellite", status: "Connected" },
    { icon: Radio, label: "LoRa Network", status: "Active" },
    { icon: Wifi, label: "RFID Grid", status: "Online" },
    { icon: Shield, label: "AI Engine", status: "Running" },
];

export default function Landing() {
    return (
        <div className="min-h-screen bg-black">
            {/* ─── Navbar ─── */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
                            <HardHat className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">undergrid<span className="text-cyan-400">.ai</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#tech" className="hover:text-white transition-colors">Technology</a>
                        <a href="#how" className="hover:text-white transition-colors">How It Works</a>
                    </div>
                    <Link to="/dashboard" className="btn-primary text-sm flex items-center gap-2">
                        Open Dashboard <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            {/* ─── Hero ─── */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.08),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Mining Safety Intelligence Platform
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6">
                            Underground
                            <br />
                            <span className="gradient-text">Command Center</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
                            AI-powered real-time monitoring that keeps every miner safe. Track personnel,
                            detect hazards, and receive instant alerts — all from one unified dashboard.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/dashboard" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                                Launch Dashboard <ChevronRight className="w-5 h-5" />
                            </Link>
                            <a href="#features" className="btn-ghost text-base px-8 py-3">Explore Features</a>
                        </div>
                    </motion.div>

                    {/* Tech Status Strip */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {techStack.map((t) => (
                            <div key={t.label} className="glass-card p-4 text-center">
                                <t.icon className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                                <div className="text-sm font-medium">{t.label}</div>
                                <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    {t.status}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Features ─── */}
            <section id="features" className="py-24 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,136,0.04),transparent_60%)]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful <span className="gradient-text">Features</span></h2>
                        <p className="text-white/40 max-w-xl mx-auto">Everything you need to monitor underground mining operations in real-time.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="glass-card p-6 group cursor-default">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                                    <f.icon className="w-6 h-6" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section id="how" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It <span className="gradient-text">Works</span></h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            { step: "01", title: "Deploy Smart Helmets", desc: "Each helmet has RFID + GPS sensors that feed real-time location into the system." },
                            { step: "02", title: "AI Monitors Everything", desc: "Our ML models analyze geological data and worker positions to detect potential hazards." },
                            { step: "03", title: "Instant Alerts", desc: "When a worker enters a risk zone, supervisors receive SMS and dashboard alerts immediately." },
                            { step: "04", title: "Predictive Safety", desc: "Satellite InSAR data is analyzed to predict land deformation before it becomes dangerous." },
                        ].map((item, i) => (
                            <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="flex gap-6 items-start">
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                                    <p className="text-white/40">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section id="tech" className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="glass-card-accent p-12 md:p-16">
                        <Layers className="w-12 h-12 mx-auto mb-6 text-cyan-400" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to go underground?</h2>
                        <p className="text-white/40 mb-8 max-w-lg mx-auto">Access the real-time command center and monitor your mining operations with AI-powered intelligence.</p>
                        <Link to="/dashboard" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                            Open Command Center <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-white/30">
                    <div className="flex items-center gap-2">
                        <HardHat className="w-4 h-4" />
                        <span>undergrid.ai v2.0</span>
                    </div>
                    <span>Underground Intelligence Platform</span>
                </div>
            </footer>
        </div>
    );
}
