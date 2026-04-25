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
    validity: "Must be activated in 7 days."
  },
  { id: 9, title: "Lekki Surf Club", location: "Lekki, Lagos", price: "₦6,000", original: "₦18,000", image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=70", category: "Travel", tag: "NEW", isHotCoupon: true, description: "Surf lessons for beginners.", validity: "Weekend only" },
  { id: 10, title: "Abuja Paintball", location: "Central Area, Abuja", price: "₦3,500", original: "₦9,000", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=70", category: "Events", tag: "POPULAR", isHotCoupon: true, description: "Team battle with 50 balls.", validity: "Valid for groups" },
  { id: 11, title: "Eko Atlantic Brunch", location: "VI, Lagos", price: "₦8,000", original: "₦20,000", image: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=600&q=70", category: "Food", tag: "HOT", isHotCoupon: true, description: "Unlimited mimosas and buffet.", validity: "Sunday 12pm-4pm" },
  { id: 12, title: "Maitama Tennis", location: "Maitama, Abuja", price: "₦2,000", original: "₦5,000", image: "https://images.unsplash.com/photo-1595435063138-085e791244bb?w=600&q=70", category: "Fitness", tag: "70% OFF", isHotCoupon: true, description: "Court hire + racket rental.", validity: "2 hours play" },
  { id: 13, title: "Zuma Rock Tours", location: "Zuba, Abuja", price: "₦12,000", original: "₦35,000", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&q=70", category: "Travel", tag: "EXPLORE", description: "Guided tour and picnic.", validity: "Booking required" },
  { id: 14, title: "Ikeja City Grill", location: "Ikeja, Lagos", price: "₦4,500", original: "₦12,000", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=70", category: "Service", tag: "MUST TRY", description: "Full rack of ribs + sides.", validity: "Daily after 6pm" },
  { id: 15, title: "VGC Yoga Hub", location: "Ajah, Lagos", price: "₦2,500", original: "₦7,500", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=70", category: "Fitness", tag: "ZEN", description: "Sunset yoga session.", validity: "Tuesdays/Thursdays" },
  { id: 16, title: "Wuse Night Market", location: "Wuse 2, Abuja", price: "₦3,000", original: "₦10,000", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&q=70", category: "Nightlife", tag: "LIVELY", description: "Street food crawl for two.", validity: "Starts 8pm" },
  { id: 17, title: "Tarkwa Bay Camp", location: "Beachfront, Lagos", price: "₦15,000", original: "₦40,000", image: "https://images.unsplash.com/reserve/91miS24XQOWjroP7i2U9_m_G_7313.jpg?w=600&q=70", category: "Travel", tag: "OFF-GRID", description: "Overnight tent + bonfire.", validity: "Weekend only" },
  { id: 19, title: "Jabi Lake Kayak", location: "Jabi, Abuja", price: "₦2,500", original: "₦8,000", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=70", category: "Events", tag: "FUN", description: "1 hour single kayak rental.", validity: "Last entry 5pm" },
  { id: 20, title: "Surulere Cinema", location: "Surulere, Lagos", price: "₦1,500", original: "₦4,500", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=70", category: "Events", tag: "MOVIE NIGHT", description: "Ticket + Large popcorn.", validity: "Mon-Wed only" },
  { id: 21, title: "Garki Arts Center", location: "Garki, Abuja", price: "₦3,000", original: "₦9,000", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=70", category: "Events", tag: "CULTURAL", description: "Painting class + wine.", validity: "Saturdays 2pm" },
  { id: 22, title: "Badagry Heritage", location: "Badagry, Lagos", price: "₦10,000", original: "₦25,000", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=70", category: "Food", tag: "HISTORY", description: "Full day historical tour.", validity: "Includes lunch" },
  { id: 23, title: "Transcorp Pool", location: "Maitama, Abuja", price: "₦5,000", original: "₦15,000", image: "https://images.unsplash.com/photo-1519783166344-933e382d515a?w=600&q=70", category: "Fitness", tag: "CHILL", description: "All day pool access.", validity: "Valid for one" },
  { id: 24, title: "Ikeja Golf Club", location: "Ikeja, Lagos", price: "₦7,500", original: "₦22,000", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=70", category: "Fitness", tag: "PRO", description: "Driving range session.", validity: "100 balls" },
  { id: 25, title: "Lekki Arts Market", location: "Lekki, Lagos", price: "₦2,000", original: "₦6,000", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=70", category: "Events", tag: "LOCAL", description: "Curated souvenir box.", validity: "Available daily" },
  { id: 26, title: "Asokoro Dining", location: "Asokoro, Abuja", price: "₦18,000", original: "₦45,000", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=70", category: "Food", tag: "LUXURY", description: "5-course dinner for two.", validity: "Reserve 24h prior" },
  { id: 27, title: "Yaba Tech Hub", location: "Yaba, Lagos", price: "₦5,000", original: "₦15,000", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70", category: "Travel", tag: "WORKERS", description: "Weekly co-working pass.", validity: "High-speed internet" },
  { id: 28, title: "Abuja City Park", location: "Wuse, Abuja", price: "₦4,000", original: "₦12,000", image: "https://images.unsplash.com/photo-1549474843-ea40283f5cd3?w=600&q=70", category: "Events", tag: "FAMILY", description: "Kids' play pass + snacks.", validity: "2 kids included" },
  { id: 29, title: "Whispering Palms", location: "Badagry, Lagos", price: "₦25,000", original: "₦60,000", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=70", category: "Travel", tag: "ESCAPE", description: "Day trip with boat ride.", validity: "Departure at 9am" },
  { id: 30, title: "Apo Rock Climbing", location: "Apo, Abuja", price: "₦3,500", original: "₦10,000", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=70", category: "Fitness", tag: "DARING", description: "Guided climb + gear.", validity: "Safety briefing incl" },
  { id: 31, title: "Festac Food Fest", location: "Festac, Lagos", price: "₦2,000", original: "₦5,000", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=70", category: "Food", tag: "FESTIVAL", description: "Entry + 3 tasting tokens.", validity: "March 30th only" },
  { id: 32, title: "Gwarinpa Karaoke", location: "Gwarinpa, Abuja", price: "₦1,500", original: "₦4,000", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=70", category: "Nightlife", tag: "SING", description: "Private booth (1 hour).", validity: "Min 4 people" },
  { id: 33, title: "Epe Fish Market", location: "Epe, Lagos", price: "₦5,000", original: "₦12,000", image: "https://images.unsplash.com/photo-1534939561126-89c90f11ac84?w=600&q=70", category: "Travel", tag: "FRESH", description: "Guided morning market tour.", validity: "Starts 7am" },
  { id: 34, title: "Abuja Hilton Gym", location: "Maitama, Abuja", price: "₦8,000", original: "₦20,000", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=70", category: "Fitness", tag: "DELUXE", description: "Full gym + sauna access.", validity: "Single entry" },
  { id: 35, title: "Eko Hotel Buffet", location: "VI, Lagos", price: "₦14,000", original: "₦30,000", image: "https://images.unsplash.com/photo-1550966841-3ee2cb0b1f7e?w=600&q=70", category: "Food", tag: "UNLIMITED", description: "Global cuisine brunch.", validity: "Booking required" },
  { id: 36, title: "Millennium Park", location: "Maitama, Abuja", price: "₦3,000", original: "₦8,000", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=70", category: "Travel", tag: "GREEN", description: "Picnic basket and mat.", validity: "Pre-order 2h prior" },
  // --- ADDITIONAL HOT DEALS FOR MARQUEE ---
  { id: 37, title: "Hard Rock Cafe", location: "VI, Lagos", price: "₦10,000", original: "₦25,000", image: "https://images.unsplash.com/photo-1466973535405-117a72ca2a78?w=600&q=70", category: "Nightlife", tag: "HOT", isHotCoupon: true, description: "Dinner + Live music" },
  { id: 38, title: "Nike Concept", location: "Ikeja, Lagos", price: "₦15,000", original: "₦40,000", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70", category: "Shopping", tag: "HOT", isHotCoupon: true, description: "Concept store exclusive" },
  { id: 40, title: "Club Quill", location: "Wuse 2, Abuja", price: "₦5,000", original: "₦15,000", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=70", category: "Nightlife", tag: "HOT", isHotCoupon: true, description: "VIP entry + 1 Bottle" },
  { id: 41, title: "Lekki Cinemas", location: "Lekki, Lagos", price: "₦2,000", original: "₦6,000", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=70", category: "Events", tag: "HOT", isHotCoupon: true, description: "3D IMAX ticket" },
  { id: 42, title: "Beach Horseback", location: "Beachfront, Lagos", price: "₦8,000", original: "₦22,000", image: "https://images.unsplash.com/photo-1518331166635-0ee7042a984a?w=600&q=70", category: "Travel", tag: "HOT", isHotCoupon: true, description: "1 hour beach ride" },
  { id: 43, title: "Abuja Hilton Buffet", location: "Maitama, Abuja", price: "₦12,000", original: "₦35,000", image: "https://images.unsplash.com/photo-1550966841-3ee2cb0b1f7e?w=600&q=70", category: "Food", tag: "HOT", isHotCoupon: true, description: "Sunday grand buffet" },
  { id: 44, title: "Zuma Rock Hiking", location: "Zuba, Abuja", price: "₦3,000", original: "₦10,000", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&q=70", category: "Fitness", tag: "HOT", isHotCoupon: true, description: "Guided morning climb" },
  { id: 45, title: "VI Yacht Club", location: "VI, Lagos", price: "₦50,000", original: "₦150,000", image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=600&q=70", category: "Luxury", tag: "HOT", isHotCoupon: true, description: "Private boat charter" },
  { id: 46, title: "Ikeja Tech Fest", location: "Ikeja, Lagos", price: "₦3,500", original: "₦12,000", image: "https://images.unsplash.com/photo-1511119245131-030612402e8d?w=600&q=70", category: "Events", tag: "HOT", isHotCoupon: true, description: "Entry + Workshop access" },
  { id: 47, title: "Wuse Spa Hub", location: "Wuse 2, Abuja", price: "₦7,500", original: "₦20,000", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=70", category: "Spa", tag: "HOT", isHotCoupon: true, description: "Signature stress relief" },
  { id: 48, title: "Lekki Food Tours", location: "Lekki, Lagos", price: "₦6,000", original: "₦18,000", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=70", category: "Food", tag: "HOT", isHotCoupon: true, description: "Curated street food experience" },
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
    couponFaceValue: deal.original, // the discount value applied at the merchant
    minimumSpend: (() => {
      // minimum spend = original price × 1.4 (merchant threshold to unlock the coupon)
      const faceVal = parseInt((deal.original || '0').replace(/\D/g, '')) || 0;
      const minSpend = Math.round(faceVal * 1.4 / 1000) * 1000; // round to nearest ₦1000
      return `₦${minSpend.toLocaleString()}`;
    })(),
    dealExplanation: (() => {
      const faceVal = deal.original;
      const minSpendAmt = Math.round((parseInt((deal.original || '0').replace(/\D/g, '')) || 0) * 1.4 / 1000) * 1000;
      const fmtMin = `₦${minSpendAmt.toLocaleString()}`;
      const categories: {[key: string]: string} = {
        'Food & Drink': `Coupon for 1 meal at ${deal.price}. Must purchase a 2nd meal at full price on redemption.`,
        'Beauty & Spas': `Valid for 1 full session. Compulsory product purchase of min ${fmtMin} at venue.`,
        'Goods': `Coupon redeems 1 item. Add a second item at full price for the same trip.`,
        'Local Services': `Discount applies to labor only. Parts must be purchased separately from merchant.`,
        'Things To Do': `Includes entry for 1 person. Drinks/Extras ordered separately at menu price (min ${fmtMin}).`
      };
      return categories[deal.category] || `Coupon worth ${faceVal} on spend of ${fmtMin}. Terms and conditions apply.`;
    })(),
  };
});
