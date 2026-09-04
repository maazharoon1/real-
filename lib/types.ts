export type ListingType = "buy" | "sell" | "rent";
export type ListingStatus = "Active" | "Pending" | "Sold";

export type Listing = {
  id: string;
  propertyTitle: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  propertyType: string;
  status: ListingStatus;
  mainImage: string;
  listingType: ListingType;
  sqft?: number;
  description?: string;
  features?: string[];
  amenities?: string[];
  galleryImages?: string[];
  mlsNumber?: string;
  yearBuilt?: number;
  lotSize?: string;
  daysOnMarket?: number;
  county?: string;
  subdivision?: string;
  hoaFees?: string;
  taxes?: string;
  featured?: boolean;
  contactCTA?: string;
  createdAt: string;
  updatedAt: string;
};

export type Inquiry = {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: ListingType;
  message: string;
};
