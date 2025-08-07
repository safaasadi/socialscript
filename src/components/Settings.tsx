import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Brain,
  Download,
  Trash2,
  HelpCircle
} from "lucide-react";

export function Settings() {
  const [notifications, setNotifications] = useState({
    emailAnalysis: true,
    meetingReminders: true,
    communityUpdates: false,
    weeklyInsights: true
  });

  const [preferences, setPreferences] = useState({
    confidenceThreshold: [80],
    analysisDepth: "detailed",
    communicationStyle: "collaborative",
    industryContext: "technology"
  });

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "Senior Developer",
    communicationPreferences: ["direct", "data-driven"]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Settings</h2>
          <p className="text-muted-foreground">Customize your SocialScript experience</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">AI Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Help SocialScript provide more personalized guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Job Role</Label>
                  <Input 
                    id="role" 
                    value={profile.role}
                    onChange={(e) => setProfile(prev => ({...prev, role: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={preferences.industryContext} onValueChange={(value) => 
                    setPreferences(prev => ({...prev, industryContext: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Communication Style Preferences</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select styles that describe how you prefer to communicate
                </p>
                <div className="flex flex-wrap gap-2">
                  {["direct", "collaborative", "data-driven", "relationship-focused", "formal", "casual"].map((style) => (
                    <Badge 
                      key={style}
                      variant={profile.communicationPreferences.includes(style) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const isSelected = profile.communicationPreferences.includes(style);
                        setProfile(prev => ({
                          ...prev, 
                          communicationPreferences: isSelected 
                            ? prev.communicationPreferences.filter(s => s !== style)
                            : [...prev.communicationPreferences, style]
                        }));
                      }}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button>Save Profile Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Analysis Preferences
              </CardTitle>
              <CardDescription>
                Customize how SocialScript analyzes and presents insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Confidence Threshold</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Only show analysis when AI is at least this confident
                </p>
                <div className="space-y-2">
                  <Slider
                    value={preferences.confidenceThreshold}
                    onValueChange={(value) => setPreferences(prev => ({...prev, confidenceThreshold: value}))}
                    max={100}
                    min={50}
                    step={5}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>50%</span>
                    <span>Current: {preferences.confidenceThreshold[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Analysis Depth</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  How detailed should the analysis be?
                </p>
                <Select value={preferences.analysisDepth} onValueChange={(value) => 
                  setPreferences(prev => ({...prev, analysisDepth: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick - Key points only</SelectItem>
                    <SelectItem value="standard">Standard - Balanced detail</SelectItem>
                    <SelectItem value="detailed">Detailed - Comprehensive analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Default Communication Style</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  How should suggested responses sound?
                </p>
                <Select value={preferences.communicationStyle} onValueChange={(value) => 
                  setPreferences(prev => ({...prev, communicationStyle: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="warm">Warm & Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save AI Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control when and how SocialScript notifies you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Analysis Complete</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when email tone analysis is ready
                  </p>
                </div>
                <Switch
                  checked={notifications.emailAnalysis}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, emailAnalysis: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Meeting Preparation Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminders to prepare for upcoming meetings
                  </p>
                </div>
                <Switch
                  checked={notifications.meetingReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, meetingReminders: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Community Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    New scenarios and discussions in the community
                  </p>
                </div>
                <Switch
                  checked={notifications.communityUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, communityUpdates: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Insights</Label>
                  <p className="text-sm text-muted-foreground">
                    Weekly summary of your communication patterns
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyInsights}
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, weeklyInsights: checked}))}
                />
              </div>

              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Data
              </CardTitle>
              <CardDescription>
                Control how your data is used and stored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Data Processing</h4>
                <p className="text-sm text-blue-800">
                  Your conversations are processed locally when possible. Only anonymized patterns are used to improve the AI model.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Improve AI with my data</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve SocialScript by sharing anonymized usage patterns
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Community contributions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing of anonymized scenarios with the community
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Usage analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how features are used to improve the product
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Data Export & Deletion</h4>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline">
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Manage your SocialScript subscription and account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-900">Professional Plan</h4>
                    <p className="text-sm text-green-800">Active until March 15, 2024</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Usage This Month</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">47</div>
                    <div className="text-sm text-muted-foreground">Scenarios Decoded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">23</div>
                    <div className="text-sm text-muted-foreground">Emails Analyzed</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t space-y-3">
                <h4 className="font-medium">Account Actions</h4>
                <div className="flex flex-col gap-2">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Billing & Subscription</Button>
                  <Button variant="outline">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Get Support
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}