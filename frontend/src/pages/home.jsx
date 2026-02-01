import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { VideoCall, Keyboard, ContentCopy } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        if (meetingCode.trim()) {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        }
    }

    const generateRandomCode = () => {
        const code = Math.random().toString(36).substring(2, 7) + '-' + Math.random().toString(36).substring(2, 7);
        setMeetingCode(code);
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-center">

                    {/* Left Panel */}
                    <div className="space-y-8 animate-slide-up">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Quality Video Calls for <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                    Quality Connections
                                </span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-lg">
                                Connect with your friends, family, and colleagues instantly. Secure, high-quality, and reliable.
                            </p>
                        </div>

                        <div className="glass-card p-8 space-y-6 max-w-md">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<VideoCall />}
                                    onClick={() => {
                                        const code = Math.random().toString(36).substring(2, 7) + '-' + Math.random().toString(36).substring(2, 7);
                                        addToUserHistory(code);
                                        navigate(`/${code}`);
                                    }}
                                    className="!bg-gradient-to-r !from-primary !to-secondary !py-3 !text-lg !rounded-xl !capitalize"
                                >
                                    New Meeting
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-dark-light text-gray-500">or join with code</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <TextField
                                        value={meetingCode}
                                        onChange={e => setMeetingCode(e.target.value)}
                                        placeholder="Enter meeting code"
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Keyboard className="text-gray-400" />
                                                </InputAdornment>
                                            ),
                                            className: "!text-white !bg-dark/50 !rounded-xl",
                                            sx: {
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'rgba(255,255,255,0.1) !important'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#6366f1 !important'
                                                }
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={handleJoinVideoCall}
                                        disabled={!meetingCode}
                                        className="!rounded-xl !border-white/10 !text-primary hover:!bg-primary/10"
                                    >
                                        Join
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="hidden md:block animate-fade-in relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
                        <img
                            src="/logo3.png"
                            alt="Video Conference"
                            className="relative w-full max-w-md mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default withAuth(HomeComponent)