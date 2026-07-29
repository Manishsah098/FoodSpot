import food1 from './rice2.jpg';
import food2 from './pizza1.jpg';
import food3 from './noodles1.webp';
import food4 from './drink1.avif';
import food5 from './chicken2.png';
import food6 from './pasta1.avif';
import food7 from './pizza2.jpg';
import food8 from './noodles2.jpg';
import food9 from './rice3.jpg';
import food10 from './pizza2.jpg';
import food11 from './drink2.jpg';
import food12 from './pasta2.jpg';
import food13 from './chicken.avif';
import stripe_logo from './stripe_logo.png';

export const categoryItem = [
  { category_title: "All", icon: "🍽️" },
  { category_title: "Pizza", icon: "🍕" },
  { category_title: "Spaghetti", icon: "🍝" },
  { category_title: "Rice", icon: "🍚" },
  { category_title: "Noodles", icon: "🍜" },
  { category_title: "Chicken", icon: "🍗" },
  { category_title: "Drinks", icon: "🍹" },
];

export const assets = {
  stripe_logo,
};

export const product = [
  {
    _id: "a",
    name: "Special Fried Rice With Chicken",
    description: "Savory basmati fried rice tossed with fresh veggies, herbs, and tender chicken chunks.",
    price: 180,
    rating: 4.8,
    image: food1,
    category: "Rice",
    date: 1716634345448,
  },
  {
    _id: "ab",
    name: "Freshly Baked Pepperoni Pizza",
    description: "Crispy crust topped with rich tomato sauce, melted mozzarella, and savory pepperoni slices.",
    price: 320,
    rating: 4.9,
    image: food2,
    category: "Pizza",
    date: 1716621345448,
  },
  {
    _id: "ac",
    name: "Delicious Stir Fry Veggie Noodles",
    description: "Wok-tossed noodles with bell peppers, spring onions, and signature garlic soy sauce.",
    price: 160,
    rating: 4.6,
    image: food3,
    category: "Noodles",
    date: 1716234545448,
  },
  {
    _id: "ad",
    name: "Tequila Sunrise Mocktail Cocktail",
    description: "Refreshing citrus mocktail layered with grenadine, orange juice, and sparkling soda.",
    price: 120,
    rating: 4.7,
    image: food4,
    category: "Drinks",
    date: 1716621345448,
  },
  {
    _id: "ae",
    name: "Grilled Spicy Boneless Chicken",
    description: "Juicy marinated chicken breasts grilled with secret peri-peri spices and herbs.",
    price: 280,
    rating: 4.9,
    image: food5,
    category: "Chicken",
    date: 1716622345448,
  },
  {
    _id: "af",
    name: "Spaghetti Shrimp Tomato Pasta",
    description: "Al dente Italian pasta cooked in rich garlic tomato cream sauce with succulent king prawns.",
    price: 260,
    rating: 4.8,
    image: food6,
    category: "Spaghetti",
    date: 1716623423448,
  },
  {
    _id: "ag",
    name: "Veggie Supreme Cheese Pizza",
    description: "Loaded with fresh mushrooms, black olives, jalapenos, sweet corn, and double cheese.",
    price: 290,
    rating: 4.7,
    image: food7,
    category: "Pizza",
    date: 1716621542448,
  },
  {
    _id: "ah",
    name: "Mushroom Pepper Peas Noodles",
    description: "Classic Asian street-style noodles with button mushrooms, green peas, and cracked black pepper.",
    price: 175,
    rating: 4.5,
    image: food8,
    category: "Noodles",
    date: 1716622345448,
  },
  {
    _id: "ai",
    name: "Rich Native Seafood Fried Rice",
    description: "Aromatic jasmine rice stir-fried with calamari, shrimp, veggies, and aromatic oils.",
    price: 240,
    rating: 4.8,
    image: food9,
    category: "Rice",
    date: 1716621235448,
  },
  {
    _id: "aj",
    name: "Double Cheese Peppered Pizza",
    description: "Gourmet thin crust pizza bursting with extra mozzarella and spicy red chili pepper sprinkle.",
    price: 310,
    rating: 4.9,
    image: food10,
    category: "Pizza",
    date: 1716622235448,
  },
  {
    _id: "ak",
    name: "Mint Mojito Lemon Cooler",
    description: "Chilled zesty drink infused with crushed fresh mint leaves, lime juice, and soda ice cubes.",
    price: 110,
    rating: 4.6,
    image: food11,
    category: "Drinks",
    date: 1716623345448,
  },
  {
    _id: "al",
    name: "Stir Fried Olive & Basil Pasta",
    description: "Classic Penne pasta tossed in extra virgin olive oil, black olives, cherry tomatoes, and basil.",
    price: 220,
    rating: 4.7,
    image: food12,
    category: "Spaghetti",
    date: 1716624445448,
  },
  {
    _id: "am",
    name: "Crispy Fried Chicken Strips",
    description: "Golden crispy chicken tenders served with house special tangy barbecue dipping sauce.",
    price: 210,
    rating: 4.8,
    image: food13,
    category: "Chicken",
    date: 1716625545448,
  },
];