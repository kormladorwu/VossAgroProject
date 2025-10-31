import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { ShoppingCart, Search, MapPin } from "lucide-react";

const sampleProducts = [
  {
    id: 1,
    name: "Fresh Cassava",
    price: "₵45 / bag",
    region: "Eastern Region",
    image:
      "https://images.unsplash.com/photo-1623156760934-9779f466b61d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Organic Maize",
    price: "₵60 / sack",
    region: "Ashanti Region",
    image:
      "https://images.unsplash.com/photo-1569058242254-96e4c6d7e6cf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Garden Tomatoes",
    price: "₵25 / crate",
    region: "Greater Accra",
    image:
      "https://images.unsplash.com/photo-1603046891749-88d9f9af8d8e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Premium Yam Tubers",
    price: "₵75 / bag",
    region: "Volta Region",
    image:
      "https://images.unsplash.com/photo-1633435054183-ded5f9cf7b2a?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Marketplace() {
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");

  const filteredProducts = sampleProducts.filter(
    (item) =>
      (region === "" || item.region === region) &&
      (search === "" ||
        item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">VossAgro Marketplace</h1>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          Cart (0)
        </Button>
      </header>

      {/* Filter/Search Section */}
      <section className="p-6 bg-green-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center border border-green-400 rounded-lg px-3 py-2 bg-white w-full md:w-1/3">
          <Search className="text-green-600 mr-2" />
          <input
            type="text"
            placeholder="Search product..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="text-green-600" />
          <select
            className="border border-green-400 rounded-lg px-4 py-2 focus:outline-none bg-white"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">All Regions</option>
            <option>Greater Accra</option>
            <option>Ashanti Region</option>
            <option>Eastern Region</option>
            <option>Volta Region</option>
            <option>Northern Region</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-xl transition shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-t-xl h-48 w-full object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-green-700 font-medium">{product.price}</p>
                <p className="text-gray-500 text-sm mb-4">{product.region}</p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No products found.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white text-center p-6 mt-10">
        <p>© 2025 VossAgro Marketplace — Empowering Ghana’s Farmers 🌾</p>
      </footer>
    </div>
  );
}
