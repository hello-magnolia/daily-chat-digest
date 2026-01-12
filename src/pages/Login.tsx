import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Mail, Lock, ArrowRight, QrCode, Smartphone, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import SyncLoadingScreen from "@/components/SyncLoadingScreen";
import { getQRCode, getConnectionStatus } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const { loadSampleData } = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSyncing, setShowSyncing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch QR code from backend
  const fetchQRCode = async () => {
    console.log("Fetching QR code...");
    setQrLoading(true);
    setQrError(null);
    try {
      const response = await getQRCode();
      console.log("QR response:", response);
      if (response.authenticated) {
        // Already authenticated, go to sync screen
        setShowQR(false);
        setShowSyncing(true);
      } else if (response.qr) {
        setQrCode(response.qr);
      } else {
        setQrError(response.message || "No QR code available. Please try again.");
      }
    } catch (error) {
      console.error("QR fetch error:", error);
      setQrError(error instanceof Error ? error.message : "Failed to fetch QR code");
    } finally {
      setQrLoading(false);
    }
  };

  // Poll for connection status
  const pollConnectionStatus = async () => {
    try {
      const status = await getConnectionStatus();
      if (status.authenticated) {
        // User scanned and authenticated!
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setShowQR(false);
        setShowSyncing(true);
      }
    } catch (error) {
      console.error("Status poll error:", error);
    }
  };

  // Start polling when QR is shown
  useEffect(() => {
    if (showQR && qrCode) {
      pollIntervalRef.current = setInterval(pollConnectionStatus, 2000);
    }
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [showQR, qrCode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - just load sample data and navigate
    setTimeout(() => {
      loadSampleData();
      navigate('/dashboard');
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadSampleData();
      navigate('/dashboard');
    }, 1000);
  };

  const handleQRConnect = () => {
    setShowQR(true);
    setQrCode(null);
    fetchQRCode();
  };

  const handleSyncComplete = () => {
    loadSampleData();
    navigate('/dashboard');
  };

  return (
    <>
      <AnimatePresence>
        {showSyncing && (
          <SyncLoadingScreen onComplete={handleSyncComplete} duration={5000} />
        )}
      </AnimatePresence>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
            <MessageSquare className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground">WhatsApp Digest</span>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          {!showQR ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">Welcome back</h1>
                <p className="text-muted-foreground">Sign in to view your daily digest</p>
              </div>

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4 h-12 gap-3"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* QR Code Connect */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-6 h-12 gap-3"
                onClick={handleQRConnect}
                disabled={isLoading}
              >
                <QrCode className="w-5 h-5" />
                Scan QR to connect WhatsApp
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button type="button" className="text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit"
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button className="text-primary hover:underline font-medium">
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">Scan QR Code</h2>
                <p className="text-muted-foreground text-sm">
                  Open WhatsApp on your phone and scan this code
                </p>
              </div>

              {/* QR Code from Backend */}
              <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
                <div className="w-48 h-48 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {qrLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs text-muted-foreground">Loading QR...</span>
                    </div>
                  ) : qrError ? (
                    <div className="flex flex-col items-center gap-3 p-4">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                      <span className="text-xs text-destructive text-center">{qrError}</span>
                      <Button size="sm" variant="outline" onClick={fetchQRCode} className="gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </Button>
                    </div>
                  ) : qrCode ? (
                    <img 
                      src={`data:image/png;base64,${qrCode}`} 
                      alt="WhatsApp QR Code" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <QrCode className="w-12 h-12 text-muted-foreground/50" />
                      <span className="text-xs text-muted-foreground">No QR available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                <Smartphone className="w-4 h-4" />
                <span>Waiting for connection...</span>
                <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchQRCode}
                  disabled={qrLoading}
                  className="gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${qrLoading ? 'animate-spin' : ''}`} />
                  Refresh QR
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQR(false)}
                  className="text-muted-foreground"
                >
                  Back to login
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This is a demo—any credentials will work
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default Login;
