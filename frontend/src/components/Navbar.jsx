import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconButton, Avatar } from '@mui/material';
import { Logout, Home, History } from '@mui/icons-material';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-dark-light/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                </div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    MeetUp
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/home')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/home') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    <Home fontSize="small" />
                    <span className="hidden sm:inline">Home</span>
                </button>

                <button
                    onClick={() => navigate('/history')}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/history') ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                >
                    <History fontSize="small" />
                    <span className="hidden sm:inline">History</span>
                </button>

                <div className="h-6 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1', fontSize: '0.9rem' }}>
                        {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                        onClick={handleLogout}
                        className="!text-gray-400 hover:!text-red-500 hover:!bg-red-500/10 transition-colors"
                        size="small"
                        title="Logout"
                    >
                        <Logout fontSize="small" />
                    </IconButton>
                </div>
            </div>
        </nav>
    );
}
