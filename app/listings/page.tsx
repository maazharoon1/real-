"use client";
import { useEffect, useMemo, useState } from "react";
import { Header, Footer, ListingCard } from "@/components/site";
import { getListings } from "@/lib/listingsStorage";
import type { Listing } from "@/lib/types";

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  useEffect(() => { const timer = window.setTimeout(() => setListings(getListings()), 0); return () => window.clearTimeout(timer); }, []);
  const cities = [...new Set(listings.map((item) => item.city))];
  const filtered = useMemo(() => listings.filter((item) => (type === "all" || item.listingType === type) && (status === "all" || item.status === status) && (city === "all" || item.city === city)), [listings, type, status, city]);
  return <><Header /><main className="page-shell"><div className="page-heading"><h1>Find your next<br /><em>place.</em></h1><p>Browse a considered collection of homes across Dallas–Fort Worth.</p></div><div className="filters"><div><span>Listing type</span>{["all", "buy", "sell", "rent"].map((item) => <button key={item} className={type === item ? "filter active" : "filter"} onClick={() => setType(item)}>{item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}</button>)}</div><div><span>Status</span>{["all", "Active", "Pending", "Sold"].map((item) => <button key={item} className={status === item ? "filter active" : "filter"} onClick={() => setStatus(item)}>{item === "all" ? "All" : item}</button>)}</div><label>City<select value={city} onChange={(event) => setCity(event.target.value)}><option value="all">All cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label></div><p className="result-count">{filtered.length} homes</p><div className="listing-grid listing-grid-page">{filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>{filtered.length === 0 && <div className="empty-state">No listings match those filters.</div>}</main><Footer /></>;
}
