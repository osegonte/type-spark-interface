
import React from "react";
import Header from "@/components/Header";
import SessionManager from "@/components/SessionManager";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Separator } from "@/components/ui/separator";

const AppContent = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header theme={theme} onThemeChange={setTheme} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-medium mb-2">Typing Study App</h1>
          <p className="text-muted-foreground mb-6">
            Build typing speed and accuracy while learning valuable content
          </p>
          
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

const Index = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default Index;
