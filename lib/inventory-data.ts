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
      '360 Camera Photo Booth with rotating camera platform capturing HD slow-motion videos of guests from every angle. Additional hours beyond the 2-hour rental are $125 per hour.',
    category: 'signature',
    image: '/images/360.PNG',
    pricingType: 'fixed',
    price: '$199.00',
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
      'Features an interactive full-length mirror with instant picture captures for guests. Additional hours beyond the 4-hour rental are $125 per hour.',
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
      { name: 'Mini Garland — 7 ft', price: 'Inquire for pricing', image: '/images/secondary/8ftgarland.png', description: '7-Foot Mini Balloon Garland featuring three balloon colours.' },
      { name: 'Classic Garland — 10 ft', price: 'Inquire for pricing', image: '/images/secondary/10lux.png', description: '10-Foot Classic Balloon Garland featuring three balloon colours.' },
      { name: 'Deluxe Garland — 12 ft', price: 'Inquire for pricing', image: '/images/secondary/12ftballoon.png', description: '12-Foot Deluxe Balloon Garland featuring four balloon colours.' },
      { name: 'Luxury Garland — 14–16 ft', price: 'Inquire for pricing', image: '/images/secondary/16ftballoon.png', description: '14-16-Foot Luxury Balloon Garland featuring five balloon colours.' },
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
      { name: '"Will You Marry Me" Package', price: '$650.00', image: '/images/secondary/marry.png', description: '"Will You Marry Me" White Marquee Letters featuring 4-foot freestanding letters with warm LED lighting, with optional marquee ring or red rose heart add-ons.' },
      { name: 'Proposal Package', price: '$400.00', image: '/images/secondary/proposal.jpg', description: 'Includes Red Rose Heart Backdrop, "Will You Marry Me?" LED Neon Sign, Red Carpet Walkway Runner, Hurricane Vases with LED Candles (aisle setup), and Ambient Lighting.' },
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
      { name: 'White Circle Backdrop Package', price: '$200.00', image: '/images/secondary/whitebackdrop.png', description: 'Includes circular backdrop stands with premium white covers.' },
      { name: 'Red Rose Backdrop Package', price: '$250.00', image: '/images/secondary/redbackdrop.png', description: 'Backdrop stand with a red rose backdrop panel featuring realistic floral textures.' },
      { name: 'White Rose Backdrop Package', price: '$250.00', image: '/images/secondary/whiterose2.jpeg', description: 'Backdrop stand with a white rose backdrop panel featuring realistic floral textures.' },
      { name: 'Gold Metal Backdrop Package', price: '$200.00', image: '/images/secondary/goldbackdrop.png', description: 'Gold metal backdrop stand with a sleek reflective finish.' },
      { name: 'Grass Backdrop Package', price: '$250.00', image: '/images/secondary/grassbackdrop.png', description: 'Grass wall panel with a vibrant green finish and a backdrop stand.' },
      {
        name: 'Summer Floral Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/summerbackdrop.png',
        description: 'Full floral backdrop panel with summer blooms made from artificial flowers.'
      },
      {
        name: 'Shimmer Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/shimmer.png',
        description: '8×10 ft shimmer backdrop panel with hardware. Available in gold or silver.'
      },
      {
        name: 'Frozen Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/frozenbackdrop.png',
        description: 'Circular backdrop stands with Frozen-themed covers.'
      },
      {
        name: 'Mickey Mouse Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/mickybackdrop.png',
        description: 'Circular backdrop stands with Mickey Mouse–themed covers.'
      },
      {
        name: 'Batman Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/batmanabackdrop.png',
        description: 'Circular backdrop stands with Batman-themed covers.'
      },
      {
        name: 'Trolls Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/trollsbackdrop.png',
        description: 'Circular backdrop stands with Trolls-themed covers.'
      },
      {
        name: 'Disney Princess Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/princessbackdrop.png',
        description: 'Circular backdrop stands with princess-themed covers.'
      },
      {
        name: 'Spider-Man 1 Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/spiderman1.png',
        description: 'Circular backdrop stands with Spiderman-themed covers.'
      },
      {
        name: 'Spider-Man 2 Backdrop Package',
        price: '$200.00',
        image: '/images/secondary/spiderman2.png',
        description: 'Circular backdrop stands with Spiderman-themed covers.'
      },
      { name: 'Avengers Backdrop Package', price: '$200.00', image: '/images/secondary/avengers.JPG', description: 'Circular backdrop stands with Avengers-themed covers.' },
      { name: 'Soccer Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with soccer-themed covers.' },
      { name: 'Mermaid Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with mermaid-themed covers.' },
      { name: 'Moana Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Moana-themed covers.' },
      { name: 'Mr & Mrs Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with "Mr & Mrs" themed covers.' },
      { name: 'Boss Baby Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Boss Baby–themed covers.' },
      { name: 'Toy Story Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Toy Story–themed covers.' },
      { name: 'Marble Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with marble-themed covers.' },
      { name: 'Pink Floral Backdrop Package', price: '$200.00', description: 'Full pink floral backdrop panel with pink and blush-toned flowers and a backdrop stand.' },
      { name: 'Blue Floral Backdrop Package', price: '$200.00', description: 'White modern arch frame with a blue and white faux floral arrangement.' },
      { name: 'Safari Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with safari-themed covers.' },
      { name: 'OM Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with OM-themed covers.' },
      { name: 'Minnie Mouse Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Minnie Mouse–themed covers.' },
      { name: 'Basketball Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with basketball-themed covers.' },
      { name: 'Tangled Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Tangled-themed covers.' },
      { name: 'Fortnite Backdrop Package', price: '$200.00', description: 'Circular backdrop stands with Fortnite-themed covers.' },
      { name: 'Arched Panel Backdrop (Custom Wording)', price: '$250.00', description: '7 ft white arched panel with custom wording.' },
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
        name: 'Marquee Letters',
        price: '$50.00',
        description: '3.2ft white marquee letter (A–Z) with built-in lights.',
      },
      {
        name: 'Marquee Numbers',
        price: '$50.00',
        description: '3.2ft white marquee number (0–9) with built-in lights.',
      },
      { name: 'Marquee Heart', price: '$70.00', description: '3.2ft white marquee heart with built-in lights.' },
      { name: 'Marquee – Ring', price: '$70.00' },
      { name: 'Marquee – BABY (Word Set)', price: '$125.00', description: '3.2ft white marquee letters with lights spelling BABY.' },
      { name: '"Will You Marry Me" Neon Sign', price: '$80.00', description: '"Will You Marry Me" LED neon sign with bright white cursive lighting.' },
      { name: '"Bride to Be" Neon Sign', price: '$80.00', description: '"Bride to Be" LED neon sign with warm white cursive lighting.' },
      { name: '"Congrats" Neon Sign', price: '$70.00', description: '"Congrats" LED neon sign with warm white cursive lighting.' },
      { name: '"Happy Birthday" Neon Sign', price: '$70.00', description: '"Happy Birthday" LED neon sign with cursive lighting.' },
      { name: '"Happy Valentine\'s Day" Neon Sign', price: '$70.00', description: '"Happy Valentine\'s" LED neon sign with cursive lighting.' },
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
      { name: 'Cherry Blossom Tree', price: '$250.00', description: '10 ft lifelike cherry blossom tree in pink or white with a freestanding base.' },
      { name: 'Giant Teddy Bear', price: '$50.00', description: 'Giant light brown teddy bear with soft plush material.' },
      { name: 'Solid Wood "BABY" Blocks', price: '$80.00', description: 'Solid wood baby blocks with a smooth natural finish spelling B-A-B-Y. Approximate 16" each.' },
      { name: 'Red Rose Heart', price: '$250.00', description: 'Red rose heart arrangement with a sturdy stand.' },
      { name: 'White Rose Heart', price: '$250.00', description: 'White rose heart arrangement with a sturdy stand.' },
      { name: 'Golden Heart', price: '$125.00', description: 'Heart-shaped gold frame mirror with a reflective finish.' },
      { name: 'White Arch', price: '$100.00', description: '7 ft white arch frame.' },
      { name: 'Champagne Wall', price: '$125.00', description: 'White champagne wall with a sleek finish and built-in glass holders.' },
      { name: 'Dessert Cart', price: '$200.00', description: 'White dessert cart with wood panel accents and built-in LED lighting.' },
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
      { name: 'Red Carpet', price: '$60.00', description: '8 ft red carpet runner.' },
      { name: 'Velvet Ropes', price: '$40.00', description: 'Velvet ropes with chrome stanchion stands. Includes 4 velvet ropes.' },
      { name: 'Red Carpet + Velvet Ropes', price: '$100.00', description: '8 ft red carpet runner with velvet ropes and chrome stanchion stands.' },
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
      { name: 'Standard Folding Chairs', price: '$2.50' },
      { name: 'Spandex Chair Covers', price: '$3.00', description: 'Available in black or white.' },
      { name: 'Black Chiavari Chairs', price: '$8.50 each', description: 'Includes seat cushions.' },
      { name: 'Clear Chiavari Chairs', price: '$8.50 each', description: 'Includes seat cushions.' },
      { name: 'Gold Chiavari Chairs', price: '$8.50 each', description: 'Includes seat cushions.' },
      { name: 'Crossback Harvest Chairs', price: '$9.50 each', description: 'Cross-back harvest chair with a wooden frame and seat.' },
      { name: 'Fruitwood Folding Chairs', price: '$8.00 each' },
      { name: 'Throne Chair – Gold', price: '$150.00', description: 'Gold high-back throne chair with an ornate frame and cushioned seat.' },
      { name: 'Throne Chair – Silver', price: '$150.00', description: 'Silver high-back throne chair with an ornate frame and cushioned seat.' },
      { name: 'Boho Peacock Chair', price: '$100.00', description: 'Boho peacock chair with a woven rattan frame and high back design.' },
      { name: 'LED Curved Bench', price: '$55.00', description: 'Illuminated seating surface and base.' },
      { name: 'LED Barstool', price: '$40.00', description: 'LED podium bar stool with illuminated base and seat.' },
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
      { name: 'Rectangle Tables – 4-6 ft', price: '$10.00', description: 'Rectangular table available in 4 ft or 6 ft size.' },
      { name: 'Rectangle Tables – 8 ft', price: '$12.00', description: 'Rectangular table available in 8 ft size.' },
      { name: 'Round Tables', price: '$12.50', description: 'Round tables available in 4 ft or 5 ft size.' },
      { name: 'Cruiser Tables', price: '$15.00', description: 'Cruiser cocktail table with a tall round surface and sturdy base.' },
      { name: 'Round Table Cloths', price: '$16.00', description: 'Round tablecloth designed to fit standard round tables.' },
      { name: 'Cruiser Table Cloths', price: '$4.00', description: 'High-top cruiser tablecloth designed to fit standard cocktail/cruiser tables.' },
      { name: 'Rectangle Table Cloths (4 ft)', price: '$10.00' },
      { name: 'Rectangle Table Cloths (6 ft)', price: '$13.00' },
      { name: 'Rectangle Table Cloths (8 ft)', price: '$16.00' },
      { name: 'Cylinder Decor Tables', price: '$150.00', description: 'Available in blue, white, pink, or gold.' },
      { name: 'Food Risers', price: '$3.00 each' },
      { name: 'LED Bar', price: '$250.00', description: 'Curved LED bar with illuminated front panel and display shelves for bottles and glassware.' },
      { name: 'LED Lounge Table', price: '$60.00', description: 'LED lounge cocktail table with illuminated base and top.' },
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
      { name: 'Canopy Pop-Up Tent 10x10', price: '$140.00', description: '10×10-foot white canopy tent with a sturdy frame for outdoor coverage.' },
      { name: 'Canopy Pop-Up Tent 10x20', price: '$200.00', description: '10×20-foot white canopy tent with a sturdy frame for outdoor coverage.' },
      { name: 'Canopy Pop-Up Tent 20x40', price: '$979.00', description: '20×40-foot white canopy tent with a sturdy frame for outdoor coverage.' },
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
      { name: 'Inflatable Bounce House', price: '$360.00', description: 'All-white inflatable house made from durable, weather-resistant material.' },
      { name: 'Inflatable Igloo', price: '$200.00', description: 'White and clear inflatable igloo dome made from weather-resistant material.' },
      { name: 'Inflatable Party House', price: '$800.00', description: 'Black inflatable party house made from durable, weather-resistant material.' },
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
