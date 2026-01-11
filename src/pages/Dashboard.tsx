import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Calendar, 
  Menu, 
  X, 
  Filter,
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import ChatSidebar from "@/components/ChatSidebar";
import DailyDigest from "@/components/DailyDigest";
import ChatDetail from "@/components/ChatDetail";
import SearchPanel from "@/components/SearchPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const filterOptions = [
  { value: 'all', label: 'All Chats' },
  { value: 'groups', label: 'Groups Only' },
  { value: 'top5', label: 'Top 5 Busiest' },
] as const;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected, selectedChatId, filterMode, setFilterMode, selectedDate, setSelectedDate } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not connected (logged in)
  useEffect(() => {
    if (!isConnected) {
      navigate('/login');
    }
  }, [isConnected, navigate]);

  if (!isConnected) return null;

  const currentFilter = filterOptions.find(f => f.value === filterMode);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg text-foreground hidden sm:block">WhatsApp Digest</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Date selector */}
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Filter className="w-4 h-4 mr-2" />
                  {currentFilter?.label}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterMode(option.value)}
                    className={filterMode === option.value ? 'bg-accent' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-72 shrink-0">
          <ChatSidebar />
        </aside>

        {/* Sidebar - Mobile overlay */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-16 bottom-0 w-72"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatSidebar />
            </motion.aside>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Search Panel - Always visible */}
            <SearchPanel />
            
            {/* Content based on selection */}
            {selectedChatId ? (
              <ChatDetail />
            ) : (
              <DailyDigest />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
