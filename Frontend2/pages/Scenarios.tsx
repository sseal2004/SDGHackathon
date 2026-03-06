import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Trash2, Plus } from 'lucide-react';
import type { Scenario } from '@/types';
import { generateMockScenarios, simulateScenario } from '@/lib/simulationEngine';

interface Props {
  onSelectScenario: (scenario: Scenario) => void;
  onViewResults: (scenario: Scenario) => void;
}

export default function Scenarios({ onSelectScenario, onViewResults }: Props) {
  const [scenarios, setScenarios] = useState<Scenario[]>(generateMockScenarios());
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRunScenario = async (scenario: Scenario) => {
    setRunningId(scenario.id);
    
    // Simulate delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = simulateScenario(scenario);
    const updatedScenario: Scenario = {
      ...scenario,
      status: 'completed',
      simulationResults: result,
    };
    
    setScenarios(scenarios.map(s => s.id === scenario.id ? updatedScenario : s));
    setRunningId(null);
    onViewResults(updatedScenario);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Available Scenarios</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Manage and run supply chain disruption scenarios</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Scenario
        </Button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <Card key={scenario.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex-1 space-y-4 p-6">
              {/* Title and Status */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{scenario.name}</h3>
                  <Badge className={getStatusColor(scenario.status)}>{scenario.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{scenario.description}</p>
              </div>

              {/* Parameters */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Parameters</p>
                <div className="space-y-1">
                  {scenario.parameters.slice(0, 3).map(param => (
                    <div key={param.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{param.name}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {param.value}
                        {param.unit && ` ${param.unit}`}
                      </span>
                    </div>
                  ))}
                  {scenario.parameters.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{scenario.parameters.length - 3} more parameters
                    </p>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Created: {scenario.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleRunScenario(scenario)}
                disabled={runningId === scenario.id}
              >
                {runningId === scenario.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectScenario(scenario)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteScenario(scenario.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {scenarios.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-600 dark:text-gray-400">No scenarios available</p>
          <Button className="mt-4" onClick={() => setScenarios(generateMockScenarios())}>
            Load Sample Scenarios
          </Button>
        </div>
      )}
    </div>
  );
}
