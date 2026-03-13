export interface Reservation {
  reservation_id: string;
  client_id: string;
  client_name: string;
  client_phone?: string;
  date_register: string;
  date_exploit: string;
  deposit: number;
  status: string;
}

export interface Client {
  client_id: string;
  name: string;
  phone?: string;
}

export interface ReservationFormData {
  client_id: string;
  client_phone: string;
  date_exploit: string;
  deposit: string;
  status: string;
}

export interface NewClientFormData {
  name: string;
  phone: string;
}
