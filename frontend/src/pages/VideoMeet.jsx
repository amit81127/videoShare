import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, CircularProgress, Snackbar, Alert, Tooltip } from '@mui/material';
import { Videocam, VideocamOff, CallEnd, Mic, MicOff, ScreenShare, StopScreenShare, Chat, Close, Send, ContentCopy } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import server from "../environment";

const SERVER_URL = server;

const peerConfig = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export default function VideoMeetComponent() {
    const { url } = useParams();
    const navigate = useNavigate();

    // Refs
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const localPreviewRef = useRef(null);
    const localStreamRef = useRef(null);
    const connectionsRef = useRef({});
    const chatEndRef = useRef(null);
    const localDragRef = useRef(null);
    const chatDragRef = useRef(null);

    // State
    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [username, setUsername] = useState("");
    const [askForUsername, setAskForUsername] = useState(true);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

    useEffect(() => {
        getPermissions();
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            Object.values(connectionsRef.current).forEach(peer => peer.close());
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const showSnackbar = (msg, type = "info") => {
        setSnackbar({ open: true, message: msg, severity: type });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            setVideoAvailable(true);
            setAudioAvailable(true);
            setScreenAvailable(!!navigator.mediaDevices.getDisplayMedia);

            localStreamRef.current = stream;

            // Set initial state based on permissions
            setVideo(true);
            setAudio(true);

            // Set preview
            if (localPreviewRef.current) {
                localPreviewRef.current.srcObject = stream;
            }
        } catch (err) {
            setVideoAvailable(false);
            setAudioAvailable(false);
            showSnackbar("Could not access camera/microphone. Please check permissions.", "error");
        }
    };

    const joinMeeting = () => {
        if (!username.trim()) {
            showSnackbar("Please enter a username", "warning");
            return;
        }
        setLoading(true);
        connectToSocketServer();
    };

    const connectToSocketServer = () => {
        if (socketRef.current) return;

        socketRef.current = io.connect(SERVER_URL, {
            transports: ["websocket"]
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', { roomId: url, username });
            setLoading(false);
            setAskForUsername(false);
            showSnackbar("Joined the meeting", "success");
        });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('chat-message', (data, sender, socketIdSender) => {
            setMessages(prev => [...prev, { sender, data }]);
            if (socketIdSender !== socketRef.current.id) {
                setNewMessages(prev => prev + 1);
                if (!showModal) {
                    showSnackbar(`New message from ${sender} `, "info");
                }
            }
        });

        socketRef.current.on('user-joined', (id, clients) => {
            showSnackbar("A new user joined the meeting", "info");
            clients.forEach((socketListId) => {
                if (socketListId === socketRef.current.id || connectionsRef.current[socketListId]) return;
                const peer = new RTCPeerConnection(peerConfig);
                connectionsRef.current[socketListId] = peer;

                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => peer.addTrack(track, localStreamRef.current));
                }

                peer.onicecandidate = (event) => {
                    if (event.candidate) {
                        socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                    }
                };

                peer.ontrack = (event) => {
                    const stream = event.streams[0];
                    if (!stream) return;
                    addRemoteVideo(socketListId, stream);
                };

                peer.createOffer().then(description => {
                    peer.setLocalDescription(description).then(() => {
                        socketRef.current.emit('signal', socketListId, JSON.stringify({ sdp: peer.localDescription }));
                    });
                }).catch(e => console.error("Error creating offer", e));
            });
        });

        socketRef.current.on('user-left', (id) => {
            showSnackbar("User left the meeting", "info");
            if (connectionsRef.current[id]) {
                connectionsRef.current[id].close();
                delete connectionsRef.current[id];
            }
            setVideos(prev => prev.filter(v => v.socketId !== id));
        });
    };

    const gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message);

        if (!connectionsRef.current[fromId]) {
            const peer = new RTCPeerConnection(peerConfig);
            connectionsRef.current[fromId] = peer;

            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => peer.addTrack(track, localStreamRef.current));
            }

            peer.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit('signal', fromId, JSON.stringify({ 'ice': event.candidate }));
                }
            };

            peer.ontrack = (event) => {
                const stream = event.streams[0];
                if (!stream) return;
                addRemoteVideo(fromId, stream);
            };
        }

        const peer = connectionsRef.current[fromId];

        if (signal.sdp) {
            peer.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                if (signal.sdp.type === 'offer') {
                    peer.createAnswer().then(description => {
                        peer.setLocalDescription(description).then(() => {
                            socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: peer.localDescription }));
                        });
                    });
                }
            }).catch(e => console.error("Error setting remote description", e));
        }

        if (signal.ice) {
            // Only add candidate if remote description is set
            if (peer.remoteDescription) {
                peer.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.error("Error adding ice candidate", e));
            }
        }
    };

    const addRemoteVideo = (socketId, stream) => {
        setVideos(prev => {
            if (prev.find(v => v.socketId === socketId)) return prev;
            return [...prev, { socketId, stream }];
        });
    };

    const handleVideo = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !video);
            setVideo(!video);
        }
    };

    const handleAudio = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !audio);
            setAudio(!audio);
        }
    };

    const handleScreen = async () => {
        if (!screen) {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
                const screenTrack = stream.getVideoTracks()[0];

                Object.values(connectionsRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(screenTrack);
                    }
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // IMPORTANT: Update ref so new joiners get the screen
                localStreamRef.current = stream;

                screenTrack.onended = () => {
                    if (screen) handleScreen();
                };

                setScreen(true);
                setVideo(true); // Ensure video is "on" so overlay doesn't block screen share
            } catch (e) {
                showSnackbar("Failed to share screen", "error");
            }
        } else {
            try {
                // STOP old tracks first to release camera/screen
                if (localStreamRef.current) {
                    localStreamRef.current.getTracks().forEach(track => track.stop());
                }

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                const videoTrack = stream.getVideoTracks()[0];

                Object.values(connectionsRef.current).forEach(peer => {
                    const sender = peer.getSenders().find(s => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(videoTrack);
                    }
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                localStreamRef.current = stream;
                setVideo(true);
                setScreen(false);
            } catch (e) {
                showSnackbar("Failed to revert to camera", "error");
            }
        }
    };

    const handleEndCall = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        navigate('/home', { replace: true });
    };

    const sendMessage = () => {
        if (message.trim()) {
            socketRef.current.emit('chat-message', message, username);
            setMessage("");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        showSnackbar("Meeting Link Copied!", "success");
    };

    return (
        <div className="h-screen w-screen bg-[#0b0f1a] overflow-hidden relative font-sans text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            </div>

            {askForUsername ? (
                // LOBBY
                <div className="relative z-10 flex items-center justify-center h-full px-4">
                    <div className="glass-card p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8 animate-scale-in">

                        {/* Preview Section */}
                        <div className="flex-1 space-y-4">
                            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <video
                                    className="w-full h-full object-cover mirror"
                                    ref={(node) => {
                                        // Ensure ref is set for lobby preview too
                                        localPreviewRef.current = node;
                                        if (localStreamRef.current && node) node.srcObject = localStreamRef.current;
                                    }}
                                    autoPlay
                                    muted
                                    playsInline
                                ></video>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                    <IconButton onClick={handleVideo} className={`!p-3 !backdrop-blur-md !border !border-white/10 transition-all ${!video ? "!bg-red-500 !text-white" : "!bg-white/20 !text-white"}`}>
                                        {video ? <Videocam /> : <VideocamOff />}
                                    </IconButton>
                                    <IconButton onClick={handleAudio} className={`!p-3 !backdrop-blur-md !border !border-white/10 transition-all ${!audio ? "!bg-red-500 !text-white" : "!bg-white/20 !text-white"}`}>
                                        {audio ? <Mic /> : <MicOff />}
                                    </IconButton>
                                </div>
                                {!video && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90 z-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <VideocamOff sx={{ fontSize: 48 }} className="text-gray-500" />
                                            <span className="text-gray-500 font-medium">Camera Off</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-gray-400 text-sm">Check your audio and video before joining</p>
                        </div>

                        {/* Join Controls */}
                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                    Ready to join?
                                </h1>
                                <p className="text-gray-400">Enter your name to join the meeting room.</p>
                            </div>

                            <div className="space-y-4">
                                <TextField
                                    label="Create Display Name"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        className: "!text-white !rounded-xl !bg-white/5",
                                        sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' } }
                                    }}
                                    InputLabelProps={{ className: "!text-gray-400" }}
                                />
                                <Button
                                    variant="contained"
                                    onClick={joinMeeting}
                                    disabled={loading || !username.trim()}
                                    size="large"
                                    fullWidth
                                    className="!bg-gradient-to-r !from-primary !to-secondary !text-white !font-bold !py-4 !rounded-xl !shadow-lg !shadow-primary/30 hover:!shadow-primary/50 transition-all"
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : "Join Meeting"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // MEETING ROOM
                <>
                    {/* Chat Draggable Popup */}
                    {showModal && (
                        <Draggable nodeRef={chatDragRef} handle=".chat-handle" bounds="parent">
                            <div ref={chatDragRef} className="fixed bottom-24 right-4 w-96 h-[500px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col animate-scale-in">
                                {/* Header (Drag Handle) */}
                                <div className="chat-handle p-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl cursor-move active:cursor-grabbing">
                                    <div className="flex items-center gap-2">
                                        <Chat className="text-primary" />
                                        <h3 className="font-bold text-white">In-Call Messages</h3>
                                    </div>
                                    <IconButton onClick={() => setShowModal(false)} size="small" className="!text-gray-400 hover:!text-white hover:!bg-white/10">
                                        <Close fontSize="small" />
                                    </IconButton>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Chat sx={{ fontSize: 24, opacity: 0.5 }} />
                                            </div>
                                            <p className="text-sm">No messages yet</p>
                                            <p className="text-xs text-gray-600">Start the conversation!</p>
                                        </div>
                                    )}
                                    {messages.map((item, index) => (
                                        <div key={index} className={`flex flex-col ${item.sender === username ? 'items-end' : 'items-start'} animate-fade-in`}>
                                            <span className="text-[10px] text-gray-400 mb-1 px-1 uppercase tracking-wider">{item.sender === username ? 'You' : item.sender}</span>
                                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-md break-words ${item.sender === username ? 'bg-gradient-to-r from-primary to-indigo-600 text-white rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'}`}>
                                                <p>{item.data}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-3 border-t border-white/10 bg-white/5 rounded-b-2xl">
                                    <div className="flex gap-2 items-center bg-black/20 p-1 rounded-xl border border-white/5 focus-within:border-primary/50 transition-colors">
                                        <TextField
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            variant="standard"
                                            fullWidth
                                            InputProps={{
                                                disableUnderline: true,
                                                className: "!text-white !px-3 !py-1 !text-sm",
                                            }}
                                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                        />
                                        <IconButton
                                            onClick={sendMessage}
                                            disabled={!message.trim()}
                                            className={`!m-1 !transition-all ${message.trim() ? "!bg-primary !text-white hover:!bg-primary/90" : "!bg-white/5 !text-gray-500"}`}
                                            size="small"
                                        >
                                            <Send fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </Draggable>
                    )}

                    {/* Main Video Grid */}
                    <div className="relative h-full w-full p-4 pb-28 md:pb-4 md:pl-4 md:pr-4 flex gap-4 justify-center">
                        <div className={`w-full max-w-[1600px] self-center grid gap-4 transition-all duration-500 ${videos.length === 0 ? 'place-items-center h-full' : videos.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                            {videos.length === 0 && (
                                <div className="text-center animate-fade-in">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ring-1 ring-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]">
                                        <ContentCopy className="text-primary" sx={{ fontSize: 40 }} />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-white">Waiting for others</h2>
                                    <p className="text-gray-400 mb-8 text-lg">Share the meeting link to invite people</p>
                                    <Button
                                        variant="outlined"
                                        startIcon={<ContentCopy />}
                                        onClick={copyToClipboard}
                                        className="!border-white/10 !text-white hover:!bg-white/10 !rounded-full !px-8 !py-3 !text-lg !font-medium !backdrop-blur-sm transition-all hover:!scale-105 hover:!border-primary/50"
                                    >
                                        Copy Meeting Link
                                    </Button>
                                </div>
                            )}
                            {videos.map((v) => (
                                <div key={v.socketId} className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-video w-full group animate-scale-in">
                                    <video
                                        ref={ref => {
                                            if (ref && v.stream && ref.srcObject !== v.stream) ref.srcObject = v.stream;
                                        }}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm text-white font-medium flex items-center gap-2 border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        Participant
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Local Video Draggable */}
                    <Draggable nodeRef={localDragRef} bounds="parent">
                        <div ref={localDragRef} className="fixed top-8 right-8 w-48 md:w-80 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 z-40 hover:scale-105 hover:ring-primary/50 transition-all cursor-move group">
                            <video
                                className={`w-full h-full object-cover ${screen ? "" : "mirror"}`}
                                ref={(node) => {
                                    // Use the same ref approach for persistence
                                    localVideoRef.current = node;
                                    if (node && localStreamRef.current) node.srcObject = localStreamRef.current;
                                }}
                                autoPlay
                                muted
                                playsInline
                            ></video>
                            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white font-medium pointer-events-none">
                                You
                            </div>
                            {!video && !screen && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/90">
                                    <VideocamOff className="text-gray-500" sx={{ fontSize: 40 }} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                        </div>
                    </Draggable>

                    {/* Controls Bar */}
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-4 bg-[#0f172a]/80 backdrop-blur-xl px-4 md:px-8 py-3 rounded-full border border-white/10 shadow-glow-lg z-50 hover:bg-[#0f172a]/95 transition-colors">
                        <Tooltip title={video ? "Turn Off Camera" : "Turn On Camera"}>
                            <IconButton onClick={handleVideo} className={`!p-3.5 !rounded-full transition-all ${!video ? "!bg-red-500/90 !text-white hover:!bg-red-600" : "!bg-white/10 !text-white hover:!bg-white/20 hover:!scale-110"}`}>
                                {video ? <Videocam /> : <VideocamOff />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={audio ? "Mute Microphone" : "Unmute Microphone"}>
                            <IconButton onClick={handleAudio} className={`!p-3.5 !rounded-full transition-all ${!audio ? "!bg-red-500/90 !text-white hover:!bg-red-600" : "!bg-white/10 !text-white hover:!bg-white/20 hover:!scale-110"}`}>
                                {audio ? <Mic /> : <MicOff />}
                            </IconButton>
                        </Tooltip>

                        {screenAvailable && (
                            <Tooltip title={screen ? "Stop Sharing" : "Share Screen"}>
                                <IconButton onClick={handleScreen} className={`!p-3.5 !rounded-full transition-all ${screen ? "!bg-green-500/90 !text-white hover:!bg-green-600" : "!bg-white/10 !text-white hover:!bg-white/20 hover:!scale-110"}`}>
                                    {screen ? <StopScreenShare /> : <ScreenShare />}
                                </IconButton>
                            </Tooltip>
                        )}

                        <div className="w-px h-8 bg-white/10 mx-2"></div>

                        <Tooltip title="End Call">
                            <IconButton onClick={handleEndCall} className="!p-3.5 !rounded-full !bg-red-500/90 !text-white hover:!bg-red-600 hover:!scale-110 shadow-lg shadow-red-500/20">
                                <CallEnd />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Chat">
                            <Badge badgeContent={newMessages} color="primary" sx={{ '& .MuiBadge-badge': { backgroundColor: '#6366f1' } }}>
                                <IconButton onClick={() => { setShowModal(!showModal); setNewMessages(0); }} className={`!p-3.5 !rounded-full transition-all ${showModal ? "!bg-primary !text-white" : "!bg-white/10 !text-white hover:!bg-white/20 hover:!scale-110"}`}>
                                    <Chat />
                                </IconButton>
                            </Badge>
                        </Tooltip>
                    </div>
                </>
            )}

            {/* Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}