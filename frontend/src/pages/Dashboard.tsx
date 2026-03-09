import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, MapPin, Users, AlertTriangle, Radio, ChevronLeft,
    Satellite, Wifi, Brain, HardHat, Activity, Shield, Menu, X
} from "lucide-react";
import LiveMinersData from "@/components/LiveMinersData";
import HeatmapViewer from "@/components/HeatmapViewer";
import RiskAlertsPanel from "@/components/RiskAlertsPanel";
import GeoZoneChart from "@/components/GeoZoneChart";

type Section = "overview" | "zones" | "miners" | "alerts";

const navItems: { id: Section; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "zones", label: "Geo Zones", icon: MapPin },
    { id: "miners", label: "Miners", icon: Users },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
];

const systemStatuses = [
    { label: "InSAR Satellite", icon: Satellite, status: "Receiving", color: "#00ff88" },
    { label: "LoRa Network", icon: Radio, status: "12 Nodes", color: "#00d4ff" },
    { label: "AI Engine", icon: Brain, status: "Active", color: "#a855f7" },
    { label: "RFID Grid", icon: Wifi, status: "Online", color: "#ffaa00" },
];

export default function Dashboard() {
    const [active, setActive] = useState<Section>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-black flex">
            {/* ─── Sidebar ─── */}
            <aside className={`fixed lg:relative z-40 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 lg:w-20"} bg-surface border-r border-white/5 flex flex-col overflow-hidden`}>
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-white/5 gap-3 flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center flex-shrink-0">
                        <HardHat className="w-5 h-5 text-black" />
                    </div>
                    {sidebarOpen && <span className="text-lg font-bold whitespace-nowrap">Under<span className="text-cyan-400">Grid</span></span>}
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActive(item.id)}
                            className={`sidebar-item w-full ${active === item.id ? "active" : ""}`}>
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Back to Home */}
                <div className="p-3 border-t border-white/5">
                    <Link to="/" className="sidebar-item w-full">
                        <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="text-sm">Back to Home</span>}
                    </Link>
                </div>
            </aside>

            {/* ─── Main Content ─── */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center px-6 gap-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white transition-colors">
                        {sidebarOpen ? <X className="w-5 h-5 lg:hidden" /> : <Menu className="w-5 h-5" />}
                        <span className="hidden lg:block">{sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">{navItems.find(n => n.id === active)?.label}</h1>
                        <p className="text-xs text-white/30">Underground Command Center</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 font-medium">System Online</span>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 max-w-[1600px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {active === "overview" && <OverviewSection />}
                            {active === "zones" && <ZonesSection />}
                            {active === "miners" && <MinersSection />}
                            {active === "alerts" && <AlertsSection />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

/* ─── Overview ─── */
function OverviewSection() {
    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="glass-card-accent p-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-black" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Welcome to UnderGrid.ai</h2>
                        <p className="text-white/40">Real-time underground mining safety monitoring</p>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">System Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemStatuses.map((sys) => (
                        <div key={sys.label} className="stat-card">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: `${sys.color}12`, border: `1px solid ${sys.color}30` }}>
                                    <sys.icon className="w-5 h-5" style={{ color: sys.color }} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{sys.label}</div>
                                    <div className="text-xs" style={{ color: sys.color }}>{sys.status}</div>
                                </div>
                            </div>
                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full rounded-full animate-pulse" style={{ width: "85%", background: sys.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat-card">
                    <div className="text-white/40 text-sm mb-1">Active Miners</div>
                    <div className="text-3xl font-bold text-cyan-400">9</div>
                    <div className="text-xs text-white/30 mt-1">Currently tracked underground</div>
                </div>
                <div className="stat-card">
                    <div className="text-white/40 text-sm mb-1">Hazard Zones</div>
                    <div className="text-3xl font-bold text-red-400">3</div>
                    <div className="text-xs text-white/30 mt-1">Active risk areas</div>
                </div>
                <div className="stat-card">
                    <div className="text-white/40 text-sm mb-1">Uptime</div>
                    <div className="text-3xl font-bold text-green-400">99.8%</div>
                    <div className="text-xs text-white/30 mt-1">Last 30 days</div>
                </div>
            </div>

            {/* Preview Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" /> Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {[
                            { msg: "Worker W003 entered Zone B", time: "2m ago", type: "warning" },
                            { msg: "All systems operational", time: "5m ago", type: "success" },
                            { msg: "Location sync completed", time: "10m ago", type: "info" },
                            { msg: "Heatmap data refreshed", time: "30m ago", type: "info" },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${a.type === "warning" ? "bg-amber-400" : a.type === "success" ? "bg-green-400" : "bg-cyan-400"}`} />
                                    <span className="text-sm text-white/70">{a.msg}</span>
                                </div>
                                <span className="text-xs text-white/30">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <GeoZoneChart />
            </div>
        </div>
    );
}

/* ─── Zones ─── */
function ZonesSection() {
    return (
        <div className="space-y-6">
            <HeatmapViewer />
            <GeoZoneChart />
        </div>
    );
}

/* ─── Miners ─── */
function MinersSection() {
    return <LiveMinersData />;
}

/* ─── Alerts ─── */
function AlertsSection() {
    return <RiskAlertsPanel />;
}
