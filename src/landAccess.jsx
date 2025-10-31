import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { MapPin, Home, TreePine, Phone } from "lucide-react";

const landListings = [
  {
    id: 1,
    title: "10 Acres Cassava Farm Land",
    location: "Volta Region",
    price: "₵1,200 / acre",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2e?auto=format&fit=crop&w=800&q=80",
    contact: "+233 24 567 8901",
  },
  {
    id: 2,
    title: "Fertile Cocoa Land for Lease",
    location: "Ashanti Region",
    price: "₵2,000 / acre",
    image:
      "https://images.unsplash.com/photo-1576765608603-1e2a93f3a5f2?auto=format&fit=crop&w=800&q=80",
    contact: "+233 20 432 1123",
  },
  {
    id: 3,
    title: "Irrigated Rice Land",
    location: "Northern Region",
    price: "₵900 / acre",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    contact: "+233 27 876 4550",
  },
  {
    id: 4,
    title: "Organic Vegetable Plot",
    location: "Eastern Region",
    price: "₵1,500 / acre",
    image:
      "https://images.unsplash.com/photo-1617957743038-86e0d6c0f76a?auto=format&fit=crop&w=800&q=80",
    contact: "+233 26 335 0089",
  },
];

export default function LandAccess() {
  const [region, setRegion] = useState("");

  const filteredLands = landListings.filter(
    (land) => region === "" || land.location === region
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">VossAgro Land Access</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          List Your Land
        </Button>
      </header>

      {/* Intro Section */}
      <section className="text-center py-16 bg-green-100">
        <h2 className="text-4xl font-bold text-green-800 mb-4">
          Access Fertile Farmland Across Ghana
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Discover available lands for lease or sale. Choose your region and
          contact landowners directly through VossAgro’s secure system.
        </p>
      </section>

      {/* Filter Section */}
      <section className="p-6 flex justify-center">
        <select
          className="border border-green-400 rounded-lg px-4 py-2 bg-white focus:outline-none"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          <option>Greater Accra</option>
          <option>Volta Region</option>
          <option>Ashanti Region</option>
          <option>Eastern Region</option>
          <option>Northern Region</option>
        </select>
      </section>

      {/* Land Listings */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredLands.length > 0 ? (
          filteredLands.map((land) => (
            <Card key={land.id} className="hover:shadow-xl transition shadow-md">
              <img
                src={land.image}
                alt={land.title}
                className="rounded-t-xl h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{land.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-2 text-green-600" />
                  {land.location}
                </div>
                <p className="text-green-700 font-medium mb-3">{land.price}</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <Phone size={16} className="mr-2" /> {land.contact}
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
                  <Home size={18} /> Request Lease
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No available lands found.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center p-6 mt-10">
        <p>© 2025 VossAgro Land Access — Empowering Farmers with Opportunities 🌿</p>
      </footer>
    </div>
  );
}
