import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
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
  Bookmark,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  useKnowledgeItems, 
  useKnowledgeFolders, 
  useKnowledgeActions,
  useDebounce 
} from "@/hooks/useApi";
import type { KnowledgeItem } from "@/lib/api";

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // API hooks
  const { 
    data: itemsData, 
    loading: itemsLoading, 
    error: itemsError,
    refetch: refetchItems
  } = useKnowledgeItems(debouncedSearch, selectedFolder);
  
  const { 
    data: folders, 
    loading: foldersLoading, 
    error: foldersError 
  } = useKnowledgeFolders();
  
  const { toggleFavorite, loading: actionLoading } = useKnowledgeActions();

  // Static recent access data - you might want to fetch this from API too
  const recentlyAccessed = [
    { title: "Email tone for urgent requests", accessed: "2 hours ago" },
    { title: "Meeting prep: Performance review", accessed: "Yesterday" },
    { title: "Handling 'constructive feedback'", accessed: "3 days ago" }
  ];

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      refetchItems(); // Refresh the list to show updated favorite status
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

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

  // Loading state
  if (itemsLoading && !itemsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Knowledge Base</h2>
            <p className="text-muted-foreground">Your personal library of workplace communication insights</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your knowledge base...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (itemsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold">Knowledge Base</h2>
            <p className="text-muted-foreground">Your personal library of workplace communication insights</p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load knowledge base: {itemsError}</AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="py-12 text-center">
            <Button onClick={refetchItems}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {foldersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : foldersError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">Failed to load folders</AlertDescription>
              </Alert>
            ) : folders ? (
              folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "default" : "ghost"}
                  className="w-full justify-between text-sm"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span>{folder.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No folders available</p>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {selectedFolder === "all" ? "All Items" : folders?.find(f => f.id === selectedFolder)?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {itemsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{itemsData?.items?.length || 0} items</span>
            </div>
          </div>

          {itemsData?.items?.map((item) => (
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

                {/* Category and Actions */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleFavorite(item.id)}
                      disabled={actionLoading}
                    >
                      <Star className={`h-4 w-4 ${item.favorite ? 'text-amber-500 fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!itemsData?.items || itemsData.items.length === 0) && !itemsLoading && (
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
                  <span>{itemsData?.total || 0} / 100 items</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${Math.min((itemsData?.total || 0) / 100 * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.max(100 - (itemsData?.total || 0), 0)} items remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}