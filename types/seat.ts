export interface Seat {
  id: number;
  x: number;
  y: number;
  status: "available" | "occupied";
  username?: string;
  topic?: string;
  language?: string;
  message?: string;
  expires_at?: string;
}
