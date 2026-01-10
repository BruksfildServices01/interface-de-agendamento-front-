export interface User {
  id: number;
  barbershopId: number;
  name: string;
  email: string;
  phone: string;
  role: string;  // 'owner' ou 'barber'
  createdAt: string;
  updatedAt: string;
}
