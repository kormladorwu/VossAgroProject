import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Sprout, TrendingUp, Brain, CloudSun, Loader2 } from "lucide-react";

const recommendations = [
  {
    region: "Volta Region",
    crop: "Cassava",
    insight: "Volta soil moisture and temperature favor cassava growth this quarter. Expected yield: +12%.",
    trend: "Stable demand in local and export markets.",
  },
  {
    region: "Ashanti Region",
    crop: "Cocoa",
    insight: "Slight drop in rainfall; adopt irrigation to maintain 2024 production levels.",
    trend: "Global cocoa prices remain strong due to West African shortages.",
  },
  {
    region: "Northern Region",
    crop: "Maize",
    insight: "AI suggests early planting for higher yield due to predicted early rains.",
    trend: "Local poultry feed market demand expected to rise 15%.",
  },
];

export default function AIInsight() {
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getAIInsight = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const rec = recommendations.find((r) => r.region === region);
      setResult(rec || { region, crop: "N/A", insight: "No data available yet.", trend: "Try another region." });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          <Brain className="text-green-600" /> VossAgro AI Insight
        </h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          Export Report
        </Button>
      </header>

      {/* Intro Section */}
      <section className="text-center py-16 bg-green-100">
        <h2 className="text-4xl font-bold text-green-800 mb-4">
          Smart Agriculture Insights Powered by AI
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Get tailored insights for your region and crops — powered by weather data, market trends, and predictive AI models.
        </p>
      </section>

      {/* Insight Form */}
      <section className="p-6 flex flex-col items-center">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-2/3 justify-center items-center">
          <select
            className="border border-green-400 rounded-lg px-4 py-2 bg-white focus:outline-none w-full sm:w-auto"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">Select Region</option>
            <option>Volta Region</option>
            <option>Ashanti Region</option>
            <option>Northern Region</option>
            <option>Eastern Region</option>
            <option>Greater Accra</option>
          </select>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={getAIInsight}
            disabled={!region || loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Brain /> Get Insight
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Result Section */}
      <section className="p-6 flex justify-center">
        {result && (
          <Card className="max-w-xl w-full shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                {result.region || "Region Unknown"}
              </h3>
              <div className="flex justify-center gap-4 text-gray-600 mb-4">
                <Sprout /> <span>{result.crop}</span> <CloudSun />
              </div>
              <p className="text-gray-700 mb-3">{result.insight}</p>
              <div className="flex items-center justify-center text-green-600 font-medium">
                <TrendingUp className="mr-2" /> {result.trend}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center p-6 mt-10">
        <p>© 2025 VossAgro AI Insight — Smarter Farming Decisions with Data 🌾</p>
      </footer>
    </div>
  );
}
