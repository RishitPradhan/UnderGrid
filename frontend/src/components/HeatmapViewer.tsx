import { useState, useEffect, useRef } from "react";
import {
    Globe, RefreshCw, Maximize2, Minimize2, ExternalLink,
    Satellite, Radio, Waves, AlertTriangle
} from "lucide-react";

const BASE_URL = "https://agentsay-geospacialdata.hf.space";

type Source = "satellite" | "drone" | "sensor";

export default function HeatmapViewer() {
    const [src, setSrc] = useState<Source>("satellite");
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [lastRefresh, setLastRefresh] = useState("");
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const fetchMap = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/heatmap`, { headers: { Accept: "text/html" } });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            setHtml(text);
            setLastRefresh(new Date().toLocaleTimeString());
        } catch (e: any) {
            setError(e.message || "Failed to load heatmap");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMap(); }, [src]);
    useEffect(() => { const id = setInterval(fetchMap, 60000); return () => clearInterval(id); }, []);

    const blobUrl = html ? URL.createObjectURL(new Blob([html], { type: "text/html" })) : null;

    const sources: { id: Source; label: string; icon: any }[] = [
        { id: "satellite", label: "Satellite", icon: Satellite },
        { id: "drone", label: "Drone", icon: Globe },
        { id: "sensor", label: "Sensor", icon: Waves },
    ];

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-400" /> Geological Heatmap</h3>
                    <p className="text-xs text-white/30 mt-1">ML-powered land deformation analysis</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Source Toggle */}
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                        {sources.map(s => (
                            <button key={s.id} onClick={() => setSrc(s.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${src === s.id ? "bg-cyan-400/10 text-cyan-400" : "text-white/40 hover:text-white"}`}>
                                <s.icon className="w-3.5 h-3.5" /> {s.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchMap} disabled={loading}
                        className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button onClick={() => setFullscreen(!fullscreen)}
                        className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                        {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        {fullscreen ? "Exit" : "Expand"}
                    </button>
                    {blobUrl && <a href={blobUrl} target="_blank" rel="noopener noreferrer"
                        className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Open
                    </a>}
                </div>
            </div>

            {/* Map */}
            <div className={`glass-card overflow-hidden transition-all ${fullscreen ? "fixed inset-4 z-50" : "relative"}`}>
                {loading && (
                    <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-white/40">Loading heatmap data...</p>
                    </div>
                )}
                {error && !html && (
                    <div className="flex flex-col items-center justify-center p-12 gap-4">
                        <AlertTriangle className="w-10 h-10 text-red-400" />
                        <p className="text-sm text-red-400">{error}</p>
                        <button onClick={fetchMap} className="btn-primary text-sm px-4 py-2">Retry</button>
                    </div>
                )}
                {blobUrl && (
                    <iframe ref={iframeRef} src={blobUrl} title="Geological Heatmap"
                        className={`w-full border-0 ${fullscreen ? "h-full" : "h-[500px]"}`}
                        style={{ minHeight: 400 }} sandbox="allow-scripts allow-same-origin" />
                )}
                {fullscreen && (
                    <button onClick={() => setFullscreen(false)}
                        className="absolute top-4 right-4 z-20 btn-ghost text-xs px-3 py-1.5">
                        <Minimize2 className="w-3.5 h-3.5 inline mr-1" /> Close
                    </button>
                )}
            </div>

            {/* Info */}
            {lastRefresh && (
                <div className="flex items-center gap-2 text-xs text-white/30">
                    <Radio className="w-3.5 h-3.5" />
                    Source: <span className="text-cyan-400">{src}</span> · Last refresh: {lastRefresh} · Auto-refresh: 60s
                </div>
            )}
        </div>
    );
}
