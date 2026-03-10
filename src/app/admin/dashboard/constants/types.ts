interface Salon {
  salon_id: string;
  name: string;
  site?: string | null;
}

interface Constant {
  const_id: string;
  const_name: string;
  const_value: number;
  repetation: string;
  status: string | null;
  started_at: string;
  salon?: { salon_id: string; name: string } | null;
}

export type { Salon, Constant };