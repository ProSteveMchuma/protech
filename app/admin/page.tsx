"use client";

import { useState } from "react";
import { Lock, Users, Briefcase } from "lucide-react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-slate-900 rounded-full">
                            <Lock className="size-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (password === "admin123") setIsAuthenticated(true);
                        }}
                    >
                        <input
                            type="password"
                            className="w-full px-4 py-3 border rounded-lg mb-4"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">
                            Unlock Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-slate-900 text-white h-16 flex items-center px-6 justify-between">
                <div className="font-bold text-xl">RemotePro Admin</div>
                <button onClick={() => setIsAuthenticated(false)} className="text-sm opacity-70 hover:opacity-100">Logout</button>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Leads */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="size-6 text-blue-600" />
                            <h2 className="text-xl font-bold">Recent Leads</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Acme Corp", service: "Growth VA", status: "New" },
                                { name: "John Smith", service: "Content Engine", status: "Contacted" },
                                { name: "TechStart Ltd", service: "Social Media", status: "Pending" },
                            ].map((lead, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="font-bold">{lead.name}</div>
                                        <div className="text-sm text-slate-500">{lead.service}</div>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        {lead.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Applications */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="size-6 text-emerald-600" />
                            <h2 className="text-xl font-bold">Recent Applications</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: "Sarah K.", role: "Virtual Assistant", rate: "KES 500/hr" },
                                { name: "David M.", role: "Graphic Design", rate: "KES 800/hr" },
                                { name: "Faith W.", role: "Content Writer", rate: "KES 600/hr" },
                            ].map((app, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <div className="font-bold">{app.name}</div>
                                        <div className="text-sm text-slate-500">{app.role}</div>
                                    </div>
                                    <span className="font-mono text-sm font-semibold">{app.rate}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
