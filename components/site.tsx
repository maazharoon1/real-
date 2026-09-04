"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Listing, ListingType } from "@/lib/types";
import { getListings, saveInquiry } from "@/lib/listingsStorage";

export const heroImage = "https://res.cloudinary.com/z08v8we6/image/upload/v1788477397/karol-hero.jpg";
export const aboutImage = "https://res.cloudinary.com/z08v8we6/image/upload/v1788477397/karol-about.jpg";

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const nav = [["Home", "/"], ["Listings", "/listings"], ["About", "/about"], ["Contact", "/contact"]];
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>KAROL-ANN <span>MOZJESIK</span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <a href="https://www.compass.com/concierge/karol-ann-mozjesik/" target="_blank" rel="noreferrer">Compass Concierge</a>
        </nav>
        <div className="nav-actions">
          <a className="phone" href="tel:+12146936034">214-693-6034</a>
          <Link href="/contact" className="button button-dark nav-cta">WORK WITH KAROL-ANN</Link>
          <button className="menu-button" aria-expanded={open} onClick={() => setOpen(true)}><span>Menu</span><i /></button>
        </div>
      </div>
      <AnimatePresence>
        {open && <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="mobile-menu-top"><Link href="/" className="brand" onClick={() => setOpen(false)}>KAROL-ANN <span>MOZJESIK</span></Link><button onClick={() => setOpen(false)} aria-label="Close menu">Close ×</button></div>
          <motion.nav initial={{ y: 20 }} animate={{ y: 0 }} className="mobile-links">
            {nav.slice(0, 3).map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
            <Link href="/about" onClick={() => setOpen(false)}>About Karol-Ann</Link>
            <a href="https://www.compass.com/concierge/karol-ann-mozjesik/" target="_blank" rel="noreferrer">Compass Concierge</a>
            <a href="tel:+12146936034">Call Karol-Ann</a>
            <Link href="/contact" className="button button-dark" onClick={() => setOpen(false)}>Work With Karol-Ann</Link>
          </motion.nav>
          <div className="mobile-social"><a href="https://www.facebook.com/karolannhomes/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/karolannhomes/" target="_blank" rel="noreferrer">Instagram</a></div>
        </motion.div>}
      </AnimatePresence>
    </header>
  );
}

export function SectionTitle({ title, copy, action }: { title: string; copy?: string; action?: React.ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action}</div>;
}

export function ListingCard({ listing }: { listing: Listing }) {
  return <motion.article className="listing-card" whileHover={{ y: -4 }} transition={{ duration: .25 }}>
    <Link href={`/listing/${listing.id}`} className="listing-image"><Image src={listing.mainImage} alt={listing.propertyTitle} fill sizes="(max-width: 700px) 100vw, 33vw" /><span className={`status status-${listing.status.toLowerCase()}`}>{listing.status}</span></Link>
    <div className="listing-card-body"><div className="listing-card-top"><h3>{listing.propertyTitle}</h3><strong>{formatPrice(listing.price)}</strong></div><p>{listing.address}<br />{listing.city}, {listing.state} {listing.zip}</p><div className="listing-meta"><span>{listing.beds} beds</span><span>{listing.baths} baths</span>{listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}<Link href={`/listing/${listing.id}`}>View home <b>↗</b></Link></div></div>
  </motion.article>;
}

export function formatPrice(price: number) { return `$${price.toLocaleString("en-US")}`; }

export function ListingsPreview() {
  const [listings, setListings] = useState<Listing[]>([]);
  useEffect(() => { const timer = window.setTimeout(() => setListings(getListings().filter((item) => item.featured).slice(0, 3)), 0); return () => window.clearTimeout(timer); }, []);
  return <div className="listing-grid">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div>;
}

const reviews = [
  ["Susie", "Karol-Ann is a pleasure to work with on all fronts. She is extremely professional, detail oriented and beyond knowledgeable. She was a true asset in assisting us with our new home purchase."],
  ["Anna", "Karol-Ann was the best choice we made in our home buying process. She is knowledgeable about the market, dedicated, hard-working, detail oriented, responsive and helpful in all areas of home buying and selling."],
  ["Patricia", "Karol-Ann was a delight to work with. She helped my mom navigate listing and selling the home I grew up in. Communication between all parties was flawless and punctual."],
  ["Lee", "Her experience as both an agent and investor gives her a unique advantage. Her attention to detail, knowledge of the process, and responsiveness was outstanding."],
];

export function Reviews() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];
  return <div className="reviews-wrap"><button className="carousel-arrow" onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)} aria-label="Previous review">←</button><AnimatePresence mode="wait"><motion.blockquote key={index} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .35 }}><p>“{review[1]}”</p><cite>{review[0]} <span>Client review</span></cite></motion.blockquote></AnimatePresence><button className="carousel-arrow" onClick={() => setIndex((index + 1) % reviews.length)} aria-label="Next review">→</button><div className="dots">{reviews.map((_, i) => <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Review ${i + 1}`} />)}</div></div>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [interest, setInterest] = useState<ListingType>("buy");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveInquiry({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), firstName: String(form.get("firstName")), lastName: String(form.get("lastName")), email: String(form.get("email")), phone: String(form.get("phone")), interest, message: String(form.get("message")) });
    setSent(true);
    event.currentTarget.reset();
  }
  if (sent) return <div className="success-box"><h3>Thank you.</h3><p>Karol-Ann will be in touch soon.</p><button className="button button-dark" onClick={() => setSent(false)}>Send another message</button></div>;
  return <form className="contact-form" onSubmit={submit}><div className="form-row"><label>First Name<input name="firstName" required /></label><label>Last Name<input name="lastName" required /></label></div><div className="form-row"><label>Email<input name="email" type="email" required /></label><label>Phone<input name="phone" type="tel" /></label></div><fieldset><legend>I am interested in</legend><div className="choice-row">{(["sell", "buy", "rent"] as ListingType[]).map((value) => <button type="button" key={value} className={interest === value ? "choice active" : "choice"} onClick={() => setInterest(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div></fieldset><label>Message<textarea name="message" rows={4} required /></label><button className="button button-dark" type="submit">SUBMIT <span>↗</span></button></form>;
}

export function Footer() {
  return <footer className="footer"><div><Link href="/" className="brand">KAROL-ANN <span>MOZJESIK</span></Link><p>214-693-6034<br /><a href="mailto:ka.mozjesik@compass.com">ka.mozjesik@compass.com</a></p></div><div><h4>Quick Links</h4><Link href="/">Home</Link><Link href="/listings">Listings</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div><div><h4>Connect</h4><a href="https://www.facebook.com/karolannhomes/" target="_blank" rel="noreferrer">Facebook</a><a href="https://www.instagram.com/karolannhomes/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.compass.com/concierge/karol-ann-mozjesik/" target="_blank" rel="noreferrer">Compass Concierge</a><a href="https://drive.google.com/file/d/1bPJ8gIiu64-sVyQUE7C9D38eb0EVDXNS/view" target="_blank" rel="noreferrer">Privacy Policy</a></div><div className="footer-bottom">© {new Date().getFullYear()} Karol-Ann Mozjesik. All rights reserved.</div></footer>;
}
