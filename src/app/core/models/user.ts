export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  newRole?: string;
  
  [key: string]: string | number | undefined;
}

export interface ProfileDetails {
  firstName: string;
  lastName: string;
  email: string;
}

