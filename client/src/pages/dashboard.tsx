import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  TrendingUp, 
  FileText, 
  Hash, 
  AlignLeft, 
  Lightbulb, 
  Download,
  Star,
  AlertTriangle,
  CheckCircle,
  Heading,
  Key,
  Image
} from "lucide-react";

interface SeoAnalysisResult {
  id: number;
  url: string;
  title: string;
  metaDescription: string;
  overallScore: number;
  metrics: {
    titleTag: { score: number; description: string; status: string };
    metaDescription: { score: number; description: string; status: string };
    headingStructure: { score: number; description: string; status: string };
    keywordDensity: { score: number; description: string; status: string };
    contentLength: { score: number; description: string; status: string };
    readabilityScore: number;
    wordCount: number;
    sentences: number;
    topKeywords: Array<{ keyword: string; density: number }>;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
  insights?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState<SeoAnalysisResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setAnalysisResult(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "Your SEO analysis has been completed successfully.",
        });
      } else {
        throw new Error(data.error);
      }
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze URL",
        variant: "destructive",
      });
    }
  });

  const handleAnalyze = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid blog URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
      analyzeMutation.mutate(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'needs-work':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-yellow-500';
      case 'needs-work':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold">SEO Analyzer</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">Dashboard</a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">History</a>
              <a href="#" className="text-foreground/80 hover:text-primary transition-colors font-medium">API Docs</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            AI-Powered SEO Analysis
          </h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Get instant SEO insights for any blog post using advanced AI analysis. Improve your content ranking with actionable recommendations powered by ChatGPT.
          </p>
        </div>

        {/* URL Input Form */}
        <Card className="mb-8 glass-strong border-0">
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-6 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mr-3"></div>
                Enter Blog URL for Analysis
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-base glass border-0 h-12 text-foreground placeholder:text-muted-foreground"
                    disabled={analyzeMutation.isPending}
                  />
                  <p className="text-sm text-muted-foreground mt-3 flex items-center">
                    <Search className="w-4 h-4 mr-2 text-primary" />
                    Paste any blog URL to analyze its SEO performance
                  </p>
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium min-w-[160px] h-12 shadow-lg"
                  size="lg"
                >
                  {analyzeMutation.isPending ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Analyze SEO
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* SEO Score Card */}
              <div className="lg:col-span-1">
                <Card className="glass-strong border-0">
                  <CardContent className="p-8">
                    <h4 className="text-lg font-semibold mb-6 flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      Overall SEO Score
                    </h4>
                    <div className="text-center">
                      <ProgressCircle value={analysisResult.overallScore} className="mb-6">
                        <span className="text-3xl font-bold">
                          {analysisResult.overallScore}
                        </span>
                      </ProgressCircle>
                      <p className="text-lg font-medium mb-3">
                        {analysisResult.overallScore >= 80 ? 'Excellent Performance' :
                         analysisResult.overallScore >= 60 ? 'Good Performance' :
                         analysisResult.overallScore >= 40 ? 'Needs Improvement' :
                         'Poor Performance'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Last analyzed: {new Date(analysisResult.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Metrics */}
              <div className="lg:col-span-2">
                <Card className="glass-strong border-0">
                  <CardContent className="p-8">
                    <h4 className="text-lg font-semibold mb-6 flex items-center">
                      <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                      SEO Metrics Breakdown
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-5 glass rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getStatusColor(analysisResult.metrics.titleTag.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Heading className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Title Tag</p>
                            <p className="text-sm text-muted-foreground">{analysisResult.metrics.titleTag.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{analysisResult.metrics.titleTag.score}</span>
                          <div className="flex items-center justify-end mt-1">
                            {getStatusIcon(analysisResult.metrics.titleTag.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-5 glass rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getStatusColor(analysisResult.metrics.metaDescription.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Meta Description</p>
                            <p className="text-sm text-muted-foreground">{analysisResult.metrics.metaDescription.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{analysisResult.metrics.metaDescription.score}</span>
                          <div className="flex items-center justify-end mt-1">
                            {getStatusIcon(analysisResult.metrics.metaDescription.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-5 glass rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getStatusColor(analysisResult.metrics.headingStructure.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Hash className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Heading Structure</p>
                            <p className="text-sm text-muted-foreground">{analysisResult.metrics.headingStructure.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{analysisResult.metrics.headingStructure.score}</span>
                          <div className="flex items-center justify-end mt-1">
                            {getStatusIcon(analysisResult.metrics.headingStructure.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-5 glass rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getStatusColor(analysisResult.metrics.keywordDensity.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Key className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Keyword Density</p>
                            <p className="text-sm text-muted-foreground">{analysisResult.metrics.keywordDensity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{analysisResult.metrics.keywordDensity.score}</span>
                          <div className="flex items-center justify-end mt-1">
                            {getStatusIcon(analysisResult.metrics.keywordDensity.status)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-5 glass rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${getStatusColor(analysisResult.metrics.contentLength.status)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <AlignLeft className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">Content Length</p>
                            <p className="text-sm text-muted-foreground">{analysisResult.metrics.contentLength.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold">{analysisResult.metrics.contentLength.score}</span>
                          <div className="flex items-center justify-end mt-1">
                            {getStatusIcon(analysisResult.metrics.contentLength.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Recommendations and Content Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* AI Recommendations */}
              <Card className="glass-strong border-0">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">AI Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Powered by ChatGPT</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="glass rounded-xl p-4 border-l-4 border-l-primary">
                        <h5 className="font-semibold mb-2">{rec.title}</h5>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <Badge className={getPriorityBadgeColor(rec.priority)}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Full Report
                  </Button>
                </CardContent>
              </Card>

              {/* Content Analysis */}
              <Card className="glass-strong border-0">
                <CardContent className="p-8">
                  <h4 className="text-lg font-semibold mb-6 flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mr-3"></div>
                    Content Analysis
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Readability Score</span>
                        <span className="text-lg font-bold">
                          {analysisResult.metrics.readabilityScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000" 
                          style={{ width: `${analysisResult.metrics.readabilityScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {analysisResult.metrics.readabilityScore >= 80 ? 'Easy to read' :
                         analysisResult.metrics.readabilityScore >= 60 ? 'Moderately easy' :
                         'Difficult to read'}
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Word Count</span>
                        <span className="text-lg font-bold">{analysisResult.metrics.wordCount} words</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {analysisResult.metrics.wordCount >= 1000 ? 'Optimal for in-depth coverage' :
                         analysisResult.metrics.wordCount >= 500 ? 'Good length' :
                         'Consider adding more content'}
                      </p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Sentences</span>
                        <span className="text-lg font-bold">{analysisResult.metrics.sentences}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Average length: {Math.round(analysisResult.metrics.wordCount / analysisResult.metrics.sentences)} words
                      </p>
                    </div>

                    {analysisResult.metrics.topKeywords && analysisResult.metrics.topKeywords.length > 0 && (
                      <div className="glass rounded-xl p-4">
                        <h5 className="text-sm font-medium mb-3">Top Keywords</h5>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.metrics.topKeywords.slice(0, 5).map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
                              {keyword.keyword} ({keyword.density.toFixed(1)}%)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysisResult.insights && (
                      <div className="glass rounded-xl p-5">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h6 className="font-semibold mb-2">AI Insight</h6>
                            <p className="text-sm text-muted-foreground">{analysisResult.insights}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Optimize More Content?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Continue analyzing your blog posts to improve their SEO performance and search engine rankings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => {
                    setUrl("");
                    setAnalysisResult(null);
                  }}
                >
                  Analyze Another URL
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View History
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold">SEO Analyzer</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                AI-powered SEO analysis tool that helps content creators optimize their blog posts for better search engine rankings.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 SEO Analyzer. All rights reserved. Powered by OpenAI ChatGPT.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
