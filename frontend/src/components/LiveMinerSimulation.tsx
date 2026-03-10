import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play, Pause, RotateCcw, AlertTriangle, Shield, Volume2, VolumeX,
    Users, Activity, Zap, Clock, Radio
} from "lucide-react";

/* ─── Types ─── */
interface SimMiner {
    id: string;
    name: string;
    workerId: string;
    role: string;
    lat: number;
    lng: number;
    baseLat: number;
    baseLng: number;
    color: string;
    inDanger: boolean;
    dangerZone: string | null;
}

interface DangerZone {
    id: string;
    name: string;
    riskLevel: "high" | "medium" | "critical";
    color: string;
    polygon: [number, number][]; // [lat, lng][]
}

interface AlertEntry {
    id: string;
    minerName: string;
    workerId: string;
    zoneName: string;
    riskLevel: string;
    time: string;
    lat: number;
    lng: number;
}

/* ─── Constants ─── */
const ROLE_COLORS: Record<string, string> = {
    miner: "#00d4ff", engineer: "#3b82f6", "safety officer": "#00ff88",
    electrician: "#eab308", welder: "#f97316", plumber: "#06b6d4",
    operator: "#a855f7", technician: "#ec4899",
};

const INITIAL_MINERS: Omit<SimMiner, "baseLat" | "baseLng" | "inDanger" | "dangerZone">[] = [
    { id: "m1", name: "Ravi Kumar", workerId: "W001", role: "Miner", lat: 22.3200, lng: 82.5580, color: ROLE_COLORS.miner },
    { id: "m2", name: "Nirupon Pal", workerId: "W002", role: "Miner", lat: 22.3220, lng: 82.5620, color: ROLE_COLORS.miner },
    { id: "m3", name: "John Doe", workerId: "W003", role: "Engineer", lat: 22.3180, lng: 82.5550, color: ROLE_COLORS.engineer },
    { id: "m4", name: "Priya Sharma", workerId: "W004", role: "Safety Officer", lat: 22.3240, lng: 82.5600, color: "#00ff88" },
    { id: "m5", name: "Amit Singh", workerId: "W005", role: "Electrician", lat: 22.3160, lng: 82.5640, color: ROLE_COLORS.electrician },
    { id: "m6", name: "Rajesh Patel", workerId: "W006", role: "Operator", lat: 22.3210, lng: 82.5560, color: ROLE_COLORS.operator },
    { id: "m7", name: "Sunita Devi", workerId: "W007", role: "Welder", lat: 22.3190, lng: 82.5610, color: ROLE_COLORS.welder },
    { id: "m8", name: "Vikram Singh", workerId: "W008", role: "Technician", lat: 22.3230, lng: 82.5570, color: ROLE_COLORS.technician },
    { id: "m9", name: "Anita Kumari", workerId: "W009", role: "Plumber", lat: 22.3170, lng: 82.5590, color: ROLE_COLORS.plumber },
];

const DANGER_ZONES: DangerZone[] = [
    {
        id: "zone-a", name: "Zone A — Gas Leak", riskLevel: "critical", color: "#ff3333",
        polygon: [[22.3195, 82.5595], [22.3195, 82.5625], [22.3215, 82.5625], [22.3215, 82.5595]],
    },
    {
        id: "zone-b", name: "Zone B — Unstable Roof", riskLevel: "high", color: "#ff6600",
        polygon: [[22.3165, 82.5555], [22.3165, 82.5580], [22.3185, 82.5580], [22.3185, 82.5555]],
    },
    {
        id: "zone-c", name: "Zone C — Flooding Risk", riskLevel: "medium", color: "#ffaa00",
        polygon: [[22.3225, 82.5560], [22.3225, 82.5590], [22.3245, 82.5590], [22.3245, 82.5560]],
    },
];

/* ─── Point-in-Polygon Ray Casting ─── */
function pointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [yi, xi] = polygon[i];
        const [yj, xj] = polygon[j];
        if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}

