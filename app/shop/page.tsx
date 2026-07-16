"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  Grid,
  Shirt,
  Footprints,
  Watch,
  Link,
  HardHat,
  Gem,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Sections";
import ProductCard from "@/components/shop/ProductCard";
import { productsApi, settingsApi } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";
import { Product } from "@/types";

const IconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Grid,
  Shirt,
  Footprints,
  Watch,
  Link,
  HardHat,
  Gem,
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

export default function ShopPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const { data, isLoading } = useQuery({
    queryKey: ["products-all"],
    queryFn: () => productsApi.getAll({ limit: 200 }),
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.getAll,
  });

  const products: Product[] = data?.data || [];

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, category, search, sort]);

  return (
    <main>
      <Navbar />

      {/* Header */}
      <div
        className="bg-theme-2 pt-[100px] pb-10 px-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-8xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gold text-[0.7rem] tracking-[0.4em] uppercase mb-2">
              Explore
            </p>
            <h1
              className="font-bebas text-theme"
              style={{ fontSize: "clamp(3rem,8vw,6rem)" }}
            >
              The <span className="text-gold">Collection</span>
            </h1>
            <p className="text-theme-2 mt-1">
              Find your perfect piece from the Empire
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-3 flex-wrap items-center">
            <div
              className="relative"
              style={{ minWidth: "220px", maxWidth: "340px", flex: "1" }}
            >
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-3 pointer-events-none"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                style={{
                  paddingLeft: "2.25rem",
                  paddingRight: search ? "2rem" : "0.9rem",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-3 hover:text-theme"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: "auto", minWidth: "180px" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="text-theme-3 text-sm ml-auto">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const Icon = IconMap[cat.icon];
              
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-2"
                  style={{
                    backgroundColor:
                      category === cat.value ? "#C9A84C" : "var(--bg3)",
                    color: category === cat.value ? "#000" : "var(--text2)",
                    border: `1px solid ${category === cat.value ? "#C9A84C" : "var(--border)"}`,
                  }}
                >
                  {Icon && <Icon size={14} />} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[340px] rounded-xl animate-pulse"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-theme-3">
            <span className="text-5xl">🔍</span>
            <p className="font-display text-2xl">No products found</p>
            <button
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
              className="text-gold text-sm underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer whatsapp={settings?.whatsappNumber} />
    </main>
  );
}
