import * as React from "react";
import {
    Snackbar,
    Alert,
    IconButton,
    CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, Person, PersonAdd, Login } from "@mui/icons-material";
import { AuthContext } from "../contexts/AuthContext";

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0); // 0 = login, 1 = register
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleAuth = async () => {
        if (!username || !password || (formState === 1 && !name)) {
            setError("Please fill all required fields");
            return;
        }

        setError("");
        setLoading(true);

        try {
            let result;
            if (formState === 0) {
                result = await handleLogin(username, password);
            } else {
                result = await handleRegister(name, username, password);
                setFormState(0);
                setName("");
            }

            setMessage(result || "Success!");
            setOpen(true);
            setUsername("");
            setPassword("");
        } catch (err) {
            console.error(err);
            let errMsg = err?.response?.data?.message || err?.message || "Authentication failed";
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleAuth();
    };

    return (
        <div className="min-h-screen bg-dark flex">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex flex-1 bg-cover bg-center relative" style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1616588589676-60b30c3c7448?auto=format&fit=crop&w=1600&q=80')`
            }}>
                <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent/20"></div>
                <div className="absolute bottom-20 left-20 text-white z-10">
                    <h1 className="text-5xl font-bold mb-4">Connect Cleanly.</h1>
                    <p className="text-xl text-gray-300 max-w-md">The most secure and seamless video conferencing experience for professionals.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-dark-light/50 backdrop-blur-sm z-0 lg:hidden"></div>

                <div className="w-full max-w-md z-10 animate-slide-up">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20 mb-4">
                            <LockOutlined className="text-white text-3xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {formState === 0 ? "Welcome Back" : "Create Account"}
                        </h2>
                        <p className="text-gray-400">
                            {formState === 0 ? "Enter your credentials to access your account" : "Sign up to get started with Apna Video Call"}
                        </p>
                    </div>

                    <div className="bg-dark-light/30 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
                        <div className="flex bg-dark/50 p-1 rounded-xl mb-8">
                            <button
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${formState === 0 ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setFormState(0)}
                            >
                                <Login className="mr-2 text-sm" /> Sign In
                            </button>
                            <button
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${formState === 1 ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                onClick={() => setFormState(1)}
                            >
                                <PersonAdd className="mr-2 text-sm" /> Sign Up
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formState === 1 && (
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field"
                                    placeholder="johndoe123"
                                    onKeyDown={handleKeyPress}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field pr-12"
                                        placeholder="••••••••"
                                        onKeyDown={handleKeyPress}
                                    />
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            className="btn-primary w-full mt-8 py-3 flex items-center justify-center font-bold"
                            onClick={handleAuth}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : (formState === 0 ? "Sign In" : "Create Account")}
                        </button>
                    </div>
                </div>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setOpen(false)}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}