/* ─── Component ─── */
export default function LiveMinerSimulation() {
    const [miners, setMiners] = useState<SimMiner[]>(() =>
        INITIAL_MINERS.map(m => ({ ...m, baseLat: m.lat, baseLng: m.lng, inDanger: false, dangerZone: null }))
    );
    const [running, setRunning] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [alerts, setAlerts] = useState<AlertEntry[]>([]);
    const [elapsed, setElapsed] = useState(0);
    const [toasts, setToasts] = useState<AlertEntry[]>([]);

    const mapRef = useRef<HTMLDivElement>(null);
    const mapObjRef = useRef<any>(null);
    const markersRef = useRef<Map<string, any>>(new Map());
    const zonesRef = useRef<any[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const prevDangerRef = useRef<Record<string, boolean>>({});
    const [mapReady, setMapReady] = useState(false);

    /* ─── Voice ─── */
    const speak = useCallback((text: string) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1; u.pitch = 0.85; u.volume = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }, [voiceEnabled]);

    /* ─── Init Map ─── */
    useEffect(() => {
        if (!mapRef.current || mapObjRef.current) return;
        const L = (window as any).L;
        if (!L) return;

        const map = L.map(mapRef.current, {
            center: [22.3200, 82.5590],
            zoom: 15,
            zoomControl: true,
        });

        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

        // Mining area boundary
        L.polygon(
            [[22.3105, 82.5065], [22.3105, 82.628], [22.3421, 82.628], [22.3421, 82.5065]],
            { color: "#00d4ff", weight: 1.5, opacity: 0.3, fillColor: "#00d4ff", fillOpacity: 0.02, dashArray: "8,4" }
        ).addTo(map).bindPopup("<b style='color:#00d4ff'>Singrauli Mining Area</b>");

        // Danger zones
        DANGER_ZONES.forEach(zone => {
            const poly = L.polygon(zone.polygon, {
                color: zone.color,
                weight: 2,
                opacity: 0.7,
                fillColor: zone.color,
                fillOpacity: 0.15,
                dashArray: "4,4",
            }).addTo(map);
            poly.bindPopup(`<div style="min-width:160px;background:#1a1a1a;color:#fff;padding:4px"><b style="color:${zone.color}">${zone.name}</b><br/><span style="color:#888;font-size:11px">Risk: ${zone.riskLevel.toUpperCase()}</span></div>`);
            zonesRef.current.push(poly);

            // Zone label
            const center = zone.polygon.reduce(
                (acc, p) => [acc[0] + p[0] / zone.polygon.length, acc[1] + p[1] / zone.polygon.length],
                [0, 0]
            );
            L.marker(center, {
                icon: L.divIcon({
                    html: `<div style="color:${zone.color};font-size:10px;font-weight:700;text-shadow:0 0 6px #000;white-space:nowrap;text-align:center">${zone.name}</div>`,
                    className: "",
                    iconSize: [120, 20],
                    iconAnchor: [60, 10],
                }),
            }).addTo(map);
        });

        mapObjRef.current = map;
        setMapReady(true);

        return () => { map.remove(); mapObjRef.current = null; setMapReady(false); };
    }, []);

    /* ─── Update markers when miners change (only after map is ready) ─── */
    useEffect(() => {
        if (!mapReady) return;
        const L = (window as any).L;
        const map = mapObjRef.current;
        if (!L || !map) return;

        miners.forEach(m => {
            const existing = markersRef.current.get(m.id);
            const bg = m.inDanger ? "#ff3333" : m.color;
            const borderStyle = m.inDanger ? "3px solid #ff0000" : "2px solid #111";
            const glowStyle = m.inDanger
                ? "box-shadow:0 0 16px 4px rgba(255,51,51,0.7);"
                : `box-shadow:0 0 10px ${m.color}50;`;
            const pulseStyle = m.inDanger ? "animation:danger-marker-pulse 0.8s ease-in-out infinite;" : "";
            const statusColor = m.inDanger ? "#ff3333" : "#00ff88";
            const shortZone = m.dangerZone ? m.dangerZone.split(" ")[0] + " " + m.dangerZone.split(" ")[1] : "";
            const statusText = m.inDanger ? "IN " + shortZone : "Safe";

            const html = `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer">
  <div style="width:26px;height:26px;background:${bg};border-radius:50%;border:${borderStyle};${glowStyle}${pulseStyle}display:flex;align-items:center;justify-content:center;font-size:12px">&#9937;&#65039;</div>
  <div style="margin-top:2px;background:rgba(0,0,0,0.82);border:1px solid ${m.inDanger ? 'rgba(255,51,51,0.5)' : 'rgba(255,255,255,0.15)'};border-radius:5px;padding:2px 5px;text-align:center;min-width:80px">
    <div style="font-size:9px;font-weight:700;color:#fff">${m.name}</div>
    <div style="font-size:7px;font-weight:600;color:${statusColor}">${statusText}</div>
    <div style="font-size:7px;color:rgba(255,255,255,0.45);font-family:monospace">${m.lat.toFixed(4)}N ${m.lng.toFixed(4)}E</div>
  </div>
</div>`;

            const icon = L.divIcon({
                html: html,
                className: "miner-marker-icon",
                iconSize: [100, 65],
                iconAnchor: [50, 13],
            });

            const popup = `<div style="min-width:200px;background:#1a1a1a;color:#fff;padding:8px">
  <div style="font-size:14px;font-weight:700;margin-bottom:4px">${m.name}</div>
  <div style="color:#888;font-size:11px;margin-bottom:4px">ID: ${m.workerId} | ${m.role}</div>
  <div style="color:${m.inDanger ? '#ff3333' : '#00ff88'};font-size:12px;font-weight:600;margin-bottom:6px">${m.inDanger ? 'IN DANGER ZONE' : 'SAFE'}</div>
  <div style="color:#666;font-size:11px;font-family:monospace;padding:4px 6px;background:rgba(255,255,255,0.05);border-radius:4px">
    Lat: ${m.lat.toFixed(6)}N<br/>Lng: ${m.lng.toFixed(6)}E
  </div>
</div>`;

            if (existing) {
                existing.setLatLng([m.lat, m.lng]);
                existing.setIcon(icon);
                existing.setPopupContent(popup);
            } else {
                const marker = L.marker([m.lat, m.lng], { icon, zIndexOffset: 1000 })
                    .addTo(map)
                    .bindPopup(popup, { maxWidth: 280 });
                markersRef.current.set(m.id, marker);
            }
        });
    }, [miners, mapReady]);

    /* ─── Simulation tick ─── */
    const tick = useCallback(() => {
        setMiners(prev => {
            const newAlerts: AlertEntry[] = [];

            const updated = prev.map(m => {
                // Random walk with drift back toward base
                const driftLat = (m.baseLat - m.lat) * 0.02;
                const driftLng = (m.baseLng - m.lng) * 0.02;
                const jitterLat = (Math.random() - 0.5) * 0.0012;
                const jitterLng = (Math.random() - 0.5) * 0.0012;

                const newLat = m.lat + driftLat + jitterLat;
                const newLng = m.lng + driftLng + jitterLng;

                // Check danger zones
                let inDanger = false;
                let dangerZone: string | null = null;
                for (const zone of DANGER_ZONES) {
                    if (pointInPolygon(newLat, newLng, zone.polygon)) {
                        inDanger = true;
                        dangerZone = zone.name;
                        break;
                    }
                }

                // New entry into danger zone
                const wasDanger = prevDangerRef.current[m.id] || false;
                if (inDanger && !wasDanger) {
                    newAlerts.push({
                        id: `${m.id}-${Date.now()}`,
                        minerName: m.name,
                        workerId: m.workerId,
                        zoneName: dangerZone!,
                        riskLevel: DANGER_ZONES.find(z => z.name === dangerZone)?.riskLevel || "high",
                        time: new Date().toISOString(),
                        lat: newLat,
                        lng: newLng,
                    });
                }
                prevDangerRef.current[m.id] = inDanger;

                return { ...m, lat: newLat, lng: newLng, inDanger, dangerZone };
            });

            // Process alerts outside setState
            if (newAlerts.length > 0) {
                setTimeout(() => {
                    setAlerts(a => [...newAlerts, ...a].slice(0, 50));
                    setToasts(t => [...newAlerts, ...t].slice(0, 3));
                    newAlerts.forEach(alert => {
                        speak(`Warning! ${alert.minerName} has entered ${alert.zoneName}. Risk level: ${alert.riskLevel}.`);
                    });
                    // Auto-dismiss toasts
                    setTimeout(() => {
                        setToasts(t => t.filter(toast => !newAlerts.find(a => a.id === toast.id)));
                    }, 4000);
                }, 0);
            }

            return updated;
        });
    }, [speak]);

    /* ─── Start/Stop simulation ─── */
    useEffect(() => {
        if (running) {
            const ms = Math.max(300, 2000 / speed);
            intervalRef.current = setInterval(tick, ms);
            timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [running, speed, tick]);

    /* ─── Reset ─── */
    const reset = () => {
        setRunning(false);
        setMiners(INITIAL_MINERS.map(m => ({ ...m, baseLat: m.lat, baseLng: m.lng, inDanger: false, dangerZone: null })));
        setAlerts([]);
        setToasts([]);
        setElapsed(0);
        prevDangerRef.current = {};
    };

    const dangerCount = miners.filter(m => m.inDanger).length;
    const safeCount = miners.length - dangerCount;
    const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="glass-card-accent p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
                            <Radio className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                Live Miner Simulation
                                <span className={`text-sm px-3 py-1 rounded-full ${running ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-white/40"}`}>
                                    {running ? "● Running" : "○ Paused"}
                                </span>
                            </h2>
                            <p className="text-white/40 text-sm">Watch miners move in real-time — danger zone alerts auto-trigger</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setRunning(!running)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${running
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                                }`}>
                            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {running ? "Pause" : "Start"}
                        </button>
                        <button onClick={reset}
                            className="btn-ghost text-sm px-4 py-2 flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button onClick={() => setVoiceEnabled(!voiceEnabled)}
                            className={`btn-ghost text-sm px-3 py-2 flex items-center gap-1.5 ${voiceEnabled ? "text-cyan-400 border-cyan-400/20" : "text-white/30"}`}>
                            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-xs text-white/50">
                            <Zap className="w-3.5 h-3.5" />
                            <input type="range" min={0.5} max={3} step={0.5} value={speed}
                                onChange={e => setSpeed(parseFloat(e.target.value))}
                                className="w-16 accent-cyan-400" />
                            <span className="text-cyan-400 font-mono">{speed}x</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { icon: Users, label: "Total Miners", value: miners.length, color: "#00d4ff" },
                    { icon: Shield, label: "Safe", value: safeCount, color: "#00ff88" },
                    { icon: AlertTriangle, label: "In Danger", value: dangerCount, color: "#ff3333" },
                    { icon: Clock, label: "Elapsed", value: fmtTime(elapsed), color: "#ffaa00" },
                ].map(s => (
                    <div key={s.label} className={`stat-card ${s.label === "In Danger" && dangerCount > 0 ? "danger-pulse" : ""}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                                <div className="text-xs text-white/40 mt-1">{s.label}</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                                <s.icon className="w-5 h-5" style={{ color: s.color }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Map + Alert Log */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Map */}
                <div className="xl:col-span-2 glass-card overflow-hidden relative">
                    <div ref={mapRef} className="w-full h-[500px]" style={{ minHeight: 400 }} />

                    {/* Toast Alerts */}
                    <div className="absolute top-3 right-3 z-[1000] space-y-2 w-72">
                        <AnimatePresence>
                            {toasts.map(t => (
                                <motion.div key={t.id}
                                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 100, scale: 0.9 }}
                                    transition={{ type: "spring", damping: 20 }}
                                    className="p-3 rounded-xl border backdrop-blur-md"
                                    style={{
                                        background: "rgba(255,51,51,0.15)",
                                        borderColor: "rgba(255,51,51,0.4)",
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                        <span className="text-xs font-bold text-red-400 uppercase">Danger Alert</span>
                                    </div>
                                    <div className="text-sm text-white font-semibold">{t.minerName}</div>
                                    <div className="text-xs text-white/60">entered {t.zoneName}</div>
                                    <div className="text-[10px] text-white/30 font-mono mt-1">
                                        {t.lat.toFixed(5)}°N, {t.lng.toFixed(5)}°E
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Danger zone legend */}
                    <div className="absolute bottom-3 left-3 z-[1000] p-3 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
                        <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-2">Danger Zones</div>
                        {DANGER_ZONES.map(z => (
                            <div key={z.id} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                                <div className="w-3 h-3 rounded-sm" style={{ background: z.color, opacity: 0.7 }} />
                                <span className="text-white/60">{z.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                                    style={{ background: `${z.color}20`, color: z.color }}>{z.riskLevel}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alert Log */}
                <div className="glass-card p-5 flex flex-col" style={{ borderColor: alerts.length > 0 ? "rgba(255,51,51,0.2)" : undefined }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-red-400">
                            <Activity className="w-4 h-4" /> Alert Log
                            {alerts.length > 0 && (
                                <span className="bg-red-400/10 text-red-400 text-[11px] px-2 py-0.5 rounded-full">{alerts.length}</span>
                            )}
                        </h3>
                        {alerts.length > 0 && (
                            <button onClick={() => setAlerts([])} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                                Clear
                            </button>
                        )}
                    </div>

                    {alerts.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                            <Shield className="w-10 h-10 text-emerald-400/30 mb-3" />
                            <p className="text-sm text-emerald-400/60 font-medium">All Clear</p>
                            <p className="text-[11px] text-white/20 mt-1">{running ? "Monitoring for danger zone entries..." : "Start simulation to monitor miners"}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                            <AnimatePresence>
                                {alerts.map(a => (
                                    <motion.div key={a.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" /> {a.riskLevel.toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-white/25 font-mono">
                                                {new Date(a.time).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-white/70 font-medium">{a.minerName} ({a.workerId})</div>
                                        <div className="text-[11px] text-white/40">{a.zoneName}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Miner Grid */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Miner Status</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2">
                    {miners.map(m => (
                        <div key={m.id}
                            className={`p-3 rounded-xl text-center transition-all ${m.inDanger
                                ? "bg-red-400/10 border border-red-400/30 danger-pulse"
                                : "bg-white/[0.02] border border-white/5"
                                }`}>
                            <div className="text-lg mb-1">{m.inDanger ? "🚨" : "⛑️"}</div>
                            <div className="text-[11px] font-medium text-white/70 truncate">{m.name.split(" ")[0]}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: m.inDanger ? "#ff3333" : "#00ff88" }}>
                                {m.inDanger ? "DANGER" : "Safe"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
