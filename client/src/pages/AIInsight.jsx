import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sprout, TrendingUp, Brain, CloudSun, Loader2 } from "lucide-react";
import Layout from "../components/layout/Layout";
import { REGION_NAMES } from "../constants/regions";
import { apiService } from "../api";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function AIInsight() {
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const getAIInsight = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await apiService.getAIInsight(region);
      setResult(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Intro Section */}
      <section className="text-center py-16 bg-green-100">
        <h2 className="text-4xl font-bold text-green-800 mb-4">
          Smart Agriculture Insights Powered by AI
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Get tailored insights for your region and crops. Powered by weather data, market trends, and predictive AI models.
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
            {REGION_NAMES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <Button
            className="flex items-center gap-2"
            onClick={getAIInsight}
            disabled={!region || loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size={20} className="p-0 mr-2" text="" /> Analyzing...
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
        {error && (
          <Card className="max-w-xl w-full shadow-lg hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <p className="text-xl text-red-500">Error: {error.message}</p>
            </CardContent>
          </Card>
        )}
        {result && !error && (
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
    </Layout>
  );
}
