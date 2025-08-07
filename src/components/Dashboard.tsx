import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Brain,
  MessageSquare,
  Mail,
  Calendar,
  Users,
  BookOpen,
  Settings,
  Menu,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Dashboard({
  activeTab,
  setActiveTab,
}: DashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [socialEnergy, setSocialEnergy] = useState(75);

  const navigation = [
    { id: "dashboard", name: "Dashboard", icon: Brain },
    {
      id: "decoder",
      name: "Real-Time Decoder",
      icon: MessageSquare,
    },
    { id: "email", name: "Email Tone Analyzer", icon: Mail },
    { id: "meetings", name: "Meeting Prep", icon: Calendar },
    { id: "community", name: "Community", icon: Users },
    { id: "library", name: "Knowledge Base", icon: BookOpen },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const recentScenarios = [
    {
      id: 1,
      title: "Interpreting 'let's circle back'",
      confidence: 95,
      saved: true,
    },
    {
      id: 2,
      title: "Meeting invitation tone analysis",
      confidence: 88,
      saved: false,
    },
    {
      id: 3,
      title: "Slack message clarification",
      confidence: 92,
      saved: true,
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: "Team Standup",
      time: "9:00 AM",
      participants: 5,
      prep: true,
    },
    {
      id: 2,
      title: "Client Presentation",
      time: "2:00 PM",
      participants: 8,
      prep: false,
    },
    {
      id: 3,
      title: "1:1 with Manager",
      time: "4:00 PM",
      participants: 2,
      prep: true,
    },
  ];

  const Sidebar = ({
    isMobile = false,
  }: {
    isMobile?: boolean;
  }) => (
    <div
      className={`${isMobile ? "" : "hidden lg:block"} w-64 bg-sidebar border-r border-sidebar-border`}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">
              SocialScript
            </h1>
            <p className="text-sm text-sidebar-foreground/60">
              Your AI Social Coach
            </p>
          </div>
        </div>

        {/* Social Energy Meter */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Social Energy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={socialEnergy} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Recharging</span>
                <span>{socialEnergy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={
                  activeTab === item.id ? "default" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setMobileMenuOpen(false);
                }}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        {/* Quick Access */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Recent Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentScenarios.slice(0, 3).map((scenario) => (
              <div
                key={scenario.id}
                className="p-2 rounded-md hover:bg-accent/50 cursor-pointer"
              >
                <p className="text-xs font-medium truncate">
                  {scenario.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    {scenario.confidence}%
                  </Badge>
                  {scenario.saved && (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (activeTab === "dashboard") {
    return (
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">
                SocialScript
              </span>
            </div>
            <Sheet
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            >
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar isMobile />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 p-6 lg:p-8">
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                What's happening right now?
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Describe the social situation you're navigating... 'My manager just said we should touch base offline about the project timeline. What does this actually mean?'"
                    className="min-h-[100px] resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Paste Text
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Upload Email
                      </Button>
                    </div>
                    <Button>
                      <Zap className="h-4 w-4 mr-2" />
                      Decode Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Today's Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Today's Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm font-medium">
                        Communication Pattern
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You've been receiving more indirect
                        feedback lately. Consider asking
                        clarifying questions.
                      </p>
                    </div>
                    <div className="p-3 bg-accent/50 rounded-lg">
                      <p className="text-sm font-medium">
                        Energy Management
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your social energy is at 75%. Perfect
                        time for that challenging conversation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Translations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Translations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentScenarios.map((scenario) => (
                      <div
                        key={scenario.id}
                        className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {scenario.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                            >
                              {scenario.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                        {scenario.saved && (
                          <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Meetings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary" />
                    Upcoming Meetings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingMeetings.map((meeting) => (
                      <div
                        key={meeting.id}
                        className="p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {meeting.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {meeting.time} •{" "}
                              {meeting.participants} people
                            </p>
                          </div>
                          {meeting.prep ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump to your most-used features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("decoder")}
                  >
                    <MessageSquare className="h-6 w-6" />
                    Decode Message
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("email")}
                  >
                    <Mail className="h-6 w-6" />
                    Analyze Email
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("meetings")}
                  >
                    <Calendar className="h-6 w-6" />
                    Prep Meeting
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("community")}
                  >
                    <Users className="h-6 w-6" />
                    Browse Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
}