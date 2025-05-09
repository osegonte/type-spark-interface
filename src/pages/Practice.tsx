
import React from "react";
import Header from "@/components/Header";
import SessionManager from "@/components/SessionManager";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { PracticeProvider } from "@/context/PracticeContext";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppContent = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-medium mb-2">Typing Practice</h1>
              <p className="text-muted-foreground mb-6">
                Build typing speed and accuracy while learning valuable content
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
          
          <Separator className="my-6" />
          
          <SessionManager />
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

const Practice = () => {
  return (
    <ThemeProvider>
      <PracticeProvider>
        <AppContent />
      </PracticeProvider>
    </ThemeProvider>
  );
};

export default Practice;
