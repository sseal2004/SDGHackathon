'use server';
/**
 * @fileOverview This file implements a Genkit flow for predicting supplier risk.
 *
 * - predictiveSupplierRiskAnalysis - A function that analyzes supplier data to predict potential delays or inconsistencies.
 * - PredictiveSupplierRiskAnalysisInput - The input type for the predictiveSupplierRiskAnalysis function.
 * - PredictiveSupplierRiskAnalysisOutput - The return type for the predictiveSupplierRiskAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictiveSupplierRiskAnalysisInputSchema = z.object({
  supplierName: z.string().describe('The name of the supplier.'),
  historicalDataSummary: z
    .string()
    .describe(
      'A detailed summary of the supplier\'s past performance, including on-time delivery rates, quality issues, communication responsiveness, and any past disruption impacts.'
    ),
  currentOrdersSummary: z
    .string()
    .describe(
      'Details of current outstanding orders with the supplier, including quantities, requested delivery dates, and current status.'
    ),
  externalContext: z
    .string()
    .describe(
      'Any known external factors that might influence the supplier, such as regional instability, raw material shortages, or economic conditions.'
    ),
});
export type PredictiveSupplierRiskAnalysisInput = z.infer<
  typeof PredictiveSupplierRiskAnalysisInputSchema
>;

const PredictiveSupplierRiskAnalysisOutputSchema = z.object({
  supplierName: z.string().describe('The name of the supplier.'),
  reliabilityForecast: z.object({
    overallScore: z.number().min(0).max(100).describe('An overall reliability score for the supplier (0-100).'),
    riskLevel: z
      .enum(['Low', 'Medium', 'High', 'Critical'])
      .describe('Categorical risk level for the supplier.'),
    summary: z.string().describe('A brief summary of the supplier\'s reliability outlook.'),
  }),
  predictedIssues: z
    .array(
      z.object({
        issueType: z
          .string()
          .describe(
            'The type of predicted issue (e.g., "Delivery Delay", "Quality Compromise", "Capacity Shortage").'
          ),
        likelihood: z
          .enum(['Low', 'Medium', 'High'])
          .describe('The likelihood of this issue occurring.'),
        potentialImpact: z
          .string()
          .describe('A description of the potential impact on the supply chain if this issue occurs.'),
        estimatedDelayDays: z
          .number()
          .optional()
          .describe('If the issue is a delivery delay, the estimated number of days of delay.'),
      })
    )
    .describe('A list of specific predicted issues with details.'),
  actionableInsights: z
    .array(z.string())
    .describe('A list of concrete, actionable steps to mitigate the predicted risks.'),
  aiConfidence: z
    .number()
    .min(0)
    .max(100)
    .describe('The confidence level of the AI\'s prediction (0-100).'),
});
export type PredictiveSupplierRiskAnalysisOutput = z.infer<
  typeof PredictiveSupplierRiskAnalysisOutputSchema
>;

export async function predictiveSupplierRiskAnalysis(
  input: PredictiveSupplierRiskAnalysisInput
): Promise<PredictiveSupplierRiskAnalysisOutput> {
  return predictiveSupplierRiskAnalysisFlow(input);
}

const predictiveSupplierRiskAnalysisPrompt = ai.definePrompt({
  name: 'predictiveSupplierRiskAnalysisPrompt',
  input: {schema: PredictiveSupplierRiskAnalysisInputSchema},
  output: {schema: PredictiveSupplierRiskAnalysisOutputSchema},
  prompt: `You are an AI supply chain analyst. Your task is to analyze the provided supplier data and forecast potential delays or inconsistencies. Based on this analysis, generate a "Supplier Reliability Forecast" with actionable insights.

Analyze the following information for the supplier named: {{{supplierName}}}

Historical Performance Summary:
{{{historicalDataSummary}}}

Current Orders Summary:
{{{currentOrdersSummary}}}

External Context:
{{{externalContext}}}

Provide your analysis in a structured JSON format according to the output schema. Focus on identifying specific risks, their likelihood and potential impact, and offering concrete mitigation strategies.`,
});

const predictiveSupplierRiskAnalysisFlow = ai.defineFlow(
  {
    name: 'predictiveSupplierRiskAnalysisFlow',
    inputSchema: PredictiveSupplierRiskAnalysisInputSchema,
    outputSchema: PredictiveSupplierRiskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await predictiveSupplierRiskAnalysisPrompt(input);
    if (!output) {
      throw new Error('Failed to generate supplier risk analysis.');
    }
    return output;
  }
);
