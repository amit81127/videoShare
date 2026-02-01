import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button, IconButton, Snackbar, Alert } from '@mui/material';
import { VideoCall, CalendarToday, Delete, ArrowForward } from '@mui/icons-material';

export default function History() {
    const { getHistoryOfUser, deleteHistory } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, [])

    const fetchHistory = async () => {
        try {
            const history = await getHistoryOfUser();
            setMeetings(history);
        } catch {
            showSnackbar("Failed to fetch history", "error");
        }
    }

    const handleDelete = async (meetingCode) => {
        try {
            await deleteHistory(meetingCode);
            setMeetings(meetings.filter(m => m.meetingCode !== meetingCode));
            showSnackbar("Meeting deleted successfully", "success");
        } catch (error) {
            showSnackbar("Failed to delete meeting", "error");
        }
    }

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    }

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div className="min-h-screen bg-dark">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Meeting History</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        View and manage your past video calls
                    </p>
                </div>

                {meetings.length !== 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meetings.map((e, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-primary/20 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300 shadow-inner">
                                            <VideoCall fontSize="large" />
                                        </div>
                                        <IconButton
                                            onClick={() => handleDelete(e.meetingCode)}
                                            className="!text-gray-500 hover:!text-red-500 hover:!bg-red-500/10 transition-colors"
                                            size="small"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2 tracking-wide font-mono">
                                        {e.meetingCode}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-dark/30 p-2 rounded-lg w-fit">
                                        <CalendarToday sx={{ fontSize: 14 }} />
                                        {formatDate(e.date)}
                                    </div>
                                </div>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => navigate(`/${e.meetingCode}`)}
                                    endIcon={<ArrowForward />}
                                    className="!border-white/10 !text-gray-300 hover:!text-white hover:!bg-gradient-to-r hover:!from-primary hover:!to-secondary hover:!border-transparent !rounded-xl !py-2 !normal-case !text-base !justify-between group-hover:!border-primary/50"
                                >
                                    Rejoin Meeting
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 glass-card max-w-2xl mx-auto animate-fade-in">
                        <div className="mb-6 relative inline-block">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                            <VideoCall sx={{ fontSize: 80, color: 'rgba(255,255,255,0.8)', position: 'relative' }} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No meetings found</h3>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">It looks like you haven't joined any meetings yet. Start a conversation today!</p>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/home')}
                            className="!bg-gradient-to-r !from-primary !to-secondary !rounded-xl !px-8 !py-3 !text-lg !font-semibold !shadow-lg !shadow-primary/30 hover:!shadow-primary/50 hover:!scale-105 transition-all"
                        >
                            Start New Meeting
                        </Button>
                    </div>
                )}
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: '12px' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    )
}