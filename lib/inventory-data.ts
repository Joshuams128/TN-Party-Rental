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
      'State-of-the-art 360° slow-motion video booth with custom backdrops and instant social sharing.\n\nCapture every angle with our 360 Camera Photo Booth, delivering smooth HD slow-motion videos perfect for parties, weddings, corporate events, and celebrations. Guests stand on the platform while the camera rotates to create high-energy, share-worthy clips. Book our 360 camera rental in the GTA for unforgettable, modern event content.',
    category: 'signature',
    image: '/images/360.PNG',
    pricingType: 'tiered',
    tiers: [
      { label: '2 Hours', price: '$360.00' },
      { label: '3 Hours', price: '$475.00' },
      { label: '4 Hours', price: '$575.00' },
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
      { label: '2 Hours', price: '$360.00' },
      { label: '3 Hours', price: '$475.00' },
      { label: '4 Hours', price: '$575.00' },
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
    slug: 'photo-booth-add-ons',
    name: 'Photo Booth Add-ons',
    description:
      'Exclusive premium add-ons to enhance your luxury photo booth & 360 experiences.',
    category: 'signature',
    image: '/images/eventspace.jpeg',
    pricingType: 'variants',
    variants: [
      { name: 'Luxury White Rose Wall', price: '$200.00', image: '/images/secondary/whiterose.png' },
      { name: 'Signature Red Rose Wall', price: '$200.00', image: '/images/secondary/redrose.png' },
      { name: 'Digital Print with Logo', price: '$80.00', image: '/images/secondary/yourlogohere.png' },
    ],
    features: [
      'Premium backdrops',
      'Custom branding',
      'Professional installation',
      'Instant digital sharing',
    ],
    note: 'HST extra. Perfect complement to any photo booth experience.',
  },
  {
    slug: 'custom-balloons',
    name: 'Balloon Garlands',
    description:
      'Professional balloon garland artistry in various sizes for stunning event décor.',
    category: 'signature',
    image: '/images/Custom_Balloon_Decorations_Image.PNG',
    pricingType: 'variants',
    variants: [
      { name: 'Mini Garland — 7 ft', price: '$150.00', image: '/images/secondary/8ftgarland.png', description: 'Create a picture-perfect setup with our 7-Foot Mini Balloon Garland, available for rent across the Greater Toronto Area (GTA)! Featuring 2 beautiful balloon colours, this garland is perfect for weddings, birthdays, baby showers, and corporate events that need a clean and modern look.' },
      { name: 'Classic Garland — 10 ft', price: '$250.00', image: '/images/secondary/10lux.png', description: 'Create a picture-perfect setup with our 10-Foot Basic Balloon Arch, available for rent across the Greater Toronto Area (GTA)! Featuring 2 beautiful balloon colours, this arch is perfect for weddings, birthdays, baby showers, and corporate events that need a clean and modern look. Includes 2 balloon colours, 10-foot organic balloon arch, and delivery, setup, and teardown available anywhere in the GTA.' },
      { name: 'Deluxe Garland — 12 ft', price: '$350.00', image: '/images/secondary/12ftballoon.png', description: '🎈✨ 12-Foot Premium Balloon Arch – Event Rentals in the GTA. Add a show-stopping touch to your celebration with our 12-Foot Premium Balloon Arch, available for rent throughout the GTA! 💎 Crafted with 3 luxurious balloon colours, this elegant arch creates a perfect focal point for stages, entrances, and photo walls. Includes 3 premium balloon colours, 12-foot organic balloon arch with professional layout, and delivery, setup, and teardown available anywhere in the GTA.' },
      { name: 'Luxury Garland — 14–16 ft', price: '$450.00', image: '/images/secondary/16ftballoon.png', description: '🎈✨ 14-16-Foot Premium Balloon Arch – Event Rentals in the GTA. Go big with our 14-16-Foot Premium Balloon Arch, available for rent across the Greater Toronto Area (GTA)! 💖 Designed with 3 premium balloon colours, this oversized, elegant arch is perfect for weddings, outdoor festivals, grand openings, and large-scale events.' },
    ],
    features: [
      'Custom colors',
      'Professional installation',
      'Long-lasting design',
      'Theme coordination',
    ],
    note: 'HST extra. Delivery & setup included.',
  },

  // ─── PACKAGES ─────────────────────────────────────────────────────────────
  {
    slug: 'premium-packages',
    name: 'Premium Packages',
    description:
      'Curated all-in-one event packages for proposals, celebrations, and special occasions.',
    category: 'packages',
    image: '/images/secondary/proposal.jpg',
    pricingType: 'variants',
    variants: [
      { name: '"Will You Marry Me" Package', price: '$650.00', image: '/images/secondary/marry.png', description: 'These "Will You Marry Me" White Marquee Letters include large 4-foot freestanding letters with warm LED lighting, plus an optional marquee ring or red rose heart add-on, creating a bright, romantic proposal display for events across the GTA.' },
      { name: 'Proposal Package', price: '$400.00', image: '/images/secondary/proposal.jpg', description: '💐 What This Package Includes: ✨ Red Rose Heart Backdrop, ✨ "Will You Marry Me?" LED Neon Sign, ✨ Red Carpet Walkway Runner, ✨ Hurricane Vases with LED Candles (aisle setup), ✨ Romantic Ambient Lighting. Note: Fresh flowers, rose petals, floral centerpieces, and delivery/setup/takedown are not included.' },
      {
        name: 'Red Heart + "Will You Marry Me" Marquee Letters',
        price: '$750.00',
        image: '/images/secondary/redheart.png',
        description: '💡 Features: • Complete "WILL YOU MARRY ME" marquee letter setup • Red rose heart backdrop',
      },
      {
        name: 'Marquee Heart + "Will You Marry Me" Marquee Letters',
        price: '$700.00',
        image: '/images/secondary/MarqueeHeart.png',
        description: '💡 Features: • Stunning white marquee letters spelling out "WILL YOU MARRY ME" • Beautiful marquee heart or ring (your choice!) that glows with warm LED lighting for the perfect romantic touch',
      },
      { name: 'LED Furniture Décor Package', price: '$750.00', image: '/images/secondary/ledL.png', description: 'This LED Lounge Furniture Package includes LED curved benches, LED cruiser tables, and LED podium barstools, featuring multicolor LED lighting, cordless battery-powered design, and weather-resistant materials.' },
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
    image: '/images/secondary/spiderman1.png',
    pricingType: 'variants',
    variants: [
      { name: 'White Circle Backdrop Package', price: '$200.00', image: '/images/secondary/whitebackdrop.png',         description: 'This White Circle Backdrop Package includes circular backdrop stands with premium white covers, creating a clean and elegant base for customizable event décor across the GTA.' },
      { name: 'Red Rose Backdrop Package', price: '$250.00', image: '/images/secondary/redbackdrop.png', description: 'This Red Rose Backdrop Package includes a premium backdrop stand and a red rose backdrop panel with rich, realistic floral textures, creating a luxurious and romantic display for events across the GTA.' },
      { name: 'White Rose Backdrop Package', price: '$250.00', image: '/images/secondary/whiterose2.jpeg', description: 'This White Rose Backdrop Package includes a premium backdrop stand and a white rose floral panel with realistic high-quality blooms, creating an elegant and timeless display for events across the GTA.' },
      { name: 'Gold Metal Backdrop Package', price: '$200.00', image: '/images/secondary/goldbackdrop.png', description: 'This Gold Metal Backdrop package includes a premium gold metal stand with a sleek reflective finish, creating a modern and elegant base for event décor across the GTA.' },
      { name: 'Grass Backdrop Package', price: '$250.00', image: '/images/secondary/grassbackdrop.png', description: 'This Grass Backdrop Package includes a premium grass wall panel with a vibrant green finish and a backdrop stand for secure, professional setup—perfect for natural-themed décor across the GTA.' },
      {
        name: 'Summer Floral Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/summerbackdrop.png',
        description: 'This Summer Floral Backdrop Package includes a full floral backdrop panel bursting with vibrant, colorful summer blooms, designed to create a bright and elegant statement at any event. The panel is crafted with premium artificial flowers for a lush, natural look and is perfect for wall-mounted setups, photo areas, and floral-themed décor across the Greater Toronto Area.'
      },
      {
        name: 'Shimmer Panel Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/shimmer.png',
        description: 'This Shimmer Panel Backdrop Package includes an 8x10ft shimmer backdrop and a sturdy backdrop stand, creating a sparkling, eye-catching display perfect for photos and event décor across the GTA.'
      },
      {
        name: 'Frozen Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/frozenbackdrop.png',
        description: 'This Frozen Backdrop Package includes circular backdrop stands with Frozen-themed covers featuring Elsa, Anna, and icy designs, creating a magical winter display for themed events across the GTA.'
      },
      {
        name: 'Mickey Mouse Circle Backdrop Set',
        price: '$200.00',
        image: '/images/secondary/mickybackdrop.png',
        description: 'This Mickey Mouse Backdrop Package includes circular backdrop stands with Mickey Mouse–themed covers in classic red, black, and yellow designs, creating a vibrant and cheerful display for kids’ events across the GTA.'
      },
      {
        name: 'Bat-Man Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/batmanabackdrop.png',
        description: 'This Batman Backdrop Package includes circular backdrop stands with Batman-themed covers featuring iconic logos and cityscape designs, creating a bold superhero display for themed events across the GTA.'
      },
      {
        name: 'Trolls Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/trollsbackdrop.png',
        description: 'This Trolls Backdrop Package includes circular backdrop stands with Trolls-themed covers featuring Poppy, Branch, and vibrant rainbow designs, creating a colorful and joyful display for themed events across the GTA.'
      },
      {
        name: 'Princesses Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/princessbackdrop.png',
        description: 'This Princesses Backdrop Package includes circular backdrop stands with princess-themed covers featuring castle and character designs, creating a magical and elegant display for themed events across the GTA.'
      },
      {
        name: 'Spider-Man 1 Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/spiderman1.png',
        description: 'This Spiderman Backdrop Package includes circular backdrop stands with Spiderman-themed covers featuring cityscape and hero designs, creating a bold and action-packed display for themed events across the GTA.'
      },
      {
        name: 'Spider-Man 2 Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/spiderman2.png',
        description: 'This Spiderman Backdrop Package includes circular backdrop stands with Spiderman-themed covers featuring cityscape and hero designs, creating a bold and action-packed display for themed events across the GTA.'
      },
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
      { name: 'Glow Furniture', price: '$55.00' },
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
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug);
}
