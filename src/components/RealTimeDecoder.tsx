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
  Mic
} from "lucide-react";

export function RealTimeDecoder() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnalysis = {
        literal: inputText,
        decoded: generateMockDecoding(inputText),
        tone: analyzeTone(inputText),
        context: generateContext(inputText),
        suggestions: generateSuggestions(inputText),
        alternativeInterpretations: generateAlternatives(inputText)
      };
      
      setAnalysis(mockAnalysis);
      setConfidence(Math.floor(Math.random() * 20) + 80); // 80-100%
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockDecoding = (text: string) => {
    if (text.toLowerCase().includes("circle back")) {
      return "This typically means 'let's postpone this discussion and revisit it later.' The person may need time to think, consult others, or isn't ready to make a decision now. It's not necessarily negative - just a delay.";
    }
    if (text.toLowerCase().includes("touch base")) {
      return "This means 'let's have a brief conversation to check in and share updates.' It's usually informal and doesn't indicate a problem - just maintaining communication.";
    }
    if (text.toLowerCase().includes("let's discuss offline")) {
      return "This suggests the topic is either too complex for the current setting, sensitive, or needs more private discussion. They want to continue the conversation in a different format (phone call, private meeting, etc.).";
    }
    return "Based on the language patterns and context, this appears to be a professional communication that may have underlying meanings beyond the literal text.";
  };

  const analyzeTone = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("urgent") || lowerText.includes("asap")) {
      return { type: "urgent", color: "destructive", description: "High priority, immediate action needed" };
    }
    if (lowerText.includes("please") || lowerText.includes("thank you")) {
      return { type: "polite", color: "secondary", description: "Courteous and professional" };
    }
    if (lowerText.includes("discuss") || lowerText.includes("review")) {
      return { type: "collaborative", color: "primary", description: "Open to dialogue and input" };
    }
    return { type: "neutral", color: "secondary", description: "Standard professional communication" };
  };

  const generateContext = (text: string) => {
    return [
      "Workplace hierarchy: This appears to be peer-to-peer or manager-to-employee communication",
      "Timing: The phrasing suggests this isn't urgent but should be addressed reasonably soon",
      "Formality level: Professional but not overly formal, indicates established working relationship"
    ];
  };

  const generateSuggestions = (text: string) => {
    return [
      {
        type: "response",
        icon: MessageSquare,
        title: "Suggested Response",
        content: "Thanks for bringing this up. When would be a good time for you to discuss this further? I'm available [your availability]."
      },
      {
        type: "action",
        icon: CheckCircle,
        title: "Next Steps",
        content: "Schedule a 15-30 minute meeting within the next week to discuss the details."
      },
      {
        type: "preparation",
        icon: Lightbulb,
        title: "How to Prepare",
        content: "Review any relevant documents or data points related to the topic before your discussion."
      }
    ];
  };

  const generateAlternatives = (text: string) => {
    return [
      { interpretation: "They want to discuss this privately due to sensitivity", likelihood: "Medium" },
      { interpretation: "They need more information before continuing", likelihood: "High" },
      { interpretation: "This is a routine check-in, nothing concerning", likelihood: "High" }
    ];
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
                <div className="flex gap-2">
                  <Button onClick={handleAnalyze} disabled={!inputText.trim() || isAnalyzing} className="flex-1">
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Decode Message
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setInputText("")}>
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
                    {confidence}% confidence
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysis && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Enter a message above to see the AI analysis</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Confidence</span>
                    <span>{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-2" />
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
                const Icon = suggestion.icon;
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