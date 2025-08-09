import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MessageSquare, 
  Brain, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Copy,
  Save,
  RotateCcw,
  Upload,
  Mic,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useMessageDecoder, useKnowledgeActions } from "@/hooks/useApi";
import type { MessageDecoding } from "@/lib/api";

export function RealTimeDecoder() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<MessageDecoding | null>(null);
  const [context, setContext] = useState("");
  
  const { decodeMessage, loading: isAnalyzing, error: analysisError } = useMessageDecoder();
  const { saveItem, loading: isSaving } = useKnowledgeActions();

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    try {
      const result = await decodeMessage(inputText, context);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to decode message:', error);
      // Error is handled by the hook
    }
  };

  const handleSave = async () => {
    if (!analysis) return;
    
    try {
      await saveItem({
        title: `Decoded: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`,
        type: 'analysis',
        category: 'Real-Time Decoding',
        tags: ['decoded', 'workplace-communication'],
        summary: analysis.decoded,
        content: JSON.stringify(analysis),
        folder: 'saved',
        favorite: false,
        confidence: analysis.confidence
      });
      
      // Show success feedback
      console.log('Analysis saved to knowledge base');
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    
    const copyText = `Message: "${analysis.literal}"

Decoded Meaning: ${analysis.decoded}

Tone: ${analysis.tone.description}

Suggested Response: ${analysis.suggestions.find(s => s.type === 'response')?.content || 'No response suggestion available'}`;

    navigator.clipboard.writeText(copyText);
  };

  const resetForm = () => {
    setInputText("");
    setContext("");
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Real-Time Decoder</h2>
          <p className="text-muted-foreground">Translate workplace communication into clear, actionable insights</p>
        </div>
      </div>

      {/* Error Alert */}
      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Input
            </CardTitle>
            <CardDescription>Paste or type the message you'd like to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Example: 'Hey, I think we should circle back on the project timeline after we touch base with the stakeholders offline.'"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[150px] resize-none"
                />
                
                <Textarea
                  placeholder="Additional context (optional): 'This was said by my manager during our sprint planning meeting...'"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={!inputText.trim() || isAnalyzing} 
                    className="flex-1"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Decode Message
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop an email file or click to browse</p>
                  <Button variant="outline" className="mt-2">Choose File</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Mic className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Record or upload audio of the conversation</p>
                  <Button variant="outline" className="mt-2">
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Analysis
              </div>
              {analysis && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {analysis.confidence}% confidence
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopy}
                      disabled={!analysis}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSave}
                      disabled={!analysis || isSaving}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysis && !isAnalyzing && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a message above to see the AI analysis</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing communication patterns...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Confidence</span>
                    <span>{analysis.confidence}%</span>
                  </div>
                  <Progress value={analysis.confidence} className="h-2" />
                </div>

                {/* Main Translation */}
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {analysis.decoded}
                  </AlertDescription>
                </Alert>

                {/* Tone Analysis */}
                <div>
                  <h4 className="font-medium mb-2">Tone & Intent</h4>
                  <Badge variant={analysis.tone.color as any} className="mb-2">
                    {analysis.tone.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{analysis.tone.description}</p>
                </div>

                {/* Context Clues */}
                <div>
                  <h4 className="font-medium mb-2">Context Clues</h4>
                  <ul className="space-y-1">
                    {analysis.context.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alternative Interpretations */}
                <div>
                  <h4 className="font-medium mb-2">Alternative Interpretations</h4>
                  <div className="space-y-2">
                    {analysis.alternativeInterpretations.map((alt: any, index: number) => (
                      <div key={index} className="p-3 bg-accent/50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-sm flex-1">{alt.interpretation}</p>
                          <Badge variant="outline" className="text-xs ml-2">
                            {alt.likelihood}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggestions Panel */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Actions</CardTitle>
            <CardDescription>Based on the analysis, here's what you might consider doing next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {analysis.suggestions.map((suggestion: any, index: number) => {
                // Map icon names to actual icon components
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case 'MessageSquare': return MessageSquare;
                    case 'CheckCircle': return CheckCircle;
                    case 'Lightbulb': return Lightbulb;
                    default: return MessageSquare;
                  }
                };
                
                const Icon = getIcon(suggestion.icon);
                
                return (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{suggestion.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}