import { useState, useMemo } from "react";

import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, MapPin, Users, AlertTriangle, Radio, ChevronLeft,
    Satellite, Wifi, Brain, HardHat, Activity, Menu, X,
    FileText, Clock, Crosshair
} from "lucide-react";
import LiveMinersData from "@/components/LiveMinersData";
import HeatmapViewer from "@/components/HeatmapViewer";
import RiskAlertsPanel from "@/components/RiskAlertsPanel";
import GeoZoneChart from "@/components/GeoZoneChart";
import SafetyReport from "@/components/SafetyReport";
import IncidentTimeline from "@/components/IncidentTimeline";
import DronePatrol from "@/components/DronePatrol";
import LiveMinerSimulation from "@/components/LiveMinerSimulation";

type Section = "overview" | "zones" | "miners" | "alerts" | "report" | "incidents" | "drone" | "simulation";

const navItems: { id: Section; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "zones", label: "Geo Zones", icon: MapPin },
    { id: "miners", label: "Miners", icon: Users },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "report", label: "AI Report", icon: FileText },
    { id: "incidents", label: "Incidents", icon: Clock },
    { id: "drone", label: "Drone", icon: Crosshair },
    { id: "simulation", label: "Live Sim", icon: Radio },
];

export default function Dashboard() {
    const [active, setActive] = useState<Section>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#050505] flex">
            {/* ─── Sidebar ─── */}
            <aside className={`fixed lg:relative z-40 h-screen transition-all duration-300 ${sidebarOpen ? "w-56" : "w-0 lg:w-16"} bg-[#0a0a0a] border-r border-white/[0.04] flex flex-col overflow-hidden`}>
                <div className="h-14 flex items-center px-4 border-b border-white/[0.04] gap-2.5 flex-shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-cyan-400 flex items-center justify-center flex-shrink-0">
                        <HardHat className="w-4 h-4 text-black" />
                    </div>
                    {sidebarOpen && <span className="text-[14px] font-semibold whitespace-nowrap">undergrid<span className="text-cyan-400">.ai</span></span>}
                </div>

                <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <button key={item.id} onClick={() => setActive(item.id)}
                            className={`sidebar-item w-full ${active === item.id ? "active" : ""}`}>
                            <item.icon className="w-4 h-4 flex-shrink-0" />
                            {sidebarOpen && <span className="text-[13px] font-medium">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-2 border-t border-white/[0.04]">
                    <Link to="/" className="sidebar-item w-full">
                        <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                        {sidebarOpen && <span className="text-[13px]">Home</span>}
                    </Link>
                </div>
            </aside>

            {/* ─── Main ─── */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <header className="sticky top-0 z-30 h-14 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.04] flex items-center px-5 gap-3">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/30 hover:text-white/60 transition-colors">
                        {sidebarOpen ? <X className="w-4 h-4 lg:hidden" /> : <Menu className="w-4 h-4" />}
                        <span className="hidden lg:block">{sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</span>
                    </button>
                    <div className="flex-1">
                        <h1 className="text-[15px] font-semibold">{navItems.find(n => n.id === active)?.label}</h1>
                        <p className="text-[11px] text-white/25">Underground Command Center</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] text-[11px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-emerald-400/80 font-medium">Online</span>
                    </div>
                </header>

                <div className="p-5 max-w-[1400px] mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                            {active === "overview" && <OverviewSection />}
                            {active === "zones" && <ZonesSection />}
                            {active === "miners" && <MinersSection />}
                            {active === "alerts" && <AlertsSection />}
                            {active === "report" && <ReportSection />}
                            {active === "incidents" && <IncidentsSection />}
                            {active === "drone" && <DroneSection />}
                            {active === "simulation" && <SimulationSection />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

/* ─── Overview ─── */
function OverviewSection() {
    const greeting = useMemo(() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    }, []);

    const systemStatuses = [
        { label: "InSAR Satellite", icon: Satellite, status: "Receiving", color: "#34d399" },
        { label: "LoRa Network", icon: Radio, status: "12 Nodes", color: "#00d4ff" },
        { label: "AI Engine", icon: Brain, status: "Active", color: "#a855f7" },
        { label: "RFID Grid", icon: Wifi, status: "Online", color: "#f59e0b" },
    ];

    return (
        <div className="space-y-5">
            <div className="glass-card-accent p-6">
                <div>
                    <h2 className="text-xl font-bold">{greeting}, Supervisor</h2>
                    <p className="text-[13px] text-white/35 mt-1">Real-time underground mining safety monitoring</p>
                </div>
            </div>

            <div>
                <h3 className="text-[11px] font-medium text-white/30 uppercase tracking-wider mb-3">System Status</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {systemStatuses.map((sys) => (
                        <div key={sys.label} className="stat-card">
                            <div className="flex items-center gap-2.5 mb-2.5">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `${sys.color}08`, border: `1px solid ${sys.color}15` }}>
                                    <sys.icon className="w-4 h-4" style={{ color: sys.color }} />
                                </div>
                                <div>
                                    <div className="text-[13px] font-medium text-white/70">{sys.label}</div>
                                    <div className="text-[11px]" style={{ color: sys.color }}>{sys.status}</div>
                                </div>
                            </div>
                            <div className="h-[3px] rounded-full bg-white/[0.04] overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: "85%", background: sys.color, opacity: 0.6 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="stat-card">
                    <div className="text-white/35 text-[12px] mb-1">Active Miners</div>
                    <div className="text-2xl font-bold text-cyan-400">9</div>
                    <div className="text-[11px] text-white/20 mt-1">Currently tracked</div>
                </div>
                <div className="stat-card">
                    <div className="text-white/35 text-[12px] mb-1">Hazard Zones</div>
                    <div className="text-2xl font-bold text-red-400">3</div>
                    <div className="text-[11px] text-white/20 mt-1">Active risk areas</div>
                </div>
                <div className="stat-card">
                    <div className="text-white/35 text-[12px] mb-1">Uptime</div>
                    <div className="text-2xl font-bold text-emerald-400">99.8%</div>
                    <div className="text-[11px] text-white/20 mt-1">Last 30 days</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="glass-card p-5">
                    <h3 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400/70" /> Recent Activity
                    </h3>
                    <div className="space-y-2">
                        {[
                            { msg: "Worker W003 entered Zone B", time: "2m ago", type: "warning" },
                            { msg: "All systems operational", time: "5m ago", type: "success" },
                            { msg: "Location sync completed", time: "10m ago", type: "info" },
                            { msg: "Heatmap data refreshed", time: "30m ago", type: "info" },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                                <div className="flex items-center gap-2.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${a.type === "warning" ? "bg-amber-400" : a.type === "success" ? "bg-emerald-400" : "bg-cyan-400/60"}`} />
                                    <span className="text-[13px] text-white/55">{a.msg}</span>
                                </div>
                                <span className="text-[11px] text-white/20">{a.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <GeoZoneChart />
            </div>
        </div>
    );
}

function ZonesSection() {
    return (
        <div className="space-y-5">
            <HeatmapViewer />
            <GeoZoneChart />
        </div>
    );
}

function MinersSection() {
    return <LiveMinersData />;
}

function AlertsSection() {
    return <RiskAlertsPanel />;
}

function ReportSection() {
    return <SafetyReport />;
}

function IncidentsSection() {
    return <IncidentTimeline />;
}

function DroneSection() {
    return <DronePatrol />;
}

function SimulationSection() {
    return <LiveMinerSimulation />;
}
