'use server';
/**
 * @fileOverview An AI agent that autonomously generates proactive inventory rebalancing plans.
 *
 * - autonomousInventoryRebalancing - A function that handles the inventory rebalancing process.
 * - AutonomousInventoryRebalancingInput - The input type for the autonomousInventoryRebalancing function.
 * - AutonomousInventoryRebalancingOutput - The return type for the autonomousInventoryRebalancing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AutonomousInventoryRebalancingInputSchema = z.object({
  currentInventory: z.array(
    z.object({
      warehouseId: z.string().describe('The ID of the warehouse.'),
      sku: z.string().describe('The Stock Keeping Unit identifier.'),
      quantity: z.number().describe('Current quantity of the SKU in the warehouse.'),
    })
  ).describe('Current inventory levels across all warehouses.'),
  predictedDemand: z.array(
    z.object({
      sku: z.string().describe('The Stock Keeping Unit identifier.'),
      location: z.string().describe('The location (e.g., warehouseId, region) where demand is predicted.'),
      period: z.string().describe('The time period for which demand is predicted (e.g., "next_week", "next_month").'),
      demandQuantity: z.number().describe('The predicted quantity demanded for the SKU.'),
    })
  ).describe('Predicted demand spikes for various SKUs and locations over time.'),
  potentialDelays: z.array(
    z.object({
      sku: z.string().describe('The Stock Keeping Unit identifier.'),
      originWarehouseId: z.string().optional().describe('The ID of the warehouse where a delay might originate.'),
      destinationWarehouseId: z.string().optional().describe('The ID of the warehouse whose inbound supply might be impacted.'),
      delayDays: z.number().describe('The predicted duration of the delay in days.'),
      impactProbability: z.number().min(0).max(1).describe('The probability (0-1) of this delay occurring.'),
      notes: z.string().optional().describe('Additional notes about the potential delay.'),
    })
  ).describe('Information about potential supply chain delays.'),
  warehouseDetails: z.array(
    z.object({
      warehouseId: z.string().describe('The unique ID of the warehouse.'),
      location: z.string().describe('Geographical location of the warehouse.'),
      capacity: z.number().describe('Total storage capacity of the warehouse.'),
      availableCapacity: z.number().describe('Currently available storage capacity in the warehouse.'),
    })
  ).describe('Details about each warehouse including capacity.'),
});
export type AutonomousInventoryRebalancingInput = z.infer<typeof AutonomousInventoryRebalancingInputSchema>;

const AutonomousInventoryRebalancingOutputSchema = z.object({
  rebalancingPlan: z.array(
    z.object({
      sku: z.string().describe('The Stock Keeping Unit identifier.'),
      fromWarehouseId: z.string().describe('The ID of the warehouse from which stock should be moved.'),
      toWarehouseId: z.string().describe('The ID of the warehouse to which stock should be moved.'),
      quantityToMove: z.number().describe('The quantity of the SKU to be moved.'),
      reason: z.string().describe('The reason for this specific rebalancing move (e.g., "prevent stockout at X due to demand spike Y").'),
    })
  ).describe('A detailed plan for reallocating inventory between warehouses.'),
  summary: z.string().describe('An overall summary of the inventory rebalancing plan and its objectives.'),
  potentialImpact: z.object({
    preventedStockouts: z.array(z.string()).describe('List of SKUs and locations where stockouts were prevented.'),
    preventedOverstocking: z.array(z.string()).describe('List of SKUs and locations where overstocking was prevented.'),
    estimatedCostSavings: z.number().optional().describe('Estimated cost savings in currency due to this rebalancing.'),
  }).describe('Quantifiable impact of the rebalancing plan.'),
});
export type AutonomousInventoryRebalancingOutput = z.infer<typeof AutonomousInventoryRebalancingOutputSchema>;

export async function autonomousInventoryRebalancing(
  input: AutonomousInventoryRebalancingInput
): Promise<AutonomousInventoryRebalancingOutput> {
  return autonomousInventoryRebalancingFlow(input);
}

const rebalancingPrompt = ai.definePrompt({
  name: 'autonomousInventoryRebalancingPrompt',
  input: { schema: AutonomousInventoryRebalancingInputSchema },
  output: { schema: AutonomousInventoryRebalancingOutputSchema },
  prompt: `You are an expert autonomous inventory manager for a large supply chain network.
Your goal is to create an optimal inventory rebalancing plan across warehouses to proactively prevent stockouts and overstocking, given current conditions, predicted demand, and potential delays.

Analyze the following data carefully:

Current Inventory:
{{currentInventory}}

Predicted Demand:
{{predictedDemand}}

Potential Delays:
{{potentialDelays}}

Warehouse Details:
{{warehouseDetails}}

Based on this information, generate a comprehensive rebalancing plan. For each move, clearly state the SKU, the source warehouse, the destination warehouse, the quantity, and a concise reason. Provide an overall summary and quantify the potential impact (e.g., prevented stockouts/overstocking, estimated cost savings if calculable).

Consider the following principles:
- Prioritize critical SKUs and locations with high predicted demand spikes.
- Mitigate risks from potential delays by pre-emptively moving stock.
- Avoid overstocking warehouses beyond their capacity or predicted needs.
- Aim for efficiency and cost-effectiveness in movements.
- Ensure the plan is actionable and clearly justified.
- Every SKU in a 'fromWarehouseId' must exist in 'currentInventory' and have sufficient quantity.
- The 'toWarehouseId' must have enough 'availableCapacity' after the move.
- Ensure the plan makes logical sense given demand and delays.`,
});

const autonomousInventoryRebalancingFlow = ai.defineFlow(
  {
    name: 'autonomousInventoryRebalancingFlow',
    inputSchema: AutonomousInventoryRebalancingInputSchema,
    outputSchema: AutonomousInventoryRebalancingOutputSchema,
  },
  async (input) => {
    const { output } = await rebalancingPrompt(input);
    return output!;
  }
);