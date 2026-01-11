import { motion } from "framer-motion";
import { MessageSquare, Users, User, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { getChatMessageCount, sampleChats } from "@/lib/data";

const ChatSidebar = () => {
  const { selectedChatId, setSelectedChatId, filterMode, selectedDate } = useAppStore();

  const getFilteredChats = () => {
    let chats = sampleChats.map(chat => ({
      ...chat,
      messageCount: getChatMessageCount(chat.id, selectedDate)
    }));

    // Sort by most active
    chats.sort((a, b) => b.messageCount - a.messageCount);

    if (filterMode === 'groups') {
      chats = chats.filter(c => c.isGroup);
    } else if (filterMode === 'top5') {
      chats = chats.slice(0, 5);
    }

    return chats;
  };

  const chats = getFilteredChats();

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-sidebar-foreground mb-1">Your Chats</h2>
        <p className="text-xs text-muted-foreground mb-3">Select a chat to view its summary</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-sidebar-accent rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-sidebar-ring placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* All Chats option */}
          <button
            onClick={() => setSelectedChatId(null)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left",
              selectedChatId === null 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              selectedChatId === null ? "gradient-hero" : "bg-primary/10"
            )}>
              <MessageSquare className={cn(
                "w-5 h-5",
                selectedChatId === null ? "text-primary-foreground" : "text-primary"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">All Chats</p>
              <p className="text-xs text-muted-foreground">Daily digest view</p>
            </div>
          </button>

          {/* Individual Chats */}
          {chats.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedChatId(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group",
                selectedChatId === chat.id 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                selectedChatId === chat.id ? "gradient-hero" : "bg-primary/10"
              )}>
                {chat.isGroup ? (
                  <Users className={cn(
                    "w-5 h-5",
                    selectedChatId === chat.id ? "text-primary-foreground" : "text-primary"
                  )} />
                ) : (
                  <User className={cn(
                    "w-5 h-5",
                    selectedChatId === chat.id ? "text-primary-foreground" : "text-primary"
                  )} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{chat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {chat.isGroup ? "Group" : "Direct"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {chat.messageCount > 0 && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/?text=Opening%20${encodeURIComponent(chat.name)}`, '_blank');
                  }}
                  title="Open in WhatsApp"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
