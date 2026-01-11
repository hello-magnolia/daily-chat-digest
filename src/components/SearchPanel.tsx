import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchMessages, SearchResult } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";

const exampleQueries = [
  "Did anyone mention the dinner on Friday?",
  "Any updates about the venue?",
  "What time did people agree on?",
  "Who's bringing the cake?",
];

const SearchPanel = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { selectedDate, setSelectedChatId } = useAppStore();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      const searchResult = searchMessages(query, selectedDate);
      setResult(searchResult);
      setIsSearching(false);
    }, 500);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setIsSearching(true);
    setTimeout(() => {
      const searchResult = searchMessages(example, selectedDate);
      setResult(searchResult);
      setIsSearching(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
          <Search className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Ask Your Chats</h2>
          <p className="text-sm text-muted-foreground">Search across all conversations</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ask a question about your chats..."
            className="w-full px-4 py-3 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || !query.trim()}
          className="shrink-0"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Example Queries */}
      {!result && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 pt-4 border-t border-border"
          >
            {/* Answer */}
            <div className="bg-accent/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-foreground leading-relaxed">{result.answer}</p>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Found in {result.sources.length} chat(s):</p>
                {result.sources.map((source) => (
                  <div 
                    key={source.chat_id}
                    className="bg-muted/50 rounded-lg p-3 hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedChatId(source.chat_id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm text-foreground">{source.chat_name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {source.messages.slice(0, 2).map((msg) => (
                      <div key={msg.id} className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="mx-1">·</span>
                        <span>{format(msg.timestamp, 'h:mm a')}</span>
                        <span className="mx-1">·</span>
                        <span className="italic">"{msg.text.substring(0, 50)}..."</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Clear button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setResult(null); setQuery(""); }}
              className="mt-3 w-full"
            >
              Clear search
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchPanel;
