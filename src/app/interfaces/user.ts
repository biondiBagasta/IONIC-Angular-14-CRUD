export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  jwt?: string;
  full_name: string;
  address: string;
  phone_number: string;
  role: string;
  photo: string;
  created_at: Date;
  last_login: Date;
}
