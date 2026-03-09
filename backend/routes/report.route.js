import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Worker from "../models/worker.model.js";
import Incident from "../models/incident.model.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// POST /report/generate — generate an AI safety report from current data
router.post("/generate", async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ success: false, message: "GEMINI_API_KEY not set" });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Gather data
        const workers = await Worker.find();
        const recentIncidents = await Incident.find().sort({ createdAt: -1 }).limit(20);

        const totalWorkers = workers.length;
        const riskWorkers = workers.filter(w => w.riskZone);
        const safeWorkers = workers.filter(w => !w.riskZone);
        const roles = [...new Set(workers.map(w => w.role))];

        const dataContext = `
CURRENT MINE STATUS:
- Total Workers: ${totalWorkers}
- Workers in Hazard Zones: ${riskWorkers.length}
- Safe Workers: ${safeWorkers.length}
- Active Roles: ${roles.join(", ")}

WORKERS IN HAZARD ZONES:
${riskWorkers.map(w => `  - ${w.name} (ID: ${w.workerId}, Role: ${w.role}, Location: ${w.currentLocation?.coordinates?.[1]?.toFixed(4)}°N, ${w.currentLocation?.coordinates?.[0]?.toFixed(4)}°E)`).join("\n") || "  None currently"}

RECENT INCIDENTS (last 20):
${recentIncidents.map(i => `  - ${i.workerName} (${i.workerId}) entered high-risk zone at ${new Date(i.createdAt).toLocaleString()}, Resolved: ${i.resolved}`).join("\n") || "  No recent incidents"}
`;

        const prompt = `You are a mining safety AI assistant for undergrid.ai, an underground mining safety platform. Generate a concise, professional safety report based on the following real-time data.

${dataContext}

Write a safety report with these sections:
1. **Executive Summary** (2-3 sentences)
2. **Current Risk Assessment** (bullet points)
3. **Worker Safety Status** (brief overview)
4. **Recommendations** (3-4 actionable items)
5. **Risk Level** (LOW / MODERATE / HIGH / CRITICAL)

Keep it concise and actionable. Use real names and data from above. Do not use markdown headers larger than h3.`;

        const result = await model.generateContent(prompt);
        const report = result.response.text();

        res.json({
            success: true,
            data: {
                report,
                generatedAt: new Date().toISOString(),
                stats: { totalWorkers, atRisk: riskWorkers.length, safe: safeWorkers.length, recentIncidents: recentIncidents.length },
            },
        });
    } catch (err) {
        console.error("Gemini report error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
