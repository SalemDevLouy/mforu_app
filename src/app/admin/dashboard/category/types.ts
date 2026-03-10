interface Category {
  cat_id: string;
  cat_name: string;
}

interface CategoryRate {
  rate_id: string;
  salon_id: string;
  cat_id: string;
  rate: number;
}

interface Salon {
  salon_id: string;
  name: string;
  site: string;
}
export type { Category, CategoryRate, Salon };