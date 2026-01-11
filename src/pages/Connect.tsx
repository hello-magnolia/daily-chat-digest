import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, MessageSquare, Users, Briefcase, Heart, Dumbbell, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const sampleChatPreviews = [
  { id: '1', name: 'Event Planning 🎉', icon: MessageSquare, messages: 10, preview: "Party planning for Saturday!" },
  { id: '2', name: 'Family Group 👨‍👩‍👧‍👦', icon: Heart, messages: 8, preview: "Sunday dinner at 5 PM" },
  { id: '3', name: 'Work Team', icon: Briefcase, messages: 9, preview: "Presentation moved to Wednesday" },
  { id: '4', name: 'Gym Buddies 💪', icon: Dumbbell, messages: 6, preview: "Morning workout session" },
  { id: '5', name: 'Sarah Miller', icon: Users, messages: 4, preview: "Coffee tomorrow at 3 PM" },
  { id: '6', name: 'John (Work)', icon: Briefcase, messages: 5, preview: "Q4 report discussion" },
];

const Connect = () => {
  const navigate = useNavigate();
  const { loadSampleData } = useAppStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleUseSampleData = () => {
    setIsConnecting(true);
    setTimeout(() => {
      loadSampleData();
      setConnected(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1500);
  };

  const handleFileUpload = () => {
    // For demo, just use sample data
    handleUseSampleData();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">WhatsApp Digest</span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Connect Your WhatsApp
            </h1>
            <p className="text-muted-foreground text-lg">
              This is a demo—choose how you'd like to explore the app
            </p>
          </motion.div>

          {connected ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl p-8 shadow-card border border-border text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Connected!</h2>
              <p className="text-muted-foreground">Redirecting to your dashboard...</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Option 1: Sample Data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">Use Sample Data</h2>
                    <p className="text-sm text-muted-foreground">Explore with realistic demo chats</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {sampleChatPreviews.slice(0, 4).map((chat) => (
                    <div key={chat.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <chat.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{chat.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{chat.messages} msgs</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground text-center">+ 2 more chats</p>
                </div>

                <Button 
                  variant="hero" 
                  className="w-full" 
                  size="lg"
                  onClick={handleUseSampleData}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Load Sample Chats
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Option 2: Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Upload className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-lg">Upload Chat Export</h2>
                    <p className="text-sm text-muted-foreground">Import your WhatsApp exports</p>
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-8 mb-6 text-center hover:border-primary/50 transition-colors cursor-pointer" onClick={handleFileUpload}>
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop .txt files here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Export from WhatsApp: Chat → More → Export chat
                  </p>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={handleFileUpload}
                  disabled={isConnecting}
                >
                  <Upload className="w-5 h-5" />
                  Choose Files (Demo)
                </Button>
              </motion.div>
            </div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            Your data stays on your device. We never store your messages.
          </motion.p>
        </div>
      </main>
    </div>
  );
};

export default Connect;
