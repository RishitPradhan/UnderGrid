import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-black text-white"><h1 className="text-4xl font-bold">404 — Not Found</h1></div>} />
            </Routes>
        </BrowserRouter>
    );
}
