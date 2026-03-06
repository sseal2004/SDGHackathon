# SynchroChain Prototype

This is an AI-powered supply chain optimization prototype built with Next.js, Genkit, and ShadCN.

## Getting Started Locally

1. **Unzip the project** to your local machine.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Ensure your `.env` file contains your Gemini API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open the app**: Navigate to [http://localhost:9002](http://localhost:9002) (or the port specified in your terminal).

## Key Features
- **Digital Twin Sandbox**: Simulate "what-if" scenarios for global disruptions.
- **Dynamic Route Optimization**: AI-driven multi-modal rerouting (Sea/Air/Truck).
- **Autonomous Inventory Rebalancing**: Proactive stock movement to prevent stockouts.
- **Predictive Supplier Risk**: Performance and risk analysis using Gemini.
