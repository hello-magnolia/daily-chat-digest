import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calendar, Zap, Search, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Instant Summaries",
    description: "Get AI-powered summaries of your busiest chats in seconds"
  },
  {
    icon: Calendar,
    title: "Never Miss Events",
    description: "Automatically extract events, deadlines, and important dates"
  },
  {
    icon: Search,
    title: "Ask Your Chats",
    description: "Search across all conversations with natural language queries"
  }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">WhatsApp Digest</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                No more endless scrolling
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                See today's WhatsApp updates{" "}
                <span className="text-primary">in one digest</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Stop drowning in group chats. Get smart summaries of your conversations, 
                extracted events, and instant answers—all in one beautiful dashboard.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/login')}
                >
                  <MessageSquare className="w-5 h-5" />
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate('/login')}
                >
                  See how it works
                </Button>
              </div>
            </motion.div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className="bg-card rounded-2xl shadow-card-hover border border-border overflow-hidden">
                <div className="bg-muted/50 px-6 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-highlight-event/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Today's Digest</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg">🎉</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Event Planning</p>
                        <p className="text-sm text-muted-foreground">Party confirmed for Saturday at Sky Lounge. DJ booked 7-11 PM. $50 each for the gift.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg">💼</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Work Team</p>
                        <p className="text-sm text-muted-foreground">Presentation moved to Wednesday 2 PM. Team divided tasks and agreed on blue theme.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-lg">👨‍👩‍👧‍👦</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Family Group</p>
                        <p className="text-sm text-muted-foreground">Sunday dinner at 5 PM. Dad's making lasagna, sis bringing tiramisu!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything you need to stay on top
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Optimized for group chats and event-heavy updates
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 shadow-card border border-border hover:shadow-card-hover transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to take control of your chats?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Sign in to see your daily digest and search your conversations
              </p>
              <Button 
                variant="hero" 
                size="xl"
                onClick={() => navigate('/login')}
              >
                <MessageSquare className="w-5 h-5" />
                Sign In Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WhatsApp Daily Digest — A demo app for catching up on your chats</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
