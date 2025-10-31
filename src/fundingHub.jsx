import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { PiggyBank, DollarSign, Briefcase, TrendingUp } from "lucide-react";

const fundingPrograms = [
  {
    id: 1,
    name: "AgriStart Microfund",
    amount: "₵5,000 – ₵50,000",
    type: "Small Farmer Loan",
    description:
      "Low-interest loans for smallholder farmers to expand operations and buy improved seedlings.",
  },
  {
    id: 2,
    name: "GreenGrow Investment Scheme",
    amount: "₵20,000 – ₵200,000",
    type: "Equity Investment",
    description:
      "Connects farmers and agritech startups with private investors interested in sustainable agriculture.",
  },
  {
    id: 3,
    name: "Youth in Agro Grant",
    amount: "₵10,000 – ₵80,000",
    type: "Government Grant",
    description:
      "A non-repayable grant program targeting youth-led agribusinesses across Ghana.",
  },
  {
    id: 4,
    name: "AgriWomen Empowerment Fund",
    amount: "₵15,000 – ₵100,000",
    type: "Women-Focused Funding",
    description:
      "Supports women farmers and cooperatives with flexible repayment plans and business training.",
  },
];

export default function FundingHub() {
  const [filter, setFilter] = useState("");

  const filteredFunds = fundingPrograms.filter(
    (fund) => filter === "" || fund.type === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">VossAgro Funding Hub</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          Apply Now
        </Button>
      </header>

      {/* Intro Section */}
      <section className="text-center py-16 bg-green-100">
        <h2 className="text-4xl font-bold text-green-800 mb-4">Empower Your Farm with Funding</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Discover funding programs, grants, and investment opportunities to grow your agribusiness.
          Filter by funding type and apply directly through our trusted partners.
        </p>
      </section>

      {/* Filter Section */}
      <section className="p-6 flex justify-center">
        <select
          className="border border-green-400 rounded-lg px-4 py-2 bg-white focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Funding Types</option>
          <option>Small Farmer Loan</option>
          <option>Equity Investment</option>
          <option>Government Grant</option>
          <option>Women-Focused Funding</option>
        </select>
      </section>

      {/* Funding Programs */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredFunds.map((fund) => (
          <Card key={fund.id} className="shadow-md hover:shadow-xl transition">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-3">
                {fund.type.includes("Loan") ? (
                  <DollarSign className="text-green-600" size={36} />
                ) : fund.type.includes("Investment") ? (
                  <TrendingUp className="text-green-600" size={36} />
                ) : fund.type.includes("Grant") ? (
                  <PiggyBank className="text-green-600" size={36} />
                ) : (
                  <Briefcase className="text-green-600" size={36} />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{fund.name}</h3>
              <p className="text-gray-700 mb-2">{fund.amount}</p>
              <p className="text-sm text-gray-500 mb-4">{fund.description}</p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Apply for Funding
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center p-6 mt-10">
        <p>© 2025 VossAgro Funding Hub — Supporting Ghana’s Agricultural Growth 🌾</p>
      </footer>
    </div>
  );
}
