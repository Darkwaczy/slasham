const now = new Date();
const in3Days = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in10Days = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in1Day = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

export const deals = [
  { 
    id: 1, 
    title: "Iya Basira's Kitchen", 
    location: "Wuse 2, Abuja", 
    price: "₦1,500", 
    original: "₦5,000", 
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80", 
    category: "Food", 
    tag: "Selling Fast",
    description: "Experience the best local delicacies in Abuja. Get 30% off your total bill when you spend above ₦15,000. Perfect for a weekend hangout with friends or family.",
    validity: "Expires 14 days after purchase.",
    expiryDate: in3Days
  },
  { 
    id: 2, 
    title: "Oasis Wellness Spa", 
    location: "Lekki Phase 1, Lagos", 
    price: "₦3,000", 
    original: "₦15,000", 
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", 
    category: "Beauty", 
    tag: "50% Off",
    description: "Full body massage + complimentary facial. Unwind and relax in a serene environment with professional therapists and premium oils.",
    validity: "Valid on weekdays only. Expires 30 days after purchase.",
    expiryDate: in1Day
  },
  { 
    id: 3, 
    title: "Skyline Lounge", 
    location: "Maitama, Abuja", 
    price: "₦2,000", 
    original: "₦8,000", 
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80", 
    category: "Nightlife", 
    tag: "BOGO",
    description: "Buy 1 cocktail pitcher, get 1 free shisha pot. Enjoy the stunning city views, premium spirits, and the best chill house music.",
    validity: "Valid on Fridays and Saturdays. Expires 7 days after purchase.",
    expiryDate: in10Days
  },
  { 
    id: 4, 
    title: "Lagos Lagoon Cruise", 
    location: "Victoria Island, Lagos", 
    price: "₦5,000", 
    original: "₦25,000", 
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", 
    category: "Events", 
    tag: "Weekend Special",
    description: "2-hour sunset cruise for two with complimentary drinks. A perfect romantic getaway or relaxing evening for you and your partner.",
    validity: "Requires 48-hour advance booking. Expires 60 days after purchase.",
    expiryDate: in3Days
  },
  { 
    id: 5, 
    title: "The Suya Spot", 
    location: "Garki, Abuja", 
    price: "₦1,000", 
    original: "₦3,500", 
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80", 
    category: "Food", 
    tag: "New",
    description: "Get a massive platter of assorted suya with a free drink. The best spicy meat in town seasoned with authentic yaji spice.",
    validity: "Valid for dine-in or takeout. Expires 14 days after purchase."
  },
  { 
    id: 6, 
    title: "Glow Up Studio", 
    location: "Ikeja, Lagos", 
    price: "₦2,500", 
    original: "₦10,000", 
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80", 
    category: "Beauty", 
    tag: "Trending",
    description: "Complete makeover session including makeup and gele tying for your next owambe. Includes lashes and contouring.",
    validity: "Booking required. Expires 30 days after purchase."
  },
  { 
    id: 7, 
    title: "Afrobeat Live", 
    location: "Eko Hotel, Lagos", 
    price: "₦4,000", 
    original: "₦12,000", 
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80", 
    category: "Events", 
    tag: "VIP Access",
    description: "VIP ticket to the biggest Afrobeat concert of the month. Includes backstage access and free champagne on arrival.",
    validity: "Valid only on the event date."
  },
  { 
    id: 8, 
    title: "FitLife Gym", 
    location: "Yaba, Lagos", 
    price: "₦1,500", 
    original: "₦7,000", 
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80", 
    category: "Fitness", 
    tag: "Monthly Pass",
    description: "One month full access to gym facilities, including swimming pool and aerobics classes. High-quality equipment and trainers.",
    validity: "Must be activated within 7 days of purchase."
  },
];
