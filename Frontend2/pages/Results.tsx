import { useState } from "react";

import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { Scenario } from "../types";
import MetricCard from "@/components/MetricCard";
import { calculateOptimizationSuggestions } from "../lib/simulationEngine";

import { AlertCircle, TrendingUp, Clock, DollarSign } from "lucide-react";
interface Props {
  scenario?: Scenario;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Results({ scenario }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (!scenario || !scenario.simulationResults) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-900">
        <AlertCircle className="h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">No simulation results available</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Run a scenario to see results</p>
      </div>
    );
  }

  const result = scenario.simulationResults;
  const suggestions = calculateOptimizationSuggestions(result);

  // Prepare chart data
  const timelineData = result.timeline.map((event, index) => ({
    time: `${index + 1}`,
    title: event.title,
    severity: event.severity,
  }));

  const nodeData = result.nodeMetrics.map(metric => ({
    name: metric.nodeName.substring(0, 10),
    utilization: metric.utilizationRate,
    throughput: metric.throughput / 100,
  }));

  const metricsData = [
    { name: 'Efficiency', value: result.metrics.efficiency },
    { name: 'Risk', value: result.metrics.riskScore },
    { name: 'Satisfaction', value: result.metrics.customerSatisfaction },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{scenario.name}</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Simulation Results & Analysis</p>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">Completed</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          metric={{
            label: 'Total Cost',
            value: `$${(result.metrics.totalCost / 1000).toFixed(1)}K`,
            color: 'info',
            trend: 'down',
            change: -12,
          }}
        />
        <MetricCard
          metric={{
            label: 'Delivery Time',
            value: result.metrics.deliveryTime,
            unit: 'days',
            color: 'warning',
            trend: 'up',
            change: 5,
          }}
        />
        <MetricCard
          metric={{
            label: 'Efficiency',
            value: result.metrics.efficiency,
            unit: '%',
            color: result.metrics.efficiency > 80 ? 'success' : 'warning',
            trend: 'up',
            change: 8,
          }}
        />
        <MetricCard
          metric={{
            label: 'Risk Score',
            value: result.metrics.riskScore,
            unit: '/100',
            color: result.metrics.riskScore > 60 ? 'error' : 'success',
            trend: 'down',
            change: -15,
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Node Utilization */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Node Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nodeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Legend />
              <Bar dataKey="utilization" fill="#3B82F6" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Metrics Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metricsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {metricsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Simulation Timeline</h3>
        <div className="space-y-3">
          {result.timeline.map((event, index) => (
            <div key={index} className="flex gap-4 border-l-2 border-blue-400 pl-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-blue-400" />
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
                  <Badge
                    className={
                      event.severity === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        : event.severity === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                    }
                  >
                    {event.severity}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{event.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Suggestions */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Optimization Suggestions</h3>
        <div className="space-y-3">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                <TrendingUp className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-900 dark:text-blue-100">{suggestion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No optimization suggestions at this time</p>
          )}
        </div>
      </Card>

      {/* Simulation Metadata */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Simulation Details</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {Math.floor(result.duration / 60)}m {result.duration % 60}s
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Cost</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                ${(result.metrics.totalCost / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Events</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{result.timeline.length}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
