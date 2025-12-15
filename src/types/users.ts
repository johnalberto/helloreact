export interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
    catchPhrase: string; // Agregué esto para que veas que fácil es extender
  };
}