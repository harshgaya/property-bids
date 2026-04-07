export const SITE = {
  name: "PropertyBids",
  fullName: "MyPropertyBids.in",
  tagline: "Direct Sellers. Real Buyers. No Fakes.",
  description:
    "India's first trust-first real estate marketplace. GPS-verified listings. Live photos. Serious buyers pay ₹99 to bid.",
  url: "https://mypropertybids.in",
  email: "hello@mypropertybids.in",
  supportEmail: "support@mypropertybids.in",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: {
    line1: "4th Floor, Cyber Towers",
    line2: "Hitech City, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pin: "500081",
    country: "India",
  },
};

export const SOCIAL = {
  instagram: "https://instagram.com/mypropertybids",
  twitter: "https://twitter.com/mypropertybids",
  linkedin: "https://linkedin.com/company/mypropertybids",
  facebook: "https://facebook.com/mypropertybids",
  youtube: "https://youtube.com/@mypropertybids",
};

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
export const NAV = {
  buy: [
    {
      label: "Search Properties",
      href: "/buy",
      desc: "Browse verified listings",
    },
    { label: "Map Search", href: "/map", desc: "Find properties on map" },
    {
      label: "How Bidding Works",
      href: "/how-it-works",
      desc: "Learn the bid process",
    },
  ],
  sell: [
    { label: "Post Property", href: "/post-property", desc: "List in minutes" },
    {
      label: "Seller Landing",
      href: "/sell",
      desc: "Why sell on PropertyBids",
    },
    { label: "Pricing Plans", href: "/pricing", desc: "Basic, Manual, Legal" },
    { label: "Dashboard", href: "/dashboard", desc: "Manage your listings" },
  ],
  company: [
    { label: "About Us", href: "/about", desc: "Our story & mission" },
    { label: "How It Works", href: "/how-it-works", desc: "The full process" },
    { label: "Blog", href: "/blog", desc: "Tips & real estate news" },
    { label: "Contact", href: "/contact", desc: "Get in touch" },
  ],
};

// ─── TRUST & VERIFICATION ────────────────────────────────────────────────────
export const TRUST = {
  legal: {
    label: "Legal Verified",
    shortLabel: "Legal",
    badgeClass: "bg-green-50 text-green-700 border border-green-200",
    dotClass: "bg-green-500",
    ringClass: "ring-green-500",
    price: 30000,
    priceLabel: "₹30,000",
  },
  manual: {
    label: "Pre-Verified",
    shortLabel: "Manual",
    badgeClass: "bg-gray-100 text-gray-600 border border-gray-200",
    dotClass: "bg-gray-400",
    ringClass: "ring-gray-400",
    price: 2499,
    priceLabel: "₹2,499",
  },
  basic: {
    label: "Unverified",
    shortLabel: "Basic",
    badgeClass: "bg-gray-900 text-gray-300 border border-gray-700",
    dotClass: "bg-gray-700",
    ringClass: "ring-gray-700",
    price: 199,
    priceLabel: "₹199",
  },
};

// ─── PROPERTY TYPES ──────────────────────────────────────────────────────────
export const PROPERTY_TYPES = [
  { value: "all", label: "All Types", icon: "🏘️" },
  { value: "villa", label: "Villa", icon: "🏡" },
  { value: "apartment", label: "Apartment", icon: "🏢" },
  { value: "highrise", label: "High-Rise", icon: "🏙️" },
  { value: "house", label: "Ind. House", icon: "🏠" },
  { value: "plot", label: "Plot", icon: "📐" },
  { value: "land", label: "Land (1Ac+)", icon: "🌾" },
];

// ─── FILTERS ─────────────────────────────────────────────────────────────────
export const FACING = ["East", "West", "North", "South"];
export const TAGS = [
  "Metro",
  "Gated",
  "Corner",
  "Main Road",
  "School Zone",
  "Hospital Zone",
];
export const AMENITIES = [
  "Gym",
  "Swimming Pool",
  "Clubhouse",
  "Security",
  "Power Backup",
  "Parking",
];

// ─── LISTING PLANS ───────────────────────────────────────────────────────────
export const PLANS = [
  {
    key: "basic",
    name: "Basic Post",
    price: 199,
    priceLabel: "₹199",
    dotClass: "bg-gray-700",
    highlight: false,
    cta: "Post for ₹199",
    color: "gray",
    features: [
      "Self-posted listing",
      "Up to 10 photos",
      "5 must be live camera shots",
      "GPS location pin mandatory",
      "Visible on map immediately",
      "Basic Unverified badge",
    ],
  },
  {
    key: "manual",
    name: "Manual Verified",
    price: 2499,
    priceLabel: "₹2,499",
    dotClass: "bg-gray-400",
    highlight: true,
    cta: "Get Verified — ₹2,499",
    color: "green",
    features: [
      "Everything in Basic",
      "Team verifies facing & road access",
      "Owner ID & selfie checked",
      "Up to 30 photos (10 live)",
      "Pre-Verified badge on listing",
      "Priority placement in search",
    ],
  },
  {
    key: "legal",
    name: "Legal Verified",
    price: 30000,
    priceLabel: "₹30,000",
    dotClass: "bg-green-500",
    highlight: false,
    cta: "Legal Verify — ₹30,000",
    color: "emerald",
    features: [
      "Everything in Manual",
      "Lawyer verifies all documents",
      "Encumbrance certificate checked",
      "Title deed validation",
      "Legal Verified badge — highest trust",
      "Featured in top of search results",
    ],
  },
];

// ─── BID PRICE ───────────────────────────────────────────────────────────────
export const BID_PRICE = 99;

// ─── STATS ───────────────────────────────────────────────────────────────────
export const STATS = [
  { value: "12,400+", label: "Verified Listings" },
  { value: "3,200+", label: "Successful Bids" },
  { value: "8,900+", label: "Happy Sellers" },
  { value: "₹0", label: "Fake Listings" },
];

// ─── PROTECTED ROUTES ────────────────────────────────────────────────────────
export const PROTECTED_PATHS = ["/post-property", "/dashboard"];
export const PROTECTED_API = ["/api/properties/POST", "/api/bids"];
