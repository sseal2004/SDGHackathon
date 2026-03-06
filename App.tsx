import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Scenarios from './pages/Scenarios';
import Builder from './pages/Builder';
import Results from './pages/Results';
import type { Scenario } from '@/types';
import { BarChart3, Zap, TrendingUp } from 'lucide-react';

function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | undefined>();
  const [resultsScenario, setResultsScenario] = useState<Scenario | undefined>();

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Supply Chain Digital Twin
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Test supply chain scenarios before implementing them in reality
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Tabs defaultValue="scenarios" className="space-y-6">
                {/* Tab Navigation */}
                <div className="rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950">
                  <TabsList className="grid w-full grid-cols-3 gap-1 bg-transparent">
                    <TabsTrigger
                      value="scenarios"
                      className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Scenarios</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="builder"
                      className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400"
                    >
                      <Zap className="h-4 w-4" />
                      <span className="hidden sm:inline">Builder</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="results"
                      className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 dark:data-[state=active]:bg-blue-950 dark:data-[state=active]:text-blue-400"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Results</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <TabsContent value="scenarios" className="space-y-6">
                  <Scenarios
                    onSelectScenario={scenario => {
                      setSelectedScenario(scenario);
                      document.querySelector('[value="builder"]')?.dispatchEvent(new Event('click'));
                    }}
                    onViewResults={scenario => {
                      setResultsScenario(scenario);
                      document.querySelector('[value="results"]')?.dispatchEvent(new Event('click'));
                    }}
                  />
                </TabsContent>

                <TabsContent value="builder" className="space-y-6">
                  <Builder
                    scenario={selectedScenario}
                    onSave={scenario => {
                      setSelectedScenario(undefined);
                      // Show toast notification
                    }}
                  />
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <Results scenario={resultsScenario} />
                </TabsContent>
              </Tabs>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Made with Manus — Supply Chain Intelligence & Optimization Platform
                </p>
              </div>
            </footer>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
