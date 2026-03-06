import type { SupplyChainNode } from '@/types';
import { Package, Truck, Warehouse, Building2 } from 'lucide-react';

interface Props {
  nodes: SupplyChainNode[];
}

export default function SupplyChainFlow({ nodes }: Props) {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'supplier':
        return <Building2 className="h-6 w-6" />;
      case 'warehouse':
        return <Warehouse className="h-6 w-6" />;
      case 'distribution':
        return <Truck className="h-6 w-6" />;
      case 'customer':
        return <Package className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800';
      case 'medium':
        return 'bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800';
      case 'low':
        return 'bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800';
      default:
        return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-700 dark:text-red-300';
      case 'medium':
        return 'text-amber-700 dark:text-amber-300';
      case 'low':
        return 'text-green-700 dark:text-green-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">No supply chain nodes configured</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex flex-col items-center">
            {/* Node Card */}
            <div className={`w-full rounded-lg border-2 p-4 ${getRiskColor(node.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full bg-white p-2 dark:bg-gray-800 ${getRiskTextColor(node.riskLevel)}`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{node.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{node.location}</p>
                  </div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Capacity</span>
                  <span className={`font-semibold ${getRiskTextColor(node.riskLevel)}`}>
                    {Math.round((node.currentLoad / node.capacity) * 100)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full transition-all ${
                      node.riskLevel === 'high'
                        ? 'bg-red-500'
                        : node.riskLevel === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${(node.currentLoad / node.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {node.currentLoad.toLocaleString()} / {node.capacity.toLocaleString()} units
                </p>
              </div>

              {/* Risk Badge */}
              <div className="mt-3">
                <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase ${getRiskTextColor(node.riskLevel)}`}>
                  {node.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Connection Line */}
            {index < nodes.length - 1 && (
              <div className="my-2 h-6 w-1 bg-gradient-to-b from-blue-400 to-blue-300 dark:from-blue-500 dark:to-blue-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
