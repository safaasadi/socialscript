import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Slider } from "./ui/slider";
import { 
  Mail, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Copy,
  Send,
  RefreshCw,
  Eye,
  Loader2,
  AlertCircle,
  Save,
  MessageSquare
} from "lucide-react";
import { useEmailAnalysis, useKnowledgeActions } from "@/hooks/useApi";
import type { EmailAnalysis } from "@/lib/api";

export function EmailToneAnalyzer() {
  const [originalEmail, setOriginalEmail] = useState("");
  const [revisedEmail, setRevisedEmail] = useState("");
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [toneSliders, setToneSliders] = useState({
    formality: [50],
    directness: [50],
    warmth: [50],
    urgency: [30]
  });

  const { analyzeEmail, generateRevision, loading: isAnalyzing, error: analysisError } = useEmailAnalysis();
  const { saveItem, loading: isSaving } = useKnowledgeActions();

  const handleAnalyze = async () => {
    if (!originalEmail.trim()) return;
    
    try {
      const result = await analyzeEmail(originalEmail);
      setAnalysis(result);
      
      // If the API returns a revised version, use it
      if (result.revisedVersion) {
        setRevisedEmail(result.revisedVersion);
      }
    } catch (error) {
      console.error('Failed to analyze email:', error);
      // Error is handled by the hook
    }
  };

  const handleToneAdjustment = async () => {
    if (!originalEmail.trim()) return;
    
    try {
      const toneAdjustments = {
        formality: toneSliders.formality[0],
        directness: toneSliders.directness[0],
        warmth: toneSliders.warmth[0],
        urgency: toneSliders.urgency[0]
      };
      
      const result = await generateRevision(originalEmail, toneAdjustments);
      setRevisedEmail(result.revisedContent);
      setAnalysis(result.analysis);
    } catch (error) {
      console.error('Failed to generate revision:', error);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysis || !originalEmail) return;
    
    try {
      await saveItem({
        title: `Email Analysis: "${originalEmail.substring(0, 50)}${originalEmail.length > 50 ? '...' : ''}"`,
        type: 'analysis',
        category: 'Email Communication',
        tags: ['email', 'tone-analysis'],
        summary: analysis.overallTone,
        content: JSON.stringify({ original: originalEmail, revised: revisedEmail, analysis }),
        folder: 'saved',
        favorite: false,
        confidence: Math.max(...Object.values(analysis.toneScores))
      });
      
      console.log('Email analysis saved to knowledge base');
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  };

  const handleCopyRevised = () => {
    if (revisedEmail) {
      navigator.clipboard.writeText(revisedEmail);
    }
  };

  const resetForm = () => {
    setOriginalEmail("");
    setRevisedEmail("");
    setAnalysis(null);
    setToneSliders({
      formality: [50],
      directness: [50],
      warmth: [50],
      urgency: [30]
    });
  };

  const ToneIndicator = ({ label, value, color, trend }: { 
    label: string; 
    value: number; 
    color: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
        {trend === 'neutral' && <Minus className="h-3 w-3 text-gray-600" />}
      </div>
      <div className="flex items-center gap-2">
        <Progress value={value} className={`w-16 h-2 ${color}`} />
        <span className="text-xs text-muted-foreground w-8">{value}%</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Email Tone Analyzer</h2>
          <p className="text-muted-foreground">Analyze and improve the tone of your professional emails</p>
        </div>
      </div>

      {/* Error Alert */}
      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Original Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Original Email
            </CardTitle>
            <CardDescription>Paste your email draft to analyze its tone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Subject: Project Update Required

Hi Team,

I need this completed by end of week. As discussed in our last meeting, the deliverables are overdue.

Let me know if there are any blockers.

Thanks"
              value={originalEmail}
              onChange={(e) => setOriginalEmail(e.target.value)}
              className="min-h-[300px] resize-none text-sm"
            />
            
            <div className="flex justify-between items-center">
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
              <div className="flex gap-2">
                <Button onClick={handleAnalyze} disabled={!originalEmail.trim() || isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analyze Tone
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Real-time highlights */}
            {analysis?.highlightedPhrases && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Highlighted Phrases</h4>
                {analysis.highlightedPhrases.map((phrase: any, index: number) => (
                  <div key={index} className="p-2 border rounded text-xs">
                    <div className="flex items-center gap-2">
                      {phrase.severity === 'warning' && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                      {phrase.severity === 'success' && <CheckCircle className="h-3 w-3 text-green-600" />}
                      <span className="font-medium">"{phrase.text}"</span>
                    </div>
                    <p className="text-muted-foreground mt-1">{phrase.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tone Analysis
            </CardTitle>
            <CardDescription>Understand how your email might be perceived</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!analysis && !isAnalyzing && (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Paste an email to see tone analysis</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing email tone...</p>
              </div>
            )}

            {analysis && (
              <>
                {/* Overall Assessment */}
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>{analysis.overallTone}</AlertDescription>
                </Alert>

                {/* Tone Scores */}
                <div className="space-y-2">
                  <h4 className="font-medium">Tone Dimensions</h4>
                  <ToneIndicator label="Formality" value={analysis.toneScores.formality} color="text-blue-600" />
                  <ToneIndicator label="Directness" value={analysis.toneScores.directness} color="text-purple-600" />
                  <ToneIndicator label="Warmth" value={analysis.toneScores.warmth} color="text-orange-600" trend={analysis.toneScores.warmth < 50 ? "down" : "up"} />
                  <ToneIndicator label="Urgency" value={analysis.toneScores.urgency} color="text-red-600" />
                  <ToneIndicator label="Clarity" value={analysis.toneScores.clarity} color="text-green-600" trend="up" />
                </div>

                {/* Tone Adjustment Sliders */}
                <div className="space-y-4">
                  <h4 className="font-medium">Adjust Tone</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm">Formality</label>
                        <span className="text-xs text-muted-foreground">{toneSliders.formality[0]}%</span>
                      </div>
                      <Slider
                        value={toneSliders.formality}
                        onValueChange={(value) => setToneSliders(prev => ({...prev, formality: value}))}
                        max={100}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm">Directness</label>
                        <span className="text-xs text-muted-foreground">{toneSliders.directness[0]}%</span>
                      </div>
                      <Slider
                        value={toneSliders.directness}
                        onValueChange={(value) => setToneSliders(prev => ({...prev, directness: value}))}
                        max={100}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm">Warmth</label>
                        <span className="text-xs text-muted-foreground">{toneSliders.warmth[0]}%</span>
                      </div>
                      <Slider
                        value={toneSliders.warmth}
                        onValueChange={(value) => setToneSliders(prev => ({...prev, warmth: value}))}
                        max={100}
                        step={5}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm">Urgency</label>
                        <span className="text-xs text-muted-foreground">{toneSliders.urgency[0]}%</span>
                      </div>
                      <Slider
                        value={toneSliders.urgency}
                        onValueChange={(value) => setToneSliders(prev => ({...prev, urgency: value}))}
                        max={100}
                        step={5}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleToneAdjustment} 
                    variant="outline" 
                    className="w-full"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Apply Tone Adjustments
                      </>
                    )}
                  </Button>
                </div>

                {/* Insights */}
                <div className="space-y-2">
                  <h4 className="font-medium">Key Insights</h4>
                  {analysis.insights.map((insight: any, index: number) => (
                    <div key={index} className={`p-2 rounded text-sm flex items-start gap-2 ${
                      insight.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                      insight.type === 'success' ? 'bg-green-50 text-green-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {insight.type === 'success' && <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      {insight.type === 'info' && <Eye className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <span>{insight.message}</span>
                    </div>
                  ))}
                </div>

                {/* Save Analysis */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveAnalysis}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Analysis
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revised Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Improved Version
              </div>
              {revisedEmail && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={handleCopyRevised}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
            <CardDescription>AI-enhanced version with improved tone</CardDescription>
          </CardHeader>
          <CardContent>
            {!revisedEmail && !isAnalyzing ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analyze an email to see the improved version</p>
              </div>
            ) : isAnalyzing ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating improved version...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={revisedEmail}
                  onChange={(e) => setRevisedEmail(e.target.value)}
                  className="min-h-[300px] resize-none text-sm"
                />
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Use This Version
                  </Button>
                  <Button variant="outline" onClick={handleCopyRevised}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {analysis && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Improvements Made</h4>
                    <div className="space-y-1">
                      {analysis.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparison Panel */}
      {analysis && revisedEmail && (
        <Card>
          <CardHeader>
            <CardTitle>Before vs After Comparison</CardTitle>
            <CardDescription>See how the improvements changed the tone perception</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-red-600">Original Tone Profile</h4>
                <div className="space-y-2">
                  <ToneIndicator label="Warmth" value={analysis.toneScores.warmth} color="text-red-600" />
                  <ToneIndicator label="Formality" value={analysis.toneScores.formality} color="text-red-600" />
                  <ToneIndicator label="Directness" value={analysis.toneScores.directness} color="text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-green-600">Improved Tone Profile</h4>
                <div className="space-y-2">
                  <ToneIndicator label="Warmth" value={Math.min(analysis.toneScores.warmth + 35, 100)} color="text-green-600" trend="up" />
                  <ToneIndicator label="Collaboration" value={Math.min(analysis.toneScores.directness + 25, 100)} color="text-green-600" trend="up" />
                  <ToneIndicator label="Approachability" value={Math.min(analysis.toneScores.warmth + 45, 100)} color="text-green-600" trend="up" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}