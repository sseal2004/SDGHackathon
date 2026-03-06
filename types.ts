export interface SupplyChainNode {
  id: string;
  name: string;
  type: 'supplier' | 'warehouse' | 'distribution' | 'customer';
  location: string;
  capacity: number;
  currentLoad: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ScenarioParameter {
  id: string;
  name: string;
  description: string;
  type: 'disruption' | 'optimization' | 'constraint';
  value: number | string;
  unit?: string;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'running' | 'completed' | 'failed';
  parameters: ScenarioParameter[];
  supplyChainNodes: SupplyChainNode[];
  simulationResults?: SimulationResult;
}

export interface SimulationResult {
  scenarioId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  status: 'success' | 'failed';
  metrics: {
    totalCost: number;
    deliveryTime: number;
    efficiency: number; // 0-100
    riskScore: number; // 0-100
    customerSatisfaction: number; // 0-100
  };
  timeline: TimelineEvent[];
  nodeMetrics: NodeMetric[];
}

export interface TimelineEvent {
  timestamp: Date;
  type: 'disruption' | 'recovery' | 'optimization' | 'milestone';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface NodeMetric {
  nodeId: string;
  nodeName: string;
  utilizationRate: number; // 0-100
  throughput: number;
  costImpact: number;
  delayTime: number;
}

export interface MetricCard {
  label: string;
  value: number | string;
  unit?: string;
  change?: number; // percentage change
  trend?: 'up' | 'down' | 'stable';
  color?: 'success' | 'warning' | 'error' | 'info';
}
