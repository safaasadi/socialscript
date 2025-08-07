import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  FileText,
  MessageSquare,
  User,
  Target
} from "lucide-react";

export function MeetingPrep() {
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Weekly Team Standup",
      time: "9:00 AM - 9:30 AM",
      date: "Today",
      participants: [
        { name: "Sarah Chen", role: "PM", style: "Direct, data-driven", energy: "high" },
        { name: "Mike Rodriguez", role: "Dev Lead", style: "Collaborative, patient", energy: "medium" },
        { name: "Alex Kim", role: "Designer", style: "Visual, detailed", energy: "low" }
      ],
      agenda: [
        "Sprint progress review",
        "Blocker discussion", 
        "Next week planning"
      ],
      prepComplete: false,
      context: "Regular team sync - keep updates brief and actionable"
    },
    {
      id: 2,
      title: "Client Presentation Review",
      time: "2:00 PM - 3:00 PM", 
      date: "Today",
      participants: [
        { name: "Jennifer Walsh", role: "Client", style: "Results-focused, formal", energy: "high" },
        { name: "David Park", role: "Account Manager", style: "Relationship-builder", energy: "high" }
      ],
      agenda: [
        "Q3 results presentation",
        "Budget discussion",
        "Q4 planning"
      ],
      prepComplete: true,
      context: "High-stakes client meeting - prepare for detailed questions"
    }
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState(meetings[0]);
  
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Review previous meeting notes", completed: false },
    { id: 2, task: "Prepare status update (2-3 bullets max)", completed: true },
    { id: 3, task: "Think of 1-2 questions to ask", completed: false },
    { id: 4, task: "Check if any blockers need escalation", completed: false },
    { id: 5, task: "Set intention for participation level", completed: true }
  ]);

  const completedTasks = checklist.filter(item => item.completed).length;
  const progressPercent = (completedTasks / checklist.length) * 100;

  const communicationTips = {
    "Sarah Chen": [
      "Lead with data and metrics when giving updates",
      "Keep explanations concise - she prefers bullet points",
      "If you have concerns, present them with potential solutions"
    ],
    "Mike Rodriguez": [
      "He's open to questions and collaboration",
      "Feel free to ask for clarification if needed",
      "He appreciates when team members help each other"
    ],
    "Alex Kim": [
      "Visual aids help when explaining technical concepts",
      "They tend to be quieter but have valuable input",
      "Ask directly for their perspective on design-related items"
    ]
  };

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Meeting Preparation Hub</h2>
          <p className="text-muted-foreground">Get ready for successful workplace interactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>Click a meeting to start preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMeeting.id === meeting.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground">{meeting.date} • {meeting.time}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">{meeting.participants.length} participants</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    {meeting.prepComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Meeting Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Meeting Overview
              </div>
              <Badge variant={selectedMeeting.prepComplete ? "default" : "secondary"}>
                {selectedMeeting.prepComplete ? "Ready" : "In Progress"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{selectedMeeting.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{selectedMeeting.context}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMeeting.date} • {selectedMeeting.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMeeting.participants.length} participants</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Agenda</h4>
              <ul className="space-y-1">
                {selectedMeeting.agenda.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Preparation Progress</h4>
              <div className="space-y-2">
                <Progress value={progressPercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {completedTasks} of {checklist.length} tasks completed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Preparation Checklist
            </CardTitle>
            <CardDescription>Complete these tasks to feel confident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <Checkbox 
                  checked={item.completed}
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.task}
                  </p>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full mt-4"
              disabled={progressPercent === 100}
            >
              {progressPercent === 100 ? "Preparation Complete!" : "Add Custom Task"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Participant Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Participant Insights
            </CardTitle>
            <CardDescription>Understand communication styles and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedMeeting.participants.map((participant, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{participant.name}</h4>
                      <p className="text-sm text-muted-foreground">{participant.role}</p>
                    </div>
                    <Badge 
                      variant={participant.energy === 'high' ? 'default' : 
                              participant.energy === 'medium' ? 'secondary' : 'outline'}
                    >
                      {participant.energy} energy
                    </Badge>
                  </div>
                  <p className="text-sm mb-3 font-medium">Style: {participant.style}</p>
                  
                  {communicationTips[participant.name as keyof typeof communicationTips] && (
                    <div>
                      <h5 className="text-sm font-medium mb-1">Communication Tips:</h5>
                      <ul className="space-y-1">
                        {communicationTips[participant.name as keyof typeof communicationTips]?.slice(0, 2).map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 mt-0.5 text-amber-500 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Templates & Scripts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Templates & Scripts
            </CardTitle>
            <CardDescription>Ready-to-use phrases for common situations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="opening" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="opening">Opening</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="opening" className="space-y-3 mt-4">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Acknowledging Previous Meeting</p>
                  <p className="text-xs text-muted-foreground">
                    "Following up on our discussion about [topic], I've made progress on..."
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Setting Expectations</p>
                  <p className="text-xs text-muted-foreground">
                    "I have a quick update and one question, should take about 2 minutes."
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="updates" className="space-y-3 mt-4">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Progress Report</p>
                  <p className="text-xs text-muted-foreground">
                    "I completed [X] and [Y]. Currently working on [Z], expected completion by [date]."
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Flagging Issues</p>
                  <p className="text-xs text-muted-foreground">
                    "I've hit a blocker with [issue]. I think the solution might be [suggestion]."
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="questions" className="space-y-3 mt-4">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Asking for Clarification</p>
                  <p className="text-xs text-muted-foreground">
                    "Could you help me understand the priority between [A] and [B]?"
                  </p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Resource Requests</p>
                  <p className="text-xs text-muted-foreground">
                    "To move forward with [task], I'll need [specific resource]. What's the best way to get that?"
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}