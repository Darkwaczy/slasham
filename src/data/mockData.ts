const now = new Date();
const in4hrs = new Date(now.getTime() + (4 * 60 * 60 * 1000)).toISOString();
const in1Day = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in3Days = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in7Days = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in10Days = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in14Days = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
const in30Days = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

const expiryPool = [in4hrs, in1Day, in3Days, in7Days, in10Days, in14Days, in30Days];

const rawDeals = [
  { 
    id: 1, 
    title: "Iya Basira's Kitchen", 
    location: "Wuse 2, Abuja", 
    price: "₦1,500", 
    original: "₦5,000", 
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=70", 
    category: "Food", 
    tag: "Selling Fast",
    isHotCoupon: true,
    description: "Experience the best local delicacies in Abuja. Perfect for a weekend hangout.",
    dealExplanation: "Includes mains for 4. Drinks ordered separately at menu price (min ₦6,000).",
    whatYouGet: [
      { title: "Full Amala & Ewedu Platter", description: "Standard serving with assorted meat." },
      { title: "Complimentary Soft Drink", description: "Your choice of Coke, Fanta or Sprite." },
      { title: "Reserved Seating", description: "Priority seating for Slasham voucher holders." }
    ],
    validity: "Expires 14 days after purchase.",
    expiryDate: in3Days
  },
  { 
    id: 2, 
    title: "Oasis Wellness Spa", 
    location: "Lekki Phase 1, Lagos", 
    price: "₦3,000", 
    original: "₦15,000", 
    image: "https://images.unsplash.com/photo-1544161515-436cefb657f8?w=600&q=70", 
    category: "Spa", 
    tag: "50% Off",
    isHotCoupon: true,
    description: "Full body massage + facial. Unwind with professional therapists.",
    dealExplanation: "Wash, treatment & styling included. Compulsory product purchase ₦8,000 at venue.",
    whatYouGet: [
      { title: "60-Minute Deep Tissue Massage", description: "Focused on stress relief and muscle tension." },
      { title: "Organic Glow Facial", description: "Using premium natural ingredients." },
      { title: "Complimentary Herbal Tea", description: "Served in our relaxation lounge." }
    ],
    validity: "Valid on weekdays only.",
    expiryDate: in10Days
  },
  { 
    id: 3, 
    title: "Skyline Lounge", 
    location: "Maitama, Abuja", 
    price: "₦2,000", 
    original: "₦8,000", 
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=70", 
    category: "Nightlife", 
    tag: "BOGO",
    isHotCoupon: true,
    description: "Buy 1 cocktail pitcher, get 1 free shisha pot. Stunning views.",
    dealExplanation: "Coupon for 1 cocktail pitcher. Must purchase a 2nd pitcher at ₦8,000 on redemption.",
    whatYouGet: [
      { title: "1L Cocktail Pitcher", description: "Choose from our signature mixology menu." },
      { title: "Premium Shisha Pot", description: "Complimentary with your cocktail purchase." },
      { title: "Rooftop Access", description: "Enjoy the best sunset views in Maitama." }
    ],
    validity: "Valid on Fridays.",
    expiryDate: in10Days
  },
  { 
    id: 4, 
    title: "Lagos Lagoon Cruise", 
    location: "Victoria Island, Lagos", 
    price: "₦5,000", 
    original: "₦25,000", 
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=70", 
    category: "Events", 
    tag: "Weekend Special",
    isHotCoupon: true,
    description: "2-hour sunset cruise with drinks. Perfect for romantic getaways.",
    dealExplanation: "Coupon redeems 1 boat seat. Add a second seat at full price for the same trip.",
    validity: "Requires booking.",
    expiryDate: in3Days
  },
  { 
    id: 5, 
    title: "The Suya Spot", 
    location: "Garki, Abuja", 
    price: "₦1,000", 
    original: "₦3,500", 
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=70", 
    category: "Food", 
    tag: "New",
    isHotCoupon: true,
    description: "Assorted suya platter with a free drink. Best spicy meat.",
    dealExplanation: "Valid for 1 large platter. Min spend of ₦4,000 on additional sides required.",
    validity: "Valid for dine-in."
  },
  { 
    id: 6, 
    title: "Glow Up Studio", 
    location: "Ikeja, Lagos", 
    price: "₦2,500", 
    original: "₦10,000", 
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=70", 
    category: "Beauty", 
    tag: "Trending",
    isHotCoupon: true,
    description: "Complete makeover session for your next owambe.",
    dealExplanation: "Bridal makeup + lashes included. Group booking (min 3) required for discount.",
    validity: "Booking required."
  },
  { 
    id: 7, 
    title: "Afrobeat Live", 
    location: "Eko Hotel, Lagos", 
    price: "₦4,000", 
    original: "₦12,000", 
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=70", 
    category: "Events", 
    tag: "VIP Access",
    isHotCoupon: true,
    description: "VIP ticket to the month's biggest concert.",
    dealExplanation: "VIP entry for 1. Drinks ordered separately at venue price (min ₦10,000).",
    validity: "Valid only on event date."
  },
  { 
    id: 8, 
    title: "FitLife Gym", 
    location: "Yaba, Lagos", 
    price: "₦1,500", 
    original: "₦7,000", 
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=70", 
    category: "Fitness", 
    tag: "Monthly Pass",
    isHotCoupon: true,
    description: "One month full access to gym and swimming pool.",
    dealExplanation: "Coupon for 1 month pass. Must purchase gym starter kit (₦5,000) at registration.",
    validity: "Must be activated in 7 days."
  },
  { id: 9, title: "Lekki Surf Club", location: "Lekki, Lagos", price: "₦6,000", original: "₦18,000", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=70", category: "Travel", tag: "NEW", isHotCoupon: true, description: "Surf lessons for beginners.", dealExplanation: "1 hour professional coaching. Board rental (₦4,000) not included in coupon.", validity: "Weekend only" },
  { id: 10, title: "Paintball Abuja", location: "Central Area, Abuja", price: "₦3,500", original: "₦9,000", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=70", category: "Events", tag: "POPULAR", isHotCoupon: true, description: "Team battle with 50 balls.", dealExplanation: "Entry + 50 balls. Additional balls must be purchased at ₦2,000 per 100.", validity: "Valid for groups" },
  { id: 11, title: "Eko Atlantic Brunch", location: "VI, Lagos", price: "₦8,000", original: "₦20,000", image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&q=70", category: "Food", tag: "HOT", isHotCoupon: true, description: "Unlimited mimosas and buffet.", dealExplanation: "Includes mains for 2. 3rd person pays full price at venue.", validity: "Sunday 12pm-4pm" },
  { id: 12, title: "Maitama Tennis", location: "Maitama, Abuja", price: "₦2,000", original: "₦5,000", image: "https://images.unsplash.com/photo-1595435063138-085e791244bb?w=600&q=70", category: "Fitness", tag: "70% OFF", isHotCoupon: true, description: "Court hire + racket rental.", dealExplanation: "1 hour court time. Racket rental included. Weekend surcharge of ₦1,000 applies.", validity: "2 hours play" },
];

export const deals = rawDeals.map((deal, index) => {
  const totalQuantity = 50 + (index % 10) * 10;
  const soldQuantity = Math.floor(totalQuantity * (0.3 + (index % 5) * 0.15));
  return {
    ...deal,
    totalQuantity,
    soldQuantity,
    expiryDate: expiryPool[index % expiryPool.length],
    // Coupon mechanics fields
    couponFaceValue: deal.original,
    minimumSpend: "₦10,000", // Simplified for display
    dealExplanation: deal.dealExplanation || "Valid for 1 person. Terms and conditions apply at redemption venue."
  };
});
