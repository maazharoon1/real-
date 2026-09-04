"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { deleteListing, getInquiries, seedListings, toggleFeatured, updateListing } from "@/lib/listingsStorage";
import type { Inquiry, Listing, ListingStatus } from "@/lib/types";
import { Header, Footer, formatPrice } from "@/components/site";

const email = "admin@karolannhomes.com";
const password = "KarolAnnDemo2026!";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loginError, setLoginError] = useState("");
  // PROTOTYPE AUTH ONLY. REPLACE WITH REAL SERVER-SIDE AUTH BEFORE PRODUCTION.
  useEffect(() => { const timer = window.setTimeout(() => { setLoggedIn(localStorage.getItem("karol-ann-admin") === "true"); setListings(seedListings()); setInquiries(getInquiries()); }, 0); return () => window.clearTimeout(timer); }, []);
  function login(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get("email") === email && data.get("password") === password) { localStorage.setItem("karol-ann-admin", "true"); setLoggedIn(true); } else setLoginError("Those details do not match the prototype account."); }
  if (!loggedIn) return <><Header /><main className="admin-login"><div><span className="admin-mark">K</span><h1>Admin access</h1><p>Manage your prototype listings and inquiries.</p><form className="contact-form" onSubmit={login}><label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" required /></label>{loginError && <p className="form-error">{loginError}</p>}<button className="button button-dark">LOG IN</button></form><small>Demo: admin@karolannhomes.com / KarolAnnDemo2026!</small></div></main><Footer /></>;
  function logout() { localStorage.removeItem("karol-ann-admin"); setLoggedIn(false); }
  function changeStatus(item: Listing, status: ListingStatus) { const next = updateListing({ ...item, status }); setListings(next); }
  function remove(item: Listing) { if (window.confirm("Delete this listing?")) setListings(deleteListing(item.id)); }
  return <><Header /><main className="admin-shell"><div className="admin-header"><div><p className="admin-kicker">Prototype dashboard</p><h1>Listings</h1></div><button className="button button-light" onClick={logout}>LOG OUT</button></div><div className="admin-stats"><div><span>Total listings</span><b>{listings.length}</b></div><div><span>Featured</span><b>{listings.filter((item) => item.featured).length}</b></div><div><span>Inquiries</span><b>{inquiries.length}</b></div></div><section className="admin-section"><h2>Manage listings</h2><div className="admin-table">{listings.map((item) => <div className="admin-row" key={item.id}><Image src={item.mainImage} alt="" width={90} height={70} /><div><b>{item.propertyTitle}</b><span>{formatPrice(item.price)} · {item.listingType}</span></div><select value={item.status} onChange={(event) => changeStatus(item, event.target.value as ListingStatus)}><option>Active</option><option>Pending</option><option>Sold</option></select><button className="table-action" onClick={() => setListings(toggleFeatured(item.id))}>{item.featured ? "Featured" : "Feature"}</button><button className="table-action danger" onClick={() => remove(item)}>Delete</button></div>)}</div></section><section className="admin-section"><h2>Inquiries</h2>{inquiries.length === 0 ? <p className="muted">No prototype inquiries yet.</p> : <div className="inquiry-list">{inquiries.map((item) => <article key={item.id}><b>{item.firstName} {item.lastName}</b><span>{item.email} · interested in {item.interest}</span><p>{item.message}</p></article>)}</div>}</section></main><Footer /></>;
}
