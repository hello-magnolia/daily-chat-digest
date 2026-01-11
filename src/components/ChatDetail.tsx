import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Users, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getChatById, generateChatSummary, getMessagesForChat } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ChatDetail = () => {
  const { selectedChatId, setSelectedChatId, selectedDate } = useAppStore();
  
  if (!selectedChatId) return null;
  
  const chat = getChatById(selectedChatId);
  const summary = generateChatSummary(selectedChatId, selectedDate);
  const messages = getMessagesForChat(selectedChatId, selectedDate);
  
  if (!chat) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border"
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedChatId(null)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
            {chat.isGroup ? (
              <Users className="w-6 h-6 text-primary-foreground" />
            ) : (
              <User className="w-6 h-6 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{chat.name}</h1>
            <p className="text-sm text-muted-foreground">
              {summary.messageCount} messages today
              {chat.isGroup && chat.participants && (
                <span> · {chat.participants.length} participants</span>
              )}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-xl p-4">
          <h2 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            Today's Summary
          </h2>
          <p className="text-muted-foreground leading-relaxed">{summary.summary}</p>
        </div>
      </motion.div>

      {/* Key Points */}
      {summary.keyPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border"
        >
          <h2 className="font-semibold text-foreground mb-4">Key Points</h2>
          <ul className="space-y-3">
            {summary.keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">{index + 1}</span>
                </div>
                <p className="text-muted-foreground">{point}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Notable Messages */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border"
        >
          <h2 className="font-semibold text-foreground mb-4">Notable Messages</h2>
          <div className="space-y-3">
            {messages.slice(0, 5).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-muted/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{message.sender}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(message.timestamp, 'h:mm a')}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{message.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatDetail;
