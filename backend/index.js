import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import locationUpdater from "./utils/locationUpdate.util.js";
import { startHighRiskZoneMonitor } from "./utils/highRiskZone.util.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected!");
        setInterval(async () => {
            await locationUpdater();
        }, 10000);
        startHighRiskZoneMonitor();
    })
    .catch((err) => {
        console.log("Failed to connect to MongoDB. Error:", err.message);
    });

app.get("/", (req, res) => {
    res.send("UnderGrid v2 Backend");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`UnderGrid v2 backend listening on port ${PORT}`);
});
