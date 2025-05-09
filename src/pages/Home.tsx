
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, FilePdf, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Helper function to extract text from files
const extractTextFromFile = async (file: File): Promise<string> => {
  if (file.type === "text/plain") {
    return await file.text();
  } else if (file.type === "application/pdf") {
    // In a real implementation, you would use a PDF parsing library
    // This is a placeholder that would need to be replaced with actual PDF parsing
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
      
      // Check if the file type is supported
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
      
      // Here we would normally store the text in state or context
      // For this example, we'll use localStorage as a simple solution
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium mb-2">TypeSpark Study App</h1>
          <p className="text-muted-foreground mb-6">
            Build typing speed and accuracy while learning valuable content
          </p>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Learning Material</CardTitle>
                <CardDescription>Upload a text or PDF file to practice with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
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
                      className="mt-2"
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  
                  {selectedFile && (
                    <div className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                      {selectedFile.type === "text/plain" ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <FilePdf className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="text-sm truncate">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Text</CardTitle>
                <CardDescription>Paste or type the text you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <textarea
                    className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none bg-muted/30"
                    placeholder="Paste or type your practice text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 text-center">
            <Button size="lg" onClick={handleStartSession}>
              Start Typing Practice
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-center text-muted-foreground">
            Designed for maximum comfort and learning efficiency
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
