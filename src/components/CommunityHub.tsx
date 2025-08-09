import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
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
  Plus,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  useCommunityScenarios, 
  useCommunityStats, 
  useTrendingTopics, 
  useScenarioActions,
  useDebounce 
} from "../hooks/useApi";

export function CommunityHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // API hooks
  const { 
    data: scenariosData, 
    loading: scenariosLoading, 
    error: scenariosError,
    refetch: refetchScenarios
  } = useCommunityScenarios(debouncedSearch, selectedCategory);
  
  const { 
    data: stats, 
    loading: statsLoading, 
    error: statsError 
  } = useCommunityStats();
  
  const { 
    data: trendingTopics, 
    loading: trendingLoading, 
    error: trendingError 
  } = useTrendingTopics();

  const { voteScenario, bookmarkScenario, loading: actionLoading } = useScenarioActions();

  // Static categories - you might want to fetch these from API too
  const categories = [
    { id: "all", name: "All Scenarios", count: scenariosData?.total || 0 },
    { id: "meetings", name: "Meeting Dynamics", count: 0 },
    { id: "email", name: "Email Communication", count: 0 },
    { id: "feedback", name: "Feedback & Reviews", count: 0 },
    { id: "clients", name: "Client Relations", count: 0 },
    { id: "teamwork", name: "Team Collaboration", count: 0 }
  ];

  const handleVote = async (scenarioId: string, direction: 'up' | 'down') => {
    try {
      await voteScenario(scenarioId, direction);
      refetchScenarios(); // Refresh the list to show updated vote count
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleBookmark = async (scenarioId: string) => {
    try {
      await bookmarkScenario(scenarioId);
      refetchScenarios(); // Refresh the list to show updated bookmark status
    } catch (error) {
      console.error('Failed to bookmark:', error);
    }
  };

  // Loading state
  if (scenariosLoading && !scenariosData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Community Hub</h2>
            <p className="text-muted-foreground">Learn from shared workplace scenarios and contribute your own</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading community scenarios...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (scenariosError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Community Hub</h2>
            <p className="text-muted-foreground">Learn from shared workplace scenarios and contribute your own</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load community data: {scenariosError}
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Button onClick={refetchScenarios}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {scenariosLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{scenariosData?.scenarios?.length || 0} scenarios</span>
            </div>
          </div>

          {scenariosData?.scenarios?.map((scenario) => (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{scenario.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {scenario.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => handleVote(scenario.id, 'up')}
                      disabled={actionLoading}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {scenario.votes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {scenario.comments}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground"
                      onClick={() => handleBookmark(scenario.id)}
                      disabled={actionLoading}
                    >
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

          {(!scenariosData?.scenarios || scenariosData.scenarios.length === 0) && !scenariosLoading && (
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
            {trendingLoading && (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </div>
            )}
            
            {trendingError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Failed to load trending topics
                </AlertDescription>
              </Alert>
            )}
            
            {trendingTopics?.map((topic, index) => (
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
          {statsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
          ) : statsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load community stats</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats?.scenariosShared?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-muted-foreground">Scenarios Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats?.peopleHelped?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-muted-foreground">People Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats?.helpfulPercentage || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Found Solutions Helpful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {stats?.activeContributors?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-muted-foreground">Active Contributors</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}