export type PricingTier = {
  label: string;
  price: string;
  note?: string;
};

export type ProductVariant = {
  name: string;
  price: string;
  description?: string;
  image?: string;
};

export type ProductDetail = {
  slug: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  objectPosition?: string;
  pricingType: 'fixed' | 'tiered' | 'variants' | 'quote';
  price?: string;
  tiers?: PricingTier[];
  variants?: ProductVariant[];
  features?: string[];
  note?: string;
};

export const productDetails: ProductDetail[] = [
  // ─── SIGNATURE ────────────────────────────────────────────────────────────
  {
    slug: '360-camera',
    name: '360° Camera Experience',
    description:
      'State-of-the-art 360° slow-motion video booth with custom backdrops and instant social sharing.',
    category: 'signature',
    image: '/images/360.PNG',
    pricingType: 'tiered',
    tiers: [
      { label: '2 Hours', price: '$350.00' },
      { label: '3 Hours', price: '$425.00' },
      { label: '4 Hours', price: '$480.00' },
    ],
    features: [
      'Slow-motion capture',
      'Custom branding',
      'Social media sharing',
      'Professional lighting',
    ],
    note: 'HST extra. Delivery & setup included.',
  },
  {
    slug: 'mirror-photobooth',
    name: 'Mirror Photo Booth',
    description:
      'Full-length interactive mirror with touchscreen interface, voice guidance, and instant prints.',
    category: 'signature',
    image: '/images/mirrorp.png',
    objectPosition: 'center 40%',
    pricingType: 'tiered',
    tiers: [
      { label: '2 Hours', price: '$350.00' },
      { label: '3 Hours', price: '$450.00' },
      { label: '4 Hours', price: '$550.00' },
    ],
    features: [
      'Touchscreen interface',
      'Voice guidance',
      'Instant prints',
      'Digital gallery',
    ],
    note: 'HST extra. Delivery & setup included.',
  },
  {
    slug: 'custom-balloons',
    name: 'Custom Balloon Decorations',
    description:
      'Professional balloon artistry including arches, garlands, columns, and themed sculptures.',
    category: 'signature',
    image: '/images/Custom_Balloon_Decorations_Image.PNG',
    pricingType: 'quote',
    features: [
      'Balloon arches',
      'Garlands',
      'Sculptures',
      'Themed designs',
      'Stuffed balloons',
      'Balloon bouquets',
    ],
    note: 'Custom pricing based on size, style, and quantity. Contact us for a quote.',
  },

  // ─── PACKAGES ─────────────────────────────────────────────────────────────
  {
    slug: 'premium-packages',
    name: 'Premium Packages',
    description:
      'Curated all-in-one event packages for proposals, celebrations, and special occasions.',
    category: 'packages',
    image: '/images/Home_Page_1.png',
    pricingType: 'variants',
    variants: [
      { name: '"Will You Marry Me" Package', price: '$650.00' },
      { name: 'Proposal Package', price: '$400.00' },
      {
        name: 'Red Heart + "Will You Marry Me" Marquee Letters',
        price: '$750.00',
      },
      {
        name: 'Marquee Heart + "Will You Marry Me" Marquee Letters',
        price: '$700.00',
      },
      { name: 'LED Furniture Décor Package', price: '$750.00' },
    ],
    features: ['All-inclusive setup', 'Premium décor', 'Delivery & breakdown'],
    note: 'HST extra where applicable.',
  },

  // ─── DÉCOR ────────────────────────────────────────────────────────────────
  {
    slug: 'backdrop-packages',
    name: 'Backdrop Packages',
    description:
      'Stunning backdrop options for any theme — from elegant florals to beloved characters and custom designs.',
    category: 'decor',
    image: '/images/eventspace.jpeg',
    pricingType: 'variants',
    variants: [
      { name: 'White Circle Backdrop Package', price: '$200.00' },
      { name: 'Red Rose Backdrop Package', price: '$250.00' },
      { name: 'White Rose Backdrop Package', price: '$250.00' },
      { name: 'Gold Metal Backdrop Package', price: '$200.00' },
      { name: 'Grass Backdrop Package', price: '$250.00' },
      { name: 'Summer Floral Backdrop Package', price: '$200.00' },
      { name: 'Shimmer Panel Backdrop Package', price: '$200.00' },
      { name: 'Frozen Backdrop Package', price: '$200.00' },
      { name: 'Mickey Mouse Circle Backdrop Set', price: '$200.00' },
      { name: 'Bat-Man Backdrop Package', price: '$200.00' },
      { name: 'Trolls Backdrop Package', price: '$200.00' },
      { name: 'Princesses Backdrop Package', price: '$200.00' },
      { name: 'Spider-Man 1 Backdrop Package', price: '$200.00' },
      { name: 'Spider-Man 2 Backdrop Package', price: '$200.00' },
      { name: 'Soccer Backdrop Package', price: '$200.00' },
      { name: 'Mermaid Backdrop Package', price: '$200.00' },
      { name: 'Moana Circle Backdrop Package', price: '$200.00' },
      { name: 'Mr. & Mrs. Backdrop Package', price: '$200.00' },
      { name: 'Boss Baby Backdrop Package', price: '$200.00' },
      { name: 'Toy Story Backdrop Package', price: '$200.00' },
      { name: 'Marble Circle Backdrop Package', price: '$200.00' },
      { name: 'Pink Floral Backdrop Package', price: '$200.00' },
      { name: 'Safari Backdrop Package', price: '$200.00' },
      { name: 'OM Circle Backdrop Package', price: '$200.00' },
      { name: 'Minnie Mouse Backdrop Package', price: '$200.00' },
      { name: 'Blue Floral Backdrop Package', price: '$200.00' },
      { name: 'Basketball Backdrop Package', price: '$200.00' },
      { name: 'Tangled Backdrop Package', price: '$200.00' },
      { name: 'Fortnite Backdrop Package', price: '$200.00' },
      {
        name: '7ft Arched Panel Backdrop (Custom Wording)',
        price: '$250.00',
      },
    ],
    features: ['Easy setup', 'Wide theme selection', 'Great photo background'],
    note: 'All prices in CAD. HST extra.',
  },
  {
    slug: 'marquee-letters',
    name: 'Marquee Letters & Signs',
    description:
      'Illuminated marquee letters, numbers, and neon signs to spell out your celebration in style.',
    category: 'decor',
    image: '/images/eventspace.jpeg',
    pricingType: 'variants',
    variants: [
      {
        name: 'Marquee – White with Lights – 3.2′ (A–Z, 0–9)',
        price: '$50.00',
        description: 'Per letter or number',
      },
      { name: 'Marquee – Heart', price: '$70.00' },
      { name: 'Marquee – Ring', price: '$70.00' },
      { name: 'Marquee – Baby (word set)', price: '$125.00' },
      { name: 'Will You Marry Me Neon Sign', price: '$80.00' },
      { name: 'Bride To Be Neon Sign', price: '$80.00' },
      { name: 'Congrats Neon Sign', price: '$70.00' },
      { name: 'Happy Birthday Neon Sign', price: '$70.00' },
      { name: 'White Rose Heart + Neon Sign', price: '$300.00' },
      { name: 'Red Rose Heart + Neon Sign', price: '$300.00' },
    ],
    features: [
      'LED illuminated',
      'Indoor & outdoor',
      'Perfect for photos',
      'Multiple styles',
    ],
    note: 'All prices in CAD. HST extra.',
  },
  {
    slug: 'decor-props',
    name: 'Décor & Props',
    description:
      'Elegant props and décor pieces to elevate any event space with a personal touch.',
    category: 'decor',
    image: '/images/eventspace.jpeg',
    pricingType: 'variants',
    variants: [
      { name: 'Cherry Blossom Tree', price: '$250.00' },
      { name: 'Teddy Bear', price: '$50.00' },
      { name: 'Solid Wood Baby Blocks', price: '$80.00' },
      { name: 'Red Rose Heart Display', price: '$250.00' },
      { name: 'White Rose Heart', price: '$250.00' },
      { name: 'Golden Heart', price: '$125.00' },
      { name: 'White Arch', price: '$100.00' },
      { name: 'White Champagne Wall', price: '$125.00' },
    ],
    features: ['Premium quality', 'Great centrepieces', 'Wide variety'],
    note: 'All prices in CAD. HST extra.',
  },
  {
    slug: 'carpet-ropes',
    name: 'Carpet & Ropes',
    description:
      'Make a grand entrance with our red carpet and velvet rope packages for VIP-style arrivals.',
    category: 'decor',
    image: '/images/eventspace.jpeg',
    pricingType: 'variants',
    variants: [
      { name: '8ft Red Carpet', price: '$60.00' },
      { name: 'Velvet Ropes', price: '$40.00' },
      { name: 'Red Carpet + Velvet Ropes', price: '$100.00' },
    ],
    features: ['VIP entrance', 'Photo-ready', 'Easy setup'],
    note: 'All prices in CAD. HST extra.',
  },

  // ─── FURNITURE ────────────────────────────────────────────────────────────
  {
    slug: 'chairs-seating',
    name: 'Chairs & Seating',
    description:
      'Elegant and comfortable seating options to suit any event style — from intimate gatherings to grand galas.',
    category: 'furniture',
    image: '/images/Chairs_and_Seating_Image.png',
    pricingType: 'variants',
    variants: [
      { name: 'White Folding Chairs', price: '$3.39 each' },
      { name: 'Black Chiavari Chairs + Cushions', price: '$8.50 each' },
      { name: 'Clear Chiavari Chairs + Cushions', price: '$8.50 each' },
      { name: 'Gold Chiavari Chairs + Cushions', price: '$8.50 each' },
      { name: 'Crossback Harvest Chairs', price: '$9.50 each' },
      { name: 'Fruitwood Folding Chairs', price: '$8.00 each' },
      { name: 'High Back Throne Chair (Gold)', price: '$150.00' },
      { name: 'High Back Throne Chair (Silver)', price: '$150.00' },
      { name: 'Boho Peacock Chair', price: '$100.00' },
      { name: 'LED Curved Benches', price: '$55.00' },
    ],
    features: [
      'Chiavari chairs',
      'Throne chairs',
      'Folding chairs',
      'Lounge seating',
    ],
    note: 'All prices in CAD. HST extra.',
  },
  {
    slug: 'tables-linens',
    name: 'Tables & Linens',
    description:
      'Premium tables in various sizes with professional-grade construction for any event layout.',
    category: 'furniture',
    image: '/images/Tables_and_Linen_Image.png',
    pricingType: 'variants',
    variants: [
      { name: 'Rectangle 4ft & 6ft Table', price: '$10.00' },
      { name: 'Rectangle 8ft Table', price: '$12.00' },
      { name: 'Round Tables (60" & 48")', price: '$12.50' },
      { name: 'Cruiser Table', price: '$15.00' },
      { name: 'Cake Stands (Blue, White, Gold, or Pink)', price: '$150.00' },
      { name: 'Food Risers', price: '$3.00 each' },
    ],
    features: [
      '60" & 72" rounds',
      '6ft & 8ft rectangles',
      'Cocktail tables',
      'Folding tables',
    ],
    note: 'All prices in CAD. HST extra.',
  },

  // ─── STRUCTURES ───────────────────────────────────────────────────────────
  {
    slug: 'event-tents',
    name: 'Event Tents & Canopies',
    description:
      'Weather-proof pop-up canopy tents in multiple sizes — perfect for outdoor events of any scale.',
    category: 'structures',
    image: '/images/bigtent.png',
    pricingType: 'variants',
    variants: [
      { name: 'Canopy Pop-up 10×10 Tent', price: '$140.00' },
      { name: 'Canopy Pop-up 10×20 Tent', price: '$200.00' },
      { name: 'Canopy Pop-up 20×40ft Tent', price: '$979.00' },
    ],
    features: [
      'Weather-proof',
      'Multiple sizes',
      'Sidewalls available',
      'Professional setup',
    ],
    note: 'All prices in CAD. HST extra. Delivery & setup fees may apply.',
  },
  {
    slug: 'dance-floors',
    name: 'Dance Floors',
    description:
      'Portable dance floors in various sizes with professional installation for indoor and outdoor events.',
    category: 'structures',
    image: '/images/dance.png',
    pricingType: 'quote',
    features: [
      'Multiple sizes',
      'Black & white',
      'Professional install',
      'Indoor/outdoor',
    ],
    note: 'Pricing varies by size and location. Contact us for a custom quote.',
  },
  {
    slug: 'inflatables',
    name: 'Inflatables & Bounce Houses',
    description:
      'Fun and safe inflatable entertainment for kids and adults — perfect for backyard parties and large events.',
    category: 'structures',
    image: '/images/bigtent.png',
    pricingType: 'variants',
    variants: [
      { name: 'White Inflatable Bouncy House', price: '$360.00' },
      { name: 'White Inflatable Igloo', price: '$200.00' },
      { name: 'Inflatable Party House', price: '$800.00' },
    ],
    features: [
      'Safe & clean',
      'Setup included',
      'Indoor & outdoor options',
      'Multiple styles',
    ],
    note: 'All prices in CAD. HST extra. Delivery & setup included.',
  },

  // ─── TABLEWARE ────────────────────────────────────────────────────────────
  {
    slug: 'dishware',
    name: 'Dishware & Glassware',
    description:
      'Complete place settings including plates, glasses, and flatware for a polished table presentation.',
    category: 'tableware',
    image: '/images/dishware.png',
    pricingType: 'quote',
    features: [
      'Dinner plates',
      'Wine glasses',
      'Flatware sets',
      'Serving platters',
    ],
    note: 'Pricing based on quantity. Contact us for a custom quote.',
  },
  {
    slug: 'serving-equipment',
    name: 'Serving Equipment',
    description:
      'Chafing dishes, beverage dispensers, and serving utensils to keep your food service seamless.',
    category: 'tableware',
    image: '/images/serving.png',
    pricingType: 'quote',
    features: [
      'Chafing dishes',
      'Beverage dispensers',
      'Serving utensils',
      'Coolers',
    ],
    note: 'Pricing based on quantity and duration. Contact us for a quote.',
  },

  // ─── ENTERTAINMENT ────────────────────────────────────────────────────────
  {
    slug: 'lighting',
    name: 'Lighting & Ambiance',
    description:
      'Uplighting, string lights, and decorative lighting to set the perfect mood for your event.',
    category: 'entertainment',
    image: '/images/lighting.png',
    pricingType: 'quote',
    features: [
      'LED uplighting',
      'String lights',
      'Spotlights',
      'Color options',
    ],
    note: 'Pricing based on venue size and lighting requirements. Contact us for a quote.',
  },
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug);
}
