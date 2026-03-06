'use server';
/**
 * @fileOverview A Genkit flow for simulating "what-if" scenarios within a supply chain digital twin.
 *
 * - digitalTwinScenarioImpact - A function that handles the simulation of supply chain scenarios.
 * - DigitalTwinScenarioInput - The input type for the digitalTwinScenarioImpact function.
 * - DigitalTwinScenarioOutput - The return type for the digitalTwinScenarioImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const DigitalTwinScenarioInputSchema = z.object({
  currentSupplyChainState: z.string().describe(
    "A detailed description of the current supply chain state, including inventory levels, active routes, supplier performance history, current demand forecasts, and operational capacities."
  ),
  scenarioDescription: z.string().describe(
    "A clear description of the 'what-if' scenario to be simulated, e.g., 'Supplier X experiences a 2-week delay on key component Y', 'Demand for Product A increases by 30% next quarter', or 'New logistics route through Port Z is introduced'."
  ),
  skuCriticality: z.record(z.enum(['low', 'medium', 'high'])).optional().describe(
    "An optional map of SKU (Stock Keeping Unit) to its criticality level, indicating its importance for operations."
  ),
  deliveryDeadlines: z.record(z.string().datetime()).optional().describe(
    "An optional map of SKU to its critical delivery deadline in ISO 8601 format."
  ),
  alternativeOptions: z.array(z.string()).optional().describe(
    "An optional list of alternative actions or strategies that could be considered in this scenario, e.g., 'Expedite shipping for critical SKUs', 'Engage backup supplier B'."
  ),
}).describe("Input for simulating a 'what-if' scenario in the supply chain digital twin.");

export type DigitalTwinScenarioInput = z.infer<typeof DigitalTwinScenarioInputSchema>;

// Output Schema
const DigitalTwinScenarioOutputSchema = z.object({
  predictedImpact: z.object({
    riskAssessment: z.string().describe(
      "A comprehensive assessment of predicted risks, including potential bottlenecks, stockout probabilities, and disruption severity, categorized by impact (e.g., 'High risk of stockout for Product A due to supplier delay', 'Medium risk of transportation delays on route B')."
    ),
    costImpact: z.string().describe(
      "A quantified estimation of the financial consequences, such as increased operational costs, penalties for delayed deliveries, or savings from optimized routes. Provide a percentage or estimated monetary value if possible (e.g., 'Estimated 15% increase in logistics costs', '$50,000 in potential penalty fees')."
    ),
    deliveryOutcome: z.string().describe(
      "A summary of the expected impact on delivery times and schedules, specifying which products or shipments might be affected and by how much (e.g., 'Product A deliveries delayed by 5-7 days', 'Overall on-time delivery rate reduced by 10%')."
    ),
  }).describe("The predicted impact of the simulated scenario on various supply chain metrics."),
  recommendations: z.array(z.string()).describe(
    "Actionable recommendations to mitigate negative impacts, leverage opportunities, or optimize the supply chain given the scenario (e.g., 'Divert shipments via alternative route C', 'Initiate emergency order with backup supplier')."
  ),
  visualizationSuggestion: z.string().optional().describe(
    "A suggestion for what type of visualization would best illustrate the scenario's impact (e.g., 'Display an updated route map highlighting congested nodes', 'Show a comparative chart of inventory levels over time')."
  ),
}).describe("Output after simulating a 'what-if' scenario in the supply chain digital twin.");

export type DigitalTwinScenarioOutput = z.infer<typeof DigitalTwinScenarioOutputSchema>;

export async function digitalTwinScenarioImpact(
  input: DigitalTwinScenarioInput
): Promise<DigitalTwinScenarioOutput> {
  return digitalTwinScenarioImpactFlow(input);
}

const digitalTwinScenarioImpactPrompt = ai.definePrompt({
  name: 'digitalTwinScenarioImpactPrompt',
  input: {schema: DigitalTwinScenarioInputSchema},
  output: {schema: DigitalTwinScenarioOutputSchema},
  prompt: `You are an expert supply chain strategist managing a complex global supply chain. Your task is to analyze a "what-if" scenario against the current state of the supply chain, predict its impact on risk, cost, and delivery, and provide actionable recommendations.

Current Supply Chain State:
{{{currentSupplyChainState}}}

What-If Scenario to Simulate:
{{{scenarioDescription}}}

{{#if skuCriticality}}
SKU Criticality:
{{#each skuCriticality}}
- SKU {{ @key }}: {{this}}
{{/each}}
{{/if}}

{{#if deliveryDeadlines}}
Delivery Deadlines:
{{#each deliveryDeadlines}}
- SKU {{ @key }}: {{this}}
{{/each}}
{{/if}}

{{#if alternativeOptions}}
Available Alternative Options:
{{#each alternativeOptions}}
- {{{this}}}
{{/each}}
{{/if}}

Based on the provided information, meticulously analyze the scenario's potential effects.
For the 'predictedImpact', provide a detailed 'riskAssessment', a quantified 'costImpact' (either percentage or monetary value), and a specific 'deliveryOutcome'.
For 'recommendations', suggest concrete steps to mitigate negative effects or capitalize on positive ones, referencing the alternative options if applicable.
Finally, suggest a 'visualizationSuggestion' that would best represent this scenario's impact in a graphical user interface.
`,
});

const digitalTwinScenarioImpactFlow = ai.defineFlow(
  {
    name: 'digitalTwinScenarioImpactFlow',
    inputSchema: DigitalTwinScenarioInputSchema,
    outputSchema: DigitalTwinScenarioOutputSchema,
  },
  async (input) => {
    const {output} = await digitalTwinScenarioImpactPrompt(input);
    if (!output) {
      throw new Error('Failed to generate digital twin scenario impact.');
    }
    return output;
  }
);
