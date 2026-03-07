'use server';
/**
 * @fileOverview A Genkit flow for dynamically recommending optimized multi-modal reroutes during supply chain disruptions.
 *
 * - dynamicRouteOptimization - A function that handles the rerouting process.
 * - DynamicRouteOptimizationInput - The input type for the dynamicRouteOptimization function.
 * - DynamicRouteOptimizationOutput - The return type for the dynamicRouteOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const RouteSegmentSchema = z.object({
  mode: z.enum(['truck', 'train', 'ship', 'air']).describe('The mode of transport for this segment.'),
  startLocation: z.string().describe('The starting location of this segment.'),
  endLocation: z.string().describe('The ending location of this segment.'),
  estimatedTimeHours: z.number().describe('Estimated time for this segment in hours.'),
  estimatedCost: z.number().describe('Estimated cost for this segment.'),
  estimatedCo2EmissionsKg: z.number().describe('Estimated CO2 emissions for this segment in kg.'),
});

const CurrentRouteSchema = z.object({
  origin: z.string().describe('The overall origin of the shipment.'),
  destination: z.string().describe('The overall destination of the shipment.'),
  segments: z.array(RouteSegmentSchema).describe('An array of segments making up the current route.'),
});

const DisruptionSchema = z.object({
  location: z.string().describe('The location where the disruption occurred.'),
  type: z.string().describe('The type of disruption (e.g., "Road Closure", "Port Strike", "Weather Delay").'),
  impactDescription: z.string().describe('A detailed description of the impact of the disruption.'),
  affectedSegments: z.array(z.number().int().min(0)).describe('Indices of the currentRoute segments that are affected by this disruption.'),
});

const OptimizationCriteriaSchema = z.object({
  costWeight: z.number().min(0).max(1).describe('Weight for minimizing cost (0-1).').default(0.33),
  timeWeight: z.number().min(0).max(1).describe('Weight for minimizing time (0-1).').default(0.33),
  sustainabilityWeight: z.number().min(0).max(1).describe('Weight for minimizing CO2 emissions (0-1).').default(0.34),
}).refine(data => (data.costWeight + data.timeWeight + data.sustainabilityWeight) > 0.99 && (data.costWeight + data.timeWeight + data.sustainabilityWeight) < 1.01, {
  message: 'The sum of costWeight, timeWeight, and sustainabilityWeight must be approximately 1.',
});

const DynamicRouteOptimizationInputSchema = z.object({
  currentRoute: CurrentRouteSchema.describe('Details of the current planned route.'),
  disruption: DisruptionSchema.describe('Details about the disruption impacting the current route.'),
  optimizationCriteria: OptimizationCriteriaSchema.describe('Criteria for optimizing the new route, balancing cost, time, and sustainability.'),
});
export type DynamicRouteOptimizationInput = z.infer<typeof DynamicRouteOptimizationInputSchema>;

// Output Schema
const RecommendedRouteSegmentSchema = RouteSegmentSchema.extend({
  // No additional fields, just reuse the base segment schema for clarity in output
});

const RecommendedRerouteOptionSchema = z.object({
  id: z.string().describe('Unique identifier for this reroute option.'),
  newRoute: z.object({
    origin: z.string().describe('The overall origin of the rerouted shipment.'),
    destination: z.string().describe('The overall destination of the rerouted shipment.'),
    segments: z.array(RecommendedRouteSegmentSchema).describe('An array of segments making up the recommended new route.'),
  }).describe('The detailed new route recommendation.'),
  totalEstimatedTimeHours: z.number().describe('Total estimated time for the recommended new route in hours.'),
  totalEstimatedCost: z.number().describe('Total estimated cost for the recommended new route.'),
  totalEstimatedCo2EmissionsKg: z.number().describe('Total estimated CO2 emissions for the recommended new route in kg.'),
  rationale: z.string().describe('An explanation for why this reroute option is recommended, balancing the specified criteria.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0-1) for this recommendation, where 1 is highly confident.'),
});

const DynamicRouteOptimizationOutputSchema = z.object({
  rerouteOptions: z.array(RecommendedRerouteOptionSchema).describe('A list of recommended reroute options.'),
});
export type DynamicRouteOptimizationOutput = z.infer<typeof DynamicRouteOptimizationOutputSchema>;


const prompt = ai.definePrompt({
  name: 'dynamicRouteOptimizationPrompt',
  input: { schema: DynamicRouteOptimizationInputSchema },
  output: { schema: DynamicRouteOptimizationOutputSchema },
  prompt: `You are an expert logistics coordinator and supply chain optimizer. Your task is to recommend optimized multi-modal reroutes given a current route, a disruption, and specific optimization criteria.

Analyze the provided current route and the details of the disruption. Identify which segments are affected and propose alternative segments or entirely new routes to bypass the disruption.

Evaluate the proposed reroute options based on the following optimization criteria, represented by their weights:
- Cost: {{{optimizationCriteria.costWeight}}}
- Time: {{{optimizationCriteria.timeWeight}}}
- Sustainability (CO2 Emissions): {{{optimizationCriteria.sustainabilityWeight}}}

Prioritize options that best balance these criteria. If multiple good options exist, provide them.

Current Route:
Origin: {{{currentRoute.origin}}}
Destination: {{{currentRoute.destination}}}
Segments:
{{#each currentRoute.segments}}
- Segment {{@index}}: Mode: {{{this.mode}}}, From: {{{this.startLocation}}}, To: {{{this.endLocation}}}, Time: {{{this.estimatedTimeHours}}}h, Cost: $\u007b\u007b\u007bthis.estimatedCost\u007d\u007d\u007d, CO2: {{{this.estimatedCo2EmissionsKg}}}kg
{{/each}}

Disruption Details:
Location: {{{disruption.location}}}
Type: {{{disruption.type}}}
Impact: {{{disruption.impactDescription}}}
Affected Segments (indices of current route segments): {{{JSON.stringify disruption.affectedSegments}}}

Based on this information, recommend one or more optimized reroute options. For each reroute option, provide:
1. A unique 'id'.
2. The complete 'newRoute' including all segments from origin to destination, even unaffected ones.
3. The 'totalEstimatedTimeHours', 'totalEstimatedCost', and 'totalEstimatedCo2EmissionsKg' for the entire new route.
4. A 'rationale' explaining the recommendation based on the optimization criteria.
5. A 'confidenceScore' (0-1) for the recommendation.

Ensure the output adheres strictly to the DynamicRouteOptimizationOutputSchema.
`
});

const dynamicRouteOptimizationFlow = ai.defineFlow(
  {
    name: 'dynamicRouteOptimizationFlow',
    inputSchema: DynamicRouteOptimizationInputSchema,
    outputSchema: DynamicRouteOptimizationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function dynamicRouteOptimization(input: DynamicRouteOptimizationInput): Promise<DynamicRouteOptimizationOutput> {
  return dynamicRouteOptimizationFlow(input);
}
