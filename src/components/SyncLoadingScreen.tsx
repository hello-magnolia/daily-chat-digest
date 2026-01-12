import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, Brain, Zap, Coffee, PartyPopper } from "lucide-react";

const loadingMessages = [
  { icon: MessageSquare, text: "Connecting to WhatsApp...", emoji: "📱" },
  { icon: Zap, text: "Downloading your messages...", emoji: "⚡" },
  { icon: Brain, text: "Teaching AI to read between the lines...", emoji: "🧠" },
  { icon: Coffee, text: "Brewing the perfect summary...", emoji: "☕" },
  { icon: Sparkles, text: "Finding the gems in your chats...", emoji: "💎" },
  { icon: PartyPopper, text: "Almost there! Polishing your digest...", emoji: "✨" },
];

interface SyncLoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

const SyncLoadingScreen = ({ onComplete, duration = 5000 }: SyncLoadingScreenProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = duration / loadingMessages.length;
    
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, messageInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (duration / 50);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  const CurrentIcon = loadingMessages[currentMessageIndex].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-8 shadow-lg"
        >
          <MessageSquare className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        {/* Animated icon */}
        <div className="h-20 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-4xl mb-2"
              >
                {loadingMessages[currentMessageIndex].emoji}
              </motion.div>
              <CurrentIcon className="w-8 h-8 text-primary" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Message text */}
        <div className="h-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-foreground"
            >
              {loadingMessages[currentMessageIndex].text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-hero rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 p-4 bg-muted/50 rounded-xl"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Did you know?</span> The average person sends over 65 messages per day. We're here to help you catch up! 🚀
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SyncLoadingScreen;
