export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  preparationTime: string;
  availability: boolean;
  ingredients: string[];
  spiceLevel: "Mild" | "Medium" | "Hot";
  recommended: boolean;
  rating: number;
}

export interface RestaurantInfo {
  name: string;
  description: string;
  address: string;
  openingHours: string;
  phone: string;
}

export const restaurantInfo: RestaurantInfo = {
  name: "Waitro AI",
  description: "A premium AI-guided restaurant experience blending exquisite dining with effortless voice ordering.",
  address: "88 Marina Boulevard, Lagos, Nigeria",
  openingHours: "Mon-Sun · 11:00 AM - 11:00 PM",
  phone: "+234 810 555 0148",
};

export const menuItems: MenuItem[] = [
 
  {
    id: "jollof-rice",
    name: "Jollof Rice",
    description: "Smoky long-grain rice cooked in a rich, reduced tomato, bell pepper, and onion sauce.",
    price: 15.0,
    category: "Rice",
    image: "/images/food/jollof.png",
    preparationTime: "25 mins",
    availability: true,
    ingredients: ["Long-grain rice", "Tomato paste", "Bell peppers", "Onions", "Spices"],
    spiceLevel: "Medium",
    recommended: true,
    rating: 4.9,
  },
  {
    id: "fufu",
    name: "Egusi Soup & Fufu",
    description: "Thick melon seed soup with leafy greens and palm oil, served with smooth pounded yam.",
    price: 22.0,
    category: "Soups & Swallows",
    image: "/images/food/fufu.png",
    preparationTime: "30 mins",
    availability: true,
    ingredients: ["Ground melon seeds", "Spinach", "Palm oil", "Beef", "Pounded yam"],
    spiceLevel: "Medium",
    recommended: true,
    rating: 4.8,
  },
  {
    id: "beef-suya",
    name: "Beef Suya",
    description: "Thinly sliced grilled beef skewers coated in spicy yaji peanut blend, onions, and cabbage.",
    price: 12.5,
    category: "Grill",
    image: "/images/food/suya.png",
    preparationTime: "15 mins",
    availability: true,
    ingredients: ["Beef", "Yaji spice", "Ground peanuts", "Onions", "Chili pepper"],
    spiceLevel: "Hot",
    recommended: true,
    rating: 4.9,
  },
  {
    id: "dodo-fried-plantain",
    name: "Dodo (Fried Plantain)",
    description: "Sweet ripe plantain slices fried golden brown with crispy edges and soft centers.",
    price: 6.0,
    category: "Sides",
    image: "/images/food/dodo.png",
    preparationTime: "10 mins",
    availability: true,
    ingredients: ["Ripe plantain", "Vegetable oil", "Salt"],
    spiceLevel: "Mild",
    recommended: false,
    rating: 4.7,
  },
  {
    id: "akara-bean-cakes",
    name: "Akara (Bean Cakes)",
    description: "Crispy deep-fried fritters made from seasoned ground black-eyed beans and fresh peppers.",
    price: 8.0,
    category: "Breakfast",
    image: "/images/food/akara.png",
    preparationTime: "12 mins",
    availability: true,
    ingredients: ["Black-eyed beans", "Habanero peppers", "Onions", "Vegetable oil"],
    spiceLevel: "Medium",
    recommended: false,
    rating: 4.6,
  },
];

