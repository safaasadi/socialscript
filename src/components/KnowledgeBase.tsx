import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  BookOpen, 
  Search, 
  Star, 
  Clock, 
  Filter,
  Download,
  Share,
  Folder,
  FileText,
  Bookmark
} from "lucide-react";

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");

  const folders = [
    { id: "all", name: "All Items", count: 47, icon: BookOpen },
    { id: "saved", name: "Saved Scenarios", count: 23, icon: Bookmark },
    { id: "templates", name: "Email Templates", count: 12, icon: FileText },
    { id: "meetings", name: "Meeting Prep", count: 8, icon: Clock },
    { id: "favorites", name: "Favorites", count: 15, icon: Star }
  ];

  const knowledgeItems = [
    {
      id: 1,
      title: "How to interpret 'Let's circle back'",
      type: "scenario",
      category: "Meeting Communication",
      dateAdded: "3 days ago",
      confidence: 95,
      tags: ["meetings", "indirect-communication", "follow-up"],
      summary: "Comprehensive guide to understanding when colleagues want to postpone discussions and how to respond appropriately.",
      folder: "saved",
      favorite: true
    },
    {
      id: 2,
      title: "Professional email closing phrases",
      type: "template",
      category: "Email Communication",
      dateAdded: "1 week ago",
      confidence: 92,
      tags: ["email", "professional", "closing"],
      summary: "Collection of appropriate ways to end professional emails based on context and relationship.",
      folder: "templates",
      favorite: false
    },
    {
      id: 3,
      title: "Standup meeting participation guide",
      type: "guide",
      category: "Team Meetings",
      dateAdded: "2 weeks ago",
      confidence: 89,
      tags: ["standup", "agile", "participation"],
      summary: "Step-by-step guide for effective participation in daily standup meetings.",
      folder: "meetings",
      favorite: true
    },
    {
      id: 4,
      title: "Decoding client feedback patterns",
      type: "analysis",
      category: "Client Relations", 
      dateAdded: "1 month ago",
      confidence: 94,
      tags: ["clients", "feedback", "sales"],
      summary: "Analysis of common client feedback phrases and their actual meanings.",
      folder: "saved",
      favorite: false
    }
  ];

  const recentlyAccessed = [
    { title: "Email tone for urgent requests", accessed: "2 hours ago" },
    { title: "Meeting prep: Performance review", accessed: "Yesterday" },
    { title: "Handling 'constructive feedback'", accessed: "3 days ago" }
  ];

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = selectedFolder === "all" || item.folder === selectedFolder ||
      (selectedFolder === "favorites" && item.favorite);

    return matchesSearch && matchesFolder;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scenario": return "🎭";
      case "template": return "📄";
      case "guide": return "📋";
      case "analysis": return "📊";
      default: return "📄";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "scenario": return "bg-blue-100 text-blue-800";
      case "template": return "bg-green-100 text-green-800";
      case "guide": return "bg-purple-100 text-purple-800";
      case "analysis": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
          <p className="text-muted-foreground">Your personal library of workplace communication insights</p>
        </div>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your saved scenarios, templates, and guides..."
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
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "default" : "ghost"}
                  className="w-full justify-between text-sm"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{folder.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {selectedFolder === "all" ? "All Items" : folders.find(f => f.id === selectedFolder)?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredItems.length} items</span>
            </div>
          </div>

          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">{getTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                          {item.type}
                        </Badge>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{item.dateAdded}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {item.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {item.favorite && <Star className="h-4 w-4 text-amber-500 fill-current" />}
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className={`h-4 w-4 ${item.favorite ? 'text-amber-500 fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No items found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search terms or browse different folders
                </p>
                <Button>Explore Community Scenarios</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Access Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recently Accessed */}
            <div>
              <h4 className="text-sm font-medium mb-2">Recently Accessed</h4>
              <div className="space-y-2">
                {recentlyAccessed.map((item, index) => (
                  <div key={index} className="p-2 bg-accent/50 rounded cursor-pointer hover:bg-accent transition-colors">
                    <p className="text-xs font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.accessed}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-3 w-3 mr-2" />
                  Export All Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share className="h-3 w-3 mr-2" />
                  Share Collection
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Folder className="h-3 w-3 mr-2" />
                  Create Folder
                </Button>
              </div>
            </div>

            {/* Storage Usage */}
            <div>
              <h4 className="text-sm font-medium mb-2">Storage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Used</span>
                  <span>47 / 100 items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '47%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">53 items remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}