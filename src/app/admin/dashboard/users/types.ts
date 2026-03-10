interface User {
  user_id: string;
  name: string;
  phone: string | null;
  status: string | null;
  salon_id: string | null;
  role: {
    role_id: string;
    role_name: string;
  } | null;
  salon: {
    salon_id: string;
    name: string;
    site: string;
  } | null;
}

interface Role {
  role_id: string;
  role_name: string;
}

interface Salon {
  salon_id: string;
  site: string;
}

export type { User, Role, Salon };