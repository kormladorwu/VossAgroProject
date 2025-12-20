// Ghana's 16 Regions AI Insights Controller
// Returns agricultural insights based on region selection

const recommendations = [
  {
    region: "Greater Accra",
    crop: "Vegetables",
    insight: "Urban demand for fresh vegetables is high. Focus on leafy greens and tomatoes for quick turnover.",
    trend: "Strong market prices due to proximity to urban centers.",
  },
  {
    region: "Central Region",
    crop: "Cassava",
    insight: "Excellent conditions for root crops and palm oil production. Consider cassava processing for added value.",
    trend: "Growing demand for cassava in local and export markets.",
  },
  {
    region: "Western Region",
    crop: "Cocoa",
    insight: "Prime cocoa belt. Heavy rainfall supports tree crops year-round. Maintain sustainable farming practices.",
    trend: "Global cocoa prices remain strong due to West African demand.",
  },
  {
    region: "Western North Region",
    crop: "Cocoa",
    insight: "New region with untapped agricultural potential. Focus on cocoa and tree crops for long-term returns.",
    trend: "Increasing investment in cocoa farming infrastructure.",
  },
  {
    region: "Volta Region",
    crop: "Rice",
    insight: "Volta soil moisture and temperature favor rice and cassava. Expected yield increase of 12% this quarter.",
    trend: "Stable demand in local markets with export potential.",
  },
  {
    region: "Oti Region",
    crop: "Yam",
    insight: "Fertile lands for root crops. Consider yam cultivation for high returns during harvest season.",
    trend: "Growing local demand for yam across Ghana.",
  },
  {
    region: "Eastern Region",
    crop: "Oil Palm",
    insight: "Good rainfall expected. Optimal conditions for cocoa and oil palm. Consider expanding cultivation.",
    trend: "Consistent local demand with potential for regional export.",
  },
  {
    region: "Ashanti Region",
    crop: "Cocoa",
    insight: "Major cocoa belt. Slight drop in rainfall expected; adopt irrigation to maintain production levels.",
    trend: "Global cocoa prices remain strong due to West African shortages.",
  },
  {
    region: "Bono Region",
    crop: "Cashew",
    insight: "Excellent conditions for cashew and cocoa. Major cashew production hub with growing export market.",
    trend: "Cashew exports growing rapidly with strong international demand.",
  },
  {
    region: "Bono East Region",
    crop: "Cashew",
    insight: "Accounts for about 90% of Ghana's cashew production. Focus on quality processing for premium prices.",
    trend: "High-value cashew market with strong export potential to Asia.",
  },
  {
    region: "Ahafo Region",
    crop: "Cocoa",
    insight: "Fertile forest zone ideal for cocoa and cashew cultivation. Consider intercropping for diversification.",
    trend: "Cocoa and cashew prices remain favorable for farmers.",
  },
  {
    region: "Northern Region",
    crop: "Maize",
    insight: "AI suggests early planting for higher yield due to predicted early rains this season.",
    trend: "Local poultry feed market demand expected to rise 15%.",
  },
  {
    region: "Savannah Region",
    crop: "Yam",
    insight: "Major yam production zone. Focus on irrigation for dry season farming to maximize yields.",
    trend: "Yam demand stable across Ghana with export opportunities.",
  },
  {
    region: "North East Region",
    crop: "Millet",
    insight: "Suitable for grains and livestock. Consider mixed farming approaches for income stability.",
    trend: "Growing demand for millet and sorghum in local markets.",
  },
  {
    region: "Upper East Region",
    crop: "Tomatoes",
    insight: "Excellent for vegetables and grains. Strong irrigation potential from dams supports year-round farming.",
    trend: "High demand for tomatoes and onions in urban markets.",
  },
  {
    region: "Upper West Region",
    crop: "Shea Nuts",
    insight: "Ghana's second-largest yam producer. Shea butter in high demand for cosmetics industry.",
    trend: "Increasing demand for shea butter in developed countries.",
  },
];

exports.getAIInsight = async (req, res) => {
  const { region } = req.query;

  // Simulate a delay for AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!region) {
    return res.status(400).json({ message: 'Region query parameter is required.' });
  }

  const insight = recommendations.find(rec => rec.region === region);

  if (insight) {
    res.json(insight);
  } else {
    res.status(404).json({ message: 'No AI insight available for this region yet.' });
  }
};
