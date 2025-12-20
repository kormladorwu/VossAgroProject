// Ghana's 16 Regions with Agricultural Data
// Based on research from mofa.gov.gh, gipc.gov.gh, and FAO

export const GHANA_REGIONS = [
    {
        name: "Greater Accra",
        zone: "Coastal",
        crops: ["Vegetables", "Maize", "Rice", "Cassava"],
        insight: "Urban demand for fresh vegetables is high. Focus on leafy greens and tomatoes for quick turnover.",
        trend: "Strong market prices due to proximity to urban centers.",
        specialty: "Urban farming, leafy greens"
    },
    {
        name: "Central Region",
        zone: "Coastal",
        crops: ["Cassava", "Maize", "Rice", "Coconut", "Oil Palm"],
        insight: "Excellent conditions for root crops and palm oil production. Fishing also significant.",
        trend: "Growing demand for cassava processing.",
        specialty: "Fishing, palm oil"
    },
    {
        name: "Western Region",
        zone: "Forest",
        crops: ["Cocoa", "Rubber", "Oil Palm", "Coconut", "Plantain"],
        insight: "Prime cocoa belt. Heavy rainfall supports tree crops year-round.",
        trend: "Global cocoa prices remain strong.",
        specialty: "Cocoa production"
    },
    {
        name: "Western North Region",
        zone: "Forest",
        crops: ["Cocoa", "Oil Palm", "Plantain", "Cassava"],
        insight: "New region with untapped agricultural potential. Focus on cocoa and tree crops.",
        trend: "Increasing investment in cocoa farming.",
        specialty: "Tree crops"
    },
    {
        name: "Volta Region",
        zone: "Mixed",
        crops: ["Rice", "Cassava", "Maize", "Cocoa", "Vegetables"],
        insight: "Volta soil moisture and temperature favor cassava and rice. Strong rice production potential.",
        trend: "Stable demand in local and export markets.",
        specialty: "Rice paddies"
    },
    {
        name: "Oti Region",
        zone: "Mixed",
        crops: ["Yam", "Cassava", "Maize", "Sorghum"],
        insight: "Fertile lands for root crops. Consider yam cultivation for high returns.",
        trend: "Growing local demand for yam.",
        specialty: "Root crops"
    },
    {
        name: "Eastern Region",
        zone: "Forest",
        crops: ["Cocoa", "Oil Palm", "Cassava", "Plantain", "Citrus"],
        insight: "Good rainfall expected. Optimal conditions for cocoa and oil palm. Consider expanding cultivation.",
        trend: "Consistent local demand, potential for regional export.",
        specialty: "Cocoa, palm oil"
    },
    {
        name: "Ashanti Region",
        zone: "Forest",
        crops: ["Cocoa", "Plantain", "Cassava", "Yam", "Vegetables"],
        insight: "Major cocoa belt. Slight drop in rainfall; adopt irrigation to maintain production levels.",
        trend: "Global cocoa prices remain strong due to West African shortages.",
        specialty: "Cocoa belt, yam"
    },
    {
        name: "Bono Region",
        zone: "Forest",
        crops: ["Cocoa", "Cashew", "Maize", "Yam"],
        insight: "Excellent conditions for cashew and cocoa. Major cashew production hub.",
        trend: "Cashew exports growing rapidly.",
        specialty: "Cashew capital"
    },
    {
        name: "Bono East Region",
        zone: "Forest",
        crops: ["Cashew", "Cocoa", "Yam", "Maize"],
        insight: "Accounts for about 90% of Ghana's cashew production and exports.",
        trend: "High-value cashew market with strong export potential.",
        specialty: "90% cashew exports"
    },
    {
        name: "Ahafo Region",
        zone: "Forest",
        crops: ["Cocoa", "Cashew", "Maize", "Plantain"],
        insight: "Fertile forest zone ideal for cocoa and cashew cultivation.",
        trend: "Cocoa and cashew prices remain favorable.",
        specialty: "Cocoa, cashew"
    },
    {
        name: "Northern Region",
        zone: "Savannah",
        crops: ["Rice", "Maize", "Yam", "Mango", "Shea Nuts"],
        insight: "AI suggests early planting for higher yield due to predicted early rains.",
        trend: "Local poultry feed market demand expected to rise 15%.",
        specialty: "Grains, shea nuts"
    },
    {
        name: "Savannah Region",
        zone: "Savannah",
        crops: ["Yam", "Millet", "Sorghum", "Groundnuts"],
        insight: "Major yam production zone. Focus on irrigation for dry season farming.",
        trend: "Yam demand stable across Ghana.",
        specialty: "Yam production"
    },
    {
        name: "North East Region",
        zone: "Savannah",
        crops: ["Millet", "Sorghum", "Groundnuts", "Rice"],
        insight: "Suitable for grains and livestock. Consider mixed farming approaches.",
        trend: "Growing demand for millet and sorghum.",
        specialty: "Livestock, grains"
    },
    {
        name: "Upper East Region",
        zone: "Savannah",
        crops: ["Rice", "Millet", "Tomatoes", "Onions", "Pepper"],
        insight: "Excellent for vegetables and grains. Strong irrigation potential from dams.",
        trend: "High demand for tomatoes and onions in urban markets.",
        specialty: "Vegetables, grains"
    },
    {
        name: "Upper West Region",
        zone: "Savannah",
        crops: ["Yam", "Maize", "Shea Nuts", "Groundnuts"],
        insight: "Ghana's second-largest yam producer. Shea butter in high demand internationally.",
        trend: "Increasing demand for shea butter in developed countries.",
        specialty: "Shea butter, yams"
    }
];

// Get just region names for dropdowns
export const REGION_NAMES = GHANA_REGIONS.map(r => r.name);

// Get region by name
export const getRegionByName = (name) =>
    GHANA_REGIONS.find(r => r.name === name);

// Get regions by zone
export const getRegionsByZone = (zone) =>
    GHANA_REGIONS.filter(r => r.zone === zone);

export const regions = GHANA_REGIONS;
