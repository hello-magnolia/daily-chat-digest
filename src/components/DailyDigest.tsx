import { motion } from "framer-motion";
import { Sparkles, Calendar, CheckCircle, Link as LinkIcon, Clock, Target } from "lucide-react";
import { extractHighlights, generateDailyDigest, Highlight } from "@/lib/data";
import { useAppStore } from "@/lib/store";

const highlightConfig = {
  event: { icon: Calendar, label: "Events", color: "bg-highlight-event/10 text-highlight-event border-highlight-event/20" },
  decision: { icon: CheckCircle, label: "Decisions", color: "bg-highlight-decision/10 text-highlight-decision border-highlight-decision/20" },
  action: { icon: Target, label: "Action Items", color: "bg-highlight-action/10 text-highlight-action border-highlight-action/20" },
  link: { icon: LinkIcon, label: "Links Shared", color: "bg-highlight-link/10 text-highlight-link border-highlight-link/20" },
  deadline: { icon: Clock, label: "Deadlines", color: "bg-highlight-deadline/10 text-highlight-deadline border-highlight-deadline/20" },
};

const HighlightCard = ({ highlight, index }: { highlight: Highlight; index: number }) => {
  const config = highlightConfig[highlight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-3 p-3 rounded-lg border ${config.color}`}
    >
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{highlight.text}</p>
        <p className="text-xs opacity-70 mt-1">{highlight.chat_name}</p>
      </div>
    </motion.div>
  );
};

const DailyDigest = () => {
  const { selectedDate } = useAppStore();
  const digest = generateDailyDigest(selectedDate);
  const highlights = extractHighlights(selectedDate);

  // Group highlights by type
  const groupedHighlights = highlights.reduce((acc, h) => {
    if (!acc[h.type]) acc[h.type] = [];
    acc[h.type].push(h);
    return acc;
  }, {} as Record<string, Highlight[]>);

  return (
    <div className="space-y-8">
      {/* Daily Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-hero mb-4">
          <Sparkles className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Daily Digest</h1>
        <p className="text-muted-foreground mb-6">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border text-left">
          <div className="prose prose-sm max-w-none">
            {digest.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0 text-base">
                {paragraph.split('**').map((part, j) => 
                  j % 2 === 1 ? <strong key={j} className="text-foreground font-semibold">{part}</strong> : part
                )}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Highlights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border"
      >
        <h2 className="font-semibold text-foreground mb-4">Today's Highlights</h2>
        
        <div className="space-y-6">
          {Object.entries(highlightConfig).map(([type, config]) => {
            const items = groupedHighlights[type] || [];
            if (items.length === 0) return null;

            return (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  <config.icon className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground">{config.label}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((highlight, index) => (
                    <HighlightCard key={index} highlight={highlight} index={index} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DailyDigest;
