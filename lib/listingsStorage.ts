import { demoListings } from "@/data/demoListings";
import type { Inquiry, Listing } from "./types";

const LISTINGS_KEY = "karol-ann-listings";
const INQUIRIES_KEY = "karol-ann-inquiries";

function browserStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function seedListings(): Listing[] {
  const storage = browserStorage();
  if (!storage) return demoListings;
  const current = storage.getItem(LISTINGS_KEY);
  if (!current) storage.setItem(LISTINGS_KEY, JSON.stringify(demoListings));
  return current ? JSON.parse(current) : demoListings;
}

export function getListings(): Listing[] {
  return seedListings();
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find((listing) => listing.id === id);
}

export function createListing(listing: Listing): Listing[] {
  const listings = [...getListings(), listing];
  browserStorage()?.setItem(LISTINGS_KEY, JSON.stringify(listings));
  return listings;
}

export function updateListing(listing: Listing): Listing[] {
  const listings = getListings().map((item) => (item.id === listing.id ? listing : item));
  browserStorage()?.setItem(LISTINGS_KEY, JSON.stringify(listings));
  return listings;
}

export function deleteListing(id: string): Listing[] {
  const listings = getListings().filter((item) => item.id !== id);
  browserStorage()?.setItem(LISTINGS_KEY, JSON.stringify(listings));
  return listings;
}

export function toggleFeatured(id: string): Listing[] {
  const listings = getListings().map((item) =>
    item.id === id ? { ...item, featured: !item.featured, updatedAt: new Date().toISOString() } : item,
  );
  browserStorage()?.setItem(LISTINGS_KEY, JSON.stringify(listings));
  return listings;
}

export function saveInquiry(inquiry: Inquiry) {
  const storage = browserStorage();
  if (!storage) return;
  const inquiries = JSON.parse(storage.getItem(INQUIRIES_KEY) || "[]") as Inquiry[];
  storage.setItem(INQUIRIES_KEY, JSON.stringify([inquiry, ...inquiries]));
}

export function getInquiries(): Inquiry[] {
  const storage = browserStorage();
  return storage ? (JSON.parse(storage.getItem(INQUIRIES_KEY) || "[]") as Inquiry[]) : [];
}
