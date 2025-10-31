import { Link } from "react-router-dom";
import React from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ShoppingBag, Leaf, Truck, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800">
      <header className="flex justify-between items-center p-6 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">VossAgro</h1>
        <nav className="space-x-6 hidden md:flex">
          <Link to="/marketplace" className="hover:text-green-600">Marketplace</Link>
          <Link to="/funding" className="hover:text-green-600">Funding Hub</Link>
          <Link to="/land" className="hover:text-green-600">Land Access</Link>
          <Link to="/ai" className="hover:text-green-600">AI Insight</Link>
        </nav>
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
          Sign In
        </Button>
      </header>

      <section className="text-center py-20 bg-[url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1500&q=80')] bg-cover bg-center text-white">
        <div className="bg-black/40 p-10 rounded-xl inline-block">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Empowering Ghana’s Farmers</h2>
          <p className="text-lg mb-6">Buy and sell foodstuffs anywhere in Ghana — faster, fairer, smarter.</p>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full">
            Order Foodstuffs Now
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-6 p-8" id="features">
        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="text-center p-6">
            <ShoppingBag className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="font-semibold text-xl mb-2">Marketplace</h3>
            <p>Buy or sell farm produce across Ghana with real-time freshness scores.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="text-center p-6">
            <BarChart className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="font-semibold text-xl mb-2">AI Insights</h3>
            <p>Get crop demand forecasts, pricing predictions, and AI-based tips.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="text-center p-6">
            <Truck className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="font-semibold text-xl mb-2">Delivery & Logistics</h3>
            <p>Partner with couriers for seamless nationwide delivery tracking.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition">
          <CardContent className="text-center p-6">
            <Leaf className="mx-auto text-green-600 mb-3" size={40} />
            <h3 className="font-semibold text-xl mb-2">Land Access</h3>
            <p>Find and lease fertile farmland near your preferred region.</p>
          </CardContent>
        </Card>
      </section>

      <section className="text-center py-16 bg-green-100" id="marketplace">
        <h2 className="text-3xl font-bold mb-4 text-green-800">Find Foodstuffs Near You</h2>
        <p className="text-gray-700 mb-6">Select your region to see available farmers and products.</p>
        <div className="flex justify-center space-x-4">
          <select className="border border-green-400 rounded-lg px-4 py-2 focus:outline-none">
            <option>Select Region</option>
            <option>Greater Accra</option>
            <option>Ashanti</option>
            <option>Western</option>
            <option>Northern</option>
            <option>Volta</option>
          </select>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">Search</Button>
        </div>
      </section>

      <footer className="bg-green-900 text-white text-center p-6 mt-10">
        <p>© 2025 VossAgro.com — Connecting Ghana’s Agri Future 🌱</p>
      </footer>
    </div>
  );
}
