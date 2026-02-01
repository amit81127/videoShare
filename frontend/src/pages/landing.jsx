import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Videocam,
    Chat,
    ScreenShare,
    Security,
    Groups,
    History,
} from "@mui/icons-material";

export default function LandingPage() {
    const router = useNavigate();

    return (
        <div className="min-h-screen bg-[#0b0f1a] text-white overflow-hidden relative">
            {/* Background Gradient Blobs */}
            <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl animate-pulse" />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                            <span className="font-bold text-lg">A</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            MeetUP
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => router("/aljk23")}
                            className="hidden md:block text-gray-300 hover:text-white transition"
                        >
                            Join as Guest
                        </button>

                        <button
                            onClick={() => router("/auth")}
                            className="text-gray-300 hover:text-white transition"
                        >
                            Register
                        </button>

                        <button
                            onClick={() => router("/auth")}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold hover:scale-105 active:scale-95 transition shadow-lg shadow-primary/30"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                {/* Left */}
                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Connect
                        </span>{" "}
                        with your <br /> loved ones
                    </h2>

                    <p className="text-gray-400 text-lg max-w-xl">
                        Crystal-clear video calls, instant messaging, secure meetings and
                        seamless screen sharing — all in one place.
                    </p>

                    <div className="flex gap-4 pt-4">
                        <Link
                            to="/auth"
                            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 hover:-translate-y-1 transition shadow-lg"
                        >
                            Get Started
                        </Link>

                        <button
                            onClick={() => router("/aljk23")}
                            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
                        >
                            Join Instantly
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className="relative flex justify-center animate-slide-up">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-20 blur-3xl rounded-full" />
                    <img
                        src="/mobile.png"
                        alt="Video Call Preview"
                        className="relative z-10 w-full max-w-sm drop-shadow-2xl hover:scale-105 transition duration-500"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h3 className="text-center text-3xl font-bold mb-12">
                    Why choose{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Apna Video Call
                    </span>
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Videocam fontSize="large" />,
                            title: "HD Video Calls",
                            desc: "Lag-free high quality video & audio",
                        },
                        {
                            icon: <Chat fontSize="large" />,
                            title: "Live Chat",
                            desc: "Instant real-time messaging",
                        },
                        {
                            icon: <ScreenShare fontSize="large" />,
                            title: "Screen Sharing",
                            desc: "Share your screen in one click",
                        },
                        {
                            icon: <Security fontSize="large" />,
                            title: "Secure",
                            desc: "End-to-end encrypted meetings",
                        },
                        {
                            icon: <Groups fontSize="large" />,
                            title: "Group Calls",
                            desc: "Connect with multiple users",
                        },
                        {
                            icon: <History fontSize="large" />,
                            title: "Call History",
                            desc: "Track your past meetings",
                        },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition hover:-translate-y-2"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
                            <p className="text-gray-400 text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} MeetUp — All rights reserved
            </footer>
        </div>
    );
}
