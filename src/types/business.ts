export interface Business {
  id: string;
  name: string;
  category: string;
  slug: string;
  description: string;
  acceptsOnsiteBooking: boolean;
  affiliateUrl?: string;
}