import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  Users, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  Star,
  Plus
} from "lucide-react";

export function CommunityHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const scenarios = [
    {
      id: 1,
      title: "Decoding 'Let's take this offline'",
      author: "Alex M.",
      category: "Meeting Dynamics",
      tags: ["meetings", "indirect-communication", "professional"],
      votes: 47,
      comments: 12,
      bookmarks: 23,
      timeAgo: "2 days ago",
      preview: "My manager said this during our team meeting when I brought up a concern about the project timeline. I wasn't sure if I was being dismissed or if they genuinely wanted to discuss it privately...",
      solution: "It usually means they want to discuss it in a smaller group or one-on-one. Not necessarily dismissive - often about finding the right setting for deeper discussion.",
      confidence: 92
    },
    {
      id: 2,
      title: "Understanding 'Thanks in advance'",
      author: "Sarah K.",
      category: "Email Communication",
      tags: ["email", "tone", "expectations"],
      votes: 35,
      comments: 8,
      bookmarks: 15,
      timeAgo: "1 week ago",
      preview: "I keep seeing 'Thanks in advance' in emails and I'm never sure what it really means. Is it polite or pushy?",
      solution: "It's generally polite but implies expectation that you'll complete the task. It's a soft way of saying the request is important.",
      confidence: 88
    },
    {
      id: 3,
      title: "Client said our proposal was 'interesting'",
      author: "Mike R.",
      category: "Client Relations",
      tags: ["clients", "feedback", "sales"],
      votes: 28,
      comments: 15,
      bookmarks: 11,
      timeAgo: "3 days ago",
      preview: "After our presentation, the client said our proposal was 'quite interesting' and they'll 'think about it.' I can't tell if this is good or bad...",
      solution: "'Interesting' is often neutral-to-positive but non-committal. They're likely comparing options. Follow up with specific questions about concerns.",
      confidence: 85
    }
  ];

  const categories = [
    { id: "all", name: "All Scenarios", count: 156 },
    { id: "meetings", name: "Meeting Dynamics", count: 43 },
    { id: "email", name: "Email Communication", count: 38 },
    { id: "feedback", name: "Feedback & Reviews", count: 25 },
    { id: "clients", name: "Client Relations", count: 22 },
    { id: "teamwork", name: "Team Collaboration", count: 28 }
  ];

  const trendingTopics = [
    { topic: "Hybrid meeting etiquette", discussions: 23 },
    { topic: "Email tone in remote work", discussions: 18 },
    { topic: "Performance review language", discussions: 15 },
    { topic: "Cross-cultural communication", discussions: 12 }
  ];

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = searchQuery === "" || 
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      scenario.category.toLowerCase().includes(selectedCategory) ||
      scenario.tags.some(tag => tag.includes(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Community Hub</h2>
          <p className="text-muted-foreground">Learn from shared workplace scenarios and contribute your own</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scenarios, situations, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Share Scenario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className="w-full justify-between text-sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {selectedCategory === "all" ? "All Scenarios" : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredScenarios.length} scenarios</span>
            </div>
          </div>

          {filteredScenarios.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{scenario.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{scenario.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{scenario.author}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{scenario.timeAgo}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{scenario.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scenario.preview}
                </p>
                
                {/* Community Solution */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-800">Community Solution</span>
                    <Badge variant="outline" className="text-xs">
                      {scenario.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm text-green-800">{scenario.solution}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {scenario.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Heart className="h-4 w-4 mr-1" />
                      {scenario.votes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {scenario.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Bookmark className="h-4 w-4 mr-1" />
                      {scenario.bookmarks}
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    View Full Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredScenarios.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No scenarios found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search terms or browse different categories
                </p>
                <Button>Share Your Own Scenario</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trending Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-3 bg-accent/50 rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <p className="text-sm font-medium mb-1">{topic.topic}</p>
                <p className="text-xs text-muted-foreground">
                  {topic.discussions} active discussions
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Community Impact</CardTitle>
          <CardDescription>See how our community is helping each other grow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,847</div>
              <div className="text-sm text-muted-foreground">Scenarios Shared</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15,623</div>
              <div className="text-sm text-muted-foreground">People Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Found Solutions Helpful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,205</div>
              <div className="text-sm text-muted-foreground">Active Contributors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}