import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, File, Upload, BarChart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Helper function to extract text from files
const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "text/plain") {
    return await file.text();
  } else if (file.type === "application/pdf") {
    // In a real implementation, you would use a PDF parsing library
    return "PDF content extraction would go here. For now, this is placeholder text for the PDF you uploaded.";
  }
  throw new Error("Unsupported file type");
};

const HomeContent = () => {
  const { theme, setTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type === "text/plain" || file.type === "application/pdf") {
        setSelectedFile(file);
        toast({
          title: "File selected",
          description: `Selected: ${file.name}`,
        });
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a .txt or .pdf file",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartSession = async () => {
    try {
      let practiceText = customText;
      
      if (selectedFile && !customText) {
        practiceText = await extractTextFromFile(selectedFile);
      }
      
      if (!practiceText) {
        toast({
          title: "No content",
          description: "Please enter text or upload a file to start practicing",
          variant: "destructive",
        });
        return;
      }
      
      localStorage.setItem("practiceText", practiceText);
      navigate("/practice");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your file or text",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">TypeSpark Study App</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your typing speed and accuracy while learning valuable content
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => navigate("/stats")}
              className="flex items-center gap-2"
            >
              <BarChart className="h-4 w-4" />
              View Stats
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-medium">Upload Learning Material</CardTitle>
                <CardDescription>Upload a text or PDF file to practice with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center transition-colors hover:border-primary/50">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your file here or click to browse
                    </p>
                    <Input 
                      type="file" 
                      className="hidden" 
                      id="file-upload" 
                      accept=".txt,.pdf"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-md">
                      {selectedFile.type === "text/plain" ? (
                        <FileText className="h-5 w-5 text-primary" />
                      ) : (
                        <File className="h-5 w-5 text-primary" />
                      )}
                      <span className="text-sm truncate">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-medium">Custom Text</CardTitle>
                <CardDescription>Paste or type the text you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <textarea
                    className="w-full h-40 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none bg-accent/10"
                    placeholder="Paste or type your practice text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              size="lg" 
              onClick={handleStartSession}
              className="px-8 py-6 rounded-xl text-lg font-medium transition-all hover:scale-105"
            >
              Start Typing Practice
            </Button>
          </div>
          
          <div className="mt-12 p-6 bg-accent/10 rounded-xl">
            <h2 className="text-2xl font-medium mb-4 text-center">Why TypeSpark?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Learn While Typing</h3>
                <p className="text-muted-foreground">Practice with your study materials to improve retention</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">View detailed stats on your typing speed and accuracy</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Build Consistency</h3>
                <p className="text-muted-foreground">Track your daily streaks and practice minutes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-muted-foreground">
            TypeSpark Study Edition - Designed for maximum comfort and learning efficiency
          </p>
        </div>
      </footer>
    </div>
  );
};

const Home = () => {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
};

export default Home;
