"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { Dashboard } from "@/components/Dashboard";
import { MeetingPrep } from "@/components/MeetingPrep";
import { CommunityHub } from "@/components/CommunityHub";
import { RealTimeDecoder } from "@/components/RealTimeDecoder";
import { EmailToneAnalyzer } from "@/components/EmailToneAnalyzer";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { Settings } from "@/components/Settings";
import { 
  Brain, 
  Shield, 
  Heart, 
  Users, 
  MessageSquare, 
  Sparkles,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Lock,
  LogOut
} from "lucide-react";

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Decoding",
      description: "Real-time analysis of social cues and communication patterns",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Supportive community designed specifically for neurodivergent individuals",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Heart,
      title: "Understanding First",
      description: "Learn at your own pace with personalized guidance and support",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const benefits = [
    "Clear, uncluttered interface design",
    "High contrast ratios for better readability",
    "Full keyboard navigation support",
    "Screen reader and assistive technology friendly",
    "Predictable interactions and layouts",
    "Reduced sensory overload and distractions"
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Software Developer",
      content: "SocialScript has completely changed how I navigate workplace communication. The real-time decoding feature is incredible.",
      rating: 5
    },
    {
      name: "Sarah Williams",
      role: "Marketing Manager",
      content: "Finally, a platform that understands my needs. The community is incredibly supportive and understanding.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Student",
      content: "The accessibility features are amazing. I can focus on learning without worrying about sensory overload.",
      rating: 5
    }
  ];

  // Function to render the active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "meetings":
        return <MeetingPrep />;
      case "community":
        return <CommunityHub />;
      case "decoder":
        return <RealTimeDecoder />;
      case "email":
        return <EmailToneAnalyzer />;
      case "library":
        return <KnowledgeBase />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication forms if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showSignup ? (
            <SignupForm onSwitchToLogin={() => setShowSignup(false)} />
          ) : (
            <LoginForm onSwitchToSignup={() => setShowSignup(true)} />
          )}
        </div>
      </div>
    );
  }

  // Show main app if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  SocialScript
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Welcome, {user.email}</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Features
              </a>
              <a href="#community" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Community
              </a>
              <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                Pricing
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={signOut}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main App Content */}
      {renderActiveComponent()}
    </div>
  );
}
