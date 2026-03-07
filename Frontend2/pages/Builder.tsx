import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import type { Scenario, ScenarioParameter, SupplyChainNode } from '@/types';
import SupplyChainFlow from '@/components/SupplyChainFlow';

interface Props {
  scenario?: Scenario;
  onSave: (scenario: Scenario) => void;
}

export default function Builder({ scenario, onSave }: Props) {
  const [name, setName] = useState(scenario?.name || '');
  const [description, setDescription] = useState(scenario?.description || '');
  const [parameters, setParameters] = useState<ScenarioParameter[]>(scenario?.parameters || []);
  const [nodes, setNodes] = useState<SupplyChainNode[]>(scenario?.supplyChainNodes || []);
  const [newParamName, setNewParamName] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [newParamType, setNewParamType] = useState<'disruption' | 'optimization' | 'constraint'>('disruption');

  const handleAddParameter = () => {
    if (newParamName && newParamValue) {
      const newParam: ScenarioParameter = {
        id: `param-${Date.now()}`,
        name: newParamName,
        description: '',
        type: newParamType,
        value: isNaN(Number(newParamValue)) ? newParamValue : Number(newParamValue),
        unit: '%',
      };
      setParameters([...parameters, newParam]);
      setNewParamName('');
      setNewParamValue('');
    }
  };

  const handleRemoveParameter = (id: string) => {
    setParameters(parameters.filter(p => p.id !== id));
  };

  const handleSave = () => {
    const newScenario: Scenario = {
      id: scenario?.id || `scenario-${Date.now()}`,
      name,
      description,
      parameters,
      supplyChainNodes: nodes,
      createdAt: scenario?.createdAt || new Date(),
      updatedAt: new Date(),
      status: 'draft',
    };
    onSave(newScenario);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Scenario Builder</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Create and configure supply chain scenarios</p>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Scenario Name</Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Port Disruption - Asia"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the scenario and its impact..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Parameters */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Parameters</h3>
        <div className="space-y-4">
          {/* Parameter List */}
          <div className="space-y-2">
            {parameters.map(param => (
              <div key={param.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{param.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {param.value}
                    {param.unit && ` ${param.unit}`} • {param.type}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveParameter(param.id)}
                  className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Parameter Form */}
          <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Label htmlFor="param-name" className="text-xs">
                  Parameter Name
                </Label>
                <Input
                  id="param-name"
                  value={newParamName}
                  onChange={e => setNewParamName(e.target.value)}
                  placeholder="e.g., Disruption Duration"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="param-value" className="text-xs">
                  Value
                </Label>
                <Input
                  id="param-value"
                  value={newParamValue}
                  onChange={e => setNewParamValue(e.target.value)}
                  placeholder="e.g., 7"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="param-type" className="text-xs">
                  Type
                </Label>
                <select
                  id="param-type"
                  value={newParamType}
                  onChange={e => setNewParamType(e.target.value as any)}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                >
                  <option value="disruption">Disruption</option>
                  <option value="optimization">Optimization</option>
                  <option value="constraint">Constraint</option>
                </select>
              </div>
            </div>
            <Button onClick={handleAddParameter} variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Parameter
            </Button>
          </div>
        </div>
      </Card>

      {/* Supply Chain Nodes */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Supply Chain Network</h3>
        {nodes.length > 0 ? (
          <SupplyChainFlow nodes={nodes} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 dark:border-gray-700 dark:bg-gray-900">
            <p className="text-gray-600 dark:text-gray-400">No supply chain nodes configured</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Add nodes to visualize your supply chain</p>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="flex-1">
          Save Scenario
        </Button>
        <Button variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
}
