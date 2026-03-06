import type { Scenario, SimulationResult, TimelineEvent, NodeMetric, SupplyChainNode } from '@/types';

export function generateMockScenarios(): Scenario[] {
  return [
    {
      id: '1',
      name: 'Port Disruption - Asia',
      description: 'Simulate a major port closure in Shanghai affecting 40% of incoming shipments',
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-05'),
      status: 'completed',
      parameters: [
        { id: 'p1', name: 'Port Closure Duration', description: 'Days', type: 'disruption', value: 7, unit: 'days' },
        { id: 'p2', name: 'Affected Shipments', description: 'Percentage', type: 'disruption', value: 40, unit: '%' },
      ],
      supplyChainNodes: [
        { id: 'n1', name: 'Shanghai Port', type: 'supplier', location: 'Shanghai, China', capacity: 10000, currentLoad: 4000, riskLevel: 'high' },
        { id: 'n2', name: 'LA Distribution', type: 'distribution', location: 'Los Angeles, USA', capacity: 5000, currentLoad: 3500, riskLevel: 'medium' },
        { id: 'n3', name: 'Central Warehouse', type: 'warehouse', location: 'Chicago, USA', capacity: 8000, currentLoad: 6000, riskLevel: 'low' },
      ],
    },
    {
      id: '2',
      name: 'Supplier Bankruptcy',
      description: 'Key supplier goes bankrupt, need to reroute 30% of components',
      createdAt: new Date('2025-02-28'),
      updatedAt: new Date('2025-03-04'),
      status: 'completed',
      parameters: [
        { id: 'p3', name: 'Affected Components', description: 'Percentage', type: 'disruption', value: 30, unit: '%' },
        { id: 'p4', name: 'Lead Time Increase', description: 'Days', type: 'disruption', value: 14, unit: 'days' },
      ],
      supplyChainNodes: [
        { id: 'n4', name: 'Primary Supplier', type: 'supplier', location: 'Vietnam', capacity: 5000, currentLoad: 3000, riskLevel: 'high' },
        { id: 'n5', name: 'Backup Supplier', type: 'supplier', location: 'Thailand', capacity: 3000, currentLoad: 2000, riskLevel: 'medium' },
      ],
    },
    {
      id: '3',
      name: 'Demand Surge',
      description: 'Unexpected 50% increase in customer demand',
      createdAt: new Date('2025-03-02'),
      updatedAt: new Date('2025-03-05'),
      status: 'draft',
      parameters: [
        { id: 'p5', name: 'Demand Increase', description: 'Percentage', type: 'optimization', value: 50, unit: '%' },
      ],
      supplyChainNodes: [],
    },
  ];
}

export function simulateScenario(scenario: Scenario): SimulationResult {
  const startTime = new Date();
  const duration = Math.floor(Math.random() * 3600) + 1800; // 30min to 1 hour
  const endTime = new Date(startTime.getTime() + duration * 1000);

  // Generate realistic metrics based on scenario parameters
  const disruptionSeverity = scenario.parameters.reduce((acc: number, p) => {
    if (p.type === 'disruption') {
      return acc + (typeof p.value === 'number' ? p.value : 0);
    }
    return acc;
  }, 0);

  const baseEfficiency = 85;
  const efficiency = Math.max(40, baseEfficiency - (disruptionSeverity * 0.3));
  const riskScore = Math.min(100, disruptionSeverity * 1.5);

  // Generate timeline events
  const timeline: TimelineEvent[] = generateTimelineEvents(scenario, duration);

  // Generate node metrics
  const nodeMetrics: NodeMetric[] = scenario.supplyChainNodes.map((node: SupplyChainNode) => ({
    nodeId: node.id,
    nodeName: node.name,
    utilizationRate: Math.min(100, (node.currentLoad / node.capacity) * 100 + Math.random() * 20),
    throughput: Math.floor(node.capacity * (efficiency / 100) * (0.8 + Math.random() * 0.4)),
    costImpact: Math.floor(Math.random() * 50000) - 25000,
    delayTime: Math.floor(Math.random() * 48),
  }));

  return {
    scenarioId: scenario.id,
    startTime,
    endTime,
    duration,
    status: 'success',
    metrics: {
      totalCost: 450000 + Math.floor(Math.random() * 200000),
      deliveryTime: 8 + Math.floor(Math.random() * 8),
      efficiency: Math.round(efficiency),
      riskScore: Math.round(riskScore),
      customerSatisfaction: Math.round(Math.max(30, 85 - (riskScore * 0.5))),
    },
    timeline,
    nodeMetrics,
  };
}

function generateTimelineEvents(scenario: Scenario, duration: number): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const eventCount = Math.floor(Math.random() * 4) + 3;

  for (let i = 0; i < eventCount; i++) {
    const timestamp = new Date(Date.now() - (duration * 1000 * (1 - Math.random())));
    const eventTypes = ['disruption', 'recovery', 'optimization', 'milestone'] as const;
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    events.push({
      timestamp,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Event ${i + 1}`,
      description: `Event description for ${type}`,
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    });
  }

  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

export function calculateOptimizationSuggestions(result: SimulationResult): string[] {
  const suggestions: string[] = [];

  if (result.metrics.efficiency < 60) {
    suggestions.push('Consider increasing warehouse capacity to improve throughput');
  }

  if (result.metrics.riskScore > 70) {
    suggestions.push('Diversify supplier base to reduce single-point-of-failure risks');
  }

  if (result.metrics.deliveryTime > 10) {
    suggestions.push('Optimize routing and transportation modes to reduce delivery time');
  }

  if (result.metrics.customerSatisfaction < 50) {
    suggestions.push('Implement buffer stock strategy to improve service levels');
  }

  return suggestions;
}
