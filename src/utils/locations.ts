export const SUPPORTED_LOCATIONS = [
  { id: "lagos", name: "Lagos", country: "Nigeria" },
  { id: "abuja", name: "Abuja", country: "Nigeria" },
  { id: "portHarcourt", name: "Port Harcourt", country: "Nigeria" },
  { id: " Ibadan", name: "Ibadan", country: "Nigeria" },
  { id: "beninCity", name: "Benin City", country: "Nigeria" },
  { id: "kano", name: "Kano", country: "Nigeria" },
  { id: "accra", name: "Accra", country: "Ghana" }
];

export const getLocationNames = () => SUPPORTED_LOCATIONS.map(l => l.name);
