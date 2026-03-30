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
      '2 Hours / Attendant\nRed carpet & stanchions included\nStandard props included\n\n360 Camera Photo Booth with rotating camera platform capturing HD slow-motion videos of guests from every angle. Additional hours beyond the 2-hour rental are $125 per hour.',
    category: 'signature',
    image: '/images/360.PNG',
    pricingType: 'tiered',
    tiers: [
      { label: '2 Hours', price: '$350.00' },
    ],
    variants: [
      { name: 'Luxury White Rose Wall', price: '$180.00', image: '/images/secondary/whiterose.png' },
      { name: 'Signature Red Rose Wall', price: '$180.00', image: '/images/secondary/redrose.png' },
      { name: 'Gold Rose Backdrop', price: '$180.00', image: '/images/secondary/goldbackdrop.png' },
      { name: 'Shimmer Wall', price: '$180.00', image: '/images/secondary/shimmer.png' },
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
    slug: '360-camera-add-ons',
    name: '360 Camera Add-ons',
    description:
      'Premium add-ons to enhance your 360° Camera Experience.',
    category: 'signature',
    image: '/images/360.PNG',
    pricingType: 'variants',
    variants: [
      { name: 'Luxury White Rose Wall', price: '$180.00', image: '/images/secondary/whiterose.png' },
      { name: 'Signature Red Rose Wall', price: '$180.00', image: '/images/secondary/redrose.png' },
      { name: 'Gold Rose Backdrop', price: '$180.00', image: '/images/secondary/goldbackdrop.png' },
      { name: 'Shimmer Wall', price: '$180.00', image: '/images/secondary/shimmer.png' },
    ],
    features: [
      'Premium backdrops',
      'Professional installation',
      'Custom branding',
    ],
    note: 'HST extra. Perfect complement to the 360 Camera Experience.',
  },
  {
    slug: 'mirror-photobooth',
    name: 'Mirror Photo Booth',
    description:
      '2 Hours / Attendant\nRed carpet & stanchions included\n\nFun, interactive experience. Perfect for birthdays, weddings, corporate events & celebrations. Features an interactive full-length mirror with instant picture captures for guests. Additional hours beyond the 2-hour rental are $125 per hour.',
    category: 'signature',
    image: '/images/mirrorp.png',
    objectPosition: 'center 40%',
    pricingType: 'tiered',
    tiers: [
      { label: '2 Hours', price: '$350.00' },
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
      { name: 'Red Carpet & Red Ropes - Included', price: '$0.00', image: '/images/secondary/carpet-red.png' },
      { name: 'Luxury White Rose Wall', price: '$180.00', image: '/images/secondary/whiterose.png' },
      { name: 'Signature Red Rose Wall', price: '$180.00', image: '/images/secondary/redrose.png' },
      { name: 'Gold Rose Backdrop', price: '$180.00', image: '/images/secondary/goldbackdrop.png' },
      { name: 'Shimmer Wall', price: '$180.00', image: '/images/secondary/shimmer.png' },
      { name: 'Digital Print', price: '$80.00', image: '/images/secondary/digital.png' },
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
      { name: 'Mini Garland — 7 ft', price: 'Inquire for pricing', image: '/images/secondary/mamatobegarland.JPG', description: '7-Foot Mini Balloon Garland featuring three balloon colours.' },
      { name: 'Classic Garland — 10 ft', price: 'Inquire for pricing', image: '/images/secondary/happy-birth-garland.png', description: '10-Foot Classic Balloon Garland featuring three balloon colours.' },
      { name: 'Deluxe Garland — 12 ft', price: 'Inquire for pricing', image: '/images/secondary/garland-12.jpg', description: '12-Foot Deluxe Balloon Garland featuring four balloon colours.' },
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
    image: '/images/true north party rentals-06.jpg',
    pricingType: 'variants',
    variants: [
      { name: '"Will You Marry Me" Package', price: '$650.00', image: '/images/secondary/marry.png', description: '"Will You Marry Me" White Marquee Letters featuring 4-foot freestanding letters with warm LED lighting, with optional marquee ring or red rose heart add-ons.' },
      { name: 'Proposal Package', price: '$400.00', image: '/images/true north party rentals-06.jpg', description: 'Includes Red Rose Heart Backdrop, "Will You Marry Me?" LED Neon Sign, Red Carpet Walkway Runner, Hurricane Vases with LED Candles (aisle setup), and Ambient Lighting.' },
      { name: 'LED Furniture Décor Package', price: '$750.00', image: '/images/secondary/ledL.png', description: 'This LED Lounge Furniture Package includes LED curved benches, LED cruiser tables, and LED podium barstools, featuring multicolor LED lighting, cordless battery-powered design, and weather-resistant materials.' },
    ],
    features: ['All-inclusive setup', 'Premium décor', 'Delivery & breakdown'],
    note: 'HST extra where applicable.',
  },

  // ─── DECOR ────────────────────────────────────────────────────────────────
  {
    slug: 'backdrop-packages',
    name: 'Backdrop Packages',
    description:
      'Stunning backdrop options for any theme — from elegant florals to beloved characters and custom designs.',
    category: 'decor',
    image: '/images/secondary/avengers.JPG',
    pricingType: 'variants',
    variants: [
      {
        name: 'Shimmer Backdrop Package - Silver',
        price: '$200.00',
        image: '/images/secondary/shrimmer-silver.jpg',
        description: '8×10 ft shimmer backdrop panel with hardware. Silver finish. Includes hardware.'
      },
      {
        name: 'Shimmer Backdrop Package - Gold',
        price: '$200.00',
        image: '/images/secondary/ShimmerPanelbd.png',
        description: '8×10 ft shimmer backdrop panel with hardware. Gold finish. Includes hardware.'
      },
      { name: 'Red Rose Backdrop Package', price: '$200.00', image: '/images/secondary/redbackdrop.png', description: 'Backdrop stand with a red rose backdrop panel featuring realistic floral textures. Includes hardware.' },
      { name: 'White Rose Backdrop Package', price: '$200.00', image: '/images/secondary/whiterose2.jpeg', description: 'Backdrop stand with a white rose backdrop panel featuring realistic floral textures. Includes hardware.' },
      { name: 'Grass Backdrop Package', price: '$200.00', image: '/images/secondary/grassbackdrop.png', description: 'Grass wall panel with a vibrant green finish and a backdrop stand. Includes hardware.' },
      { name: 'White Circle Backdrop Package', price: '$150.00', image: '/images/secondary/whitebackdrop.png', description: 'Includes circular backdrop stands with premium white covers. Additional items inquire for.' },
      {
        name: 'Summer Floral Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/summerbackdrop.png',
        description: 'Full floral backdrop panel with summer blooms made from artificial flowers. Additional items inquire for.'
      },
      { name: 'Gold Metal Backdrop Package', price: '$150.00', image: '/images/secondary/goldbackdrop.png', description: 'Gold metal backdrop stand with a sleek reflective finish. Additional items inquire for.' },
      {
        name: 'Frozen Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/frozenbackdrop.png',
        description: 'Circular backdrop stands with Frozen-themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Mickey Mouse Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/mickybackdrop.png',
        description: 'Circular backdrop stands with Mickey Mouse–themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Batman Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/batmanabackdrop.png',
        description: 'Circular backdrop stands with Batman-themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Trolls Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/trollsbackdrop.png',
        description: 'Circular backdrop stands with Trolls-themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Disney Princess Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/princessbackdrop.png',
        description: 'Circular backdrop stands with princess-themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Spider-Man 1 Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/spiderman1.png',
        description: 'Circular backdrop stands with Spiderman-themed covers. Optional add-on: +$50 for cake stands.'
      },
      {
        name: 'Spider-Man 2 Backdrop Package',
        price: '$150.00',
        image: '/images/secondary/spiderman2.png',
        description: 'Circular backdrop stands with Spiderman-themed covers. Optional add-on: +$50 for cake stands.'
      },
      { name: 'Avengers Backdrop Package', price: '$150.00', image: '/images/secondary/avengers2.png', description: 'Circular backdrop stands with Avengers-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Soccer Backdrop Package', price: '$150.00', image: '/images/secondary/soccerbackdrop.png', description: 'Circular backdrop stands with soccer-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Mermaid Backdrop Package', price: '$150.00', image: '/images/secondary/mermaidbd.png', description: 'Circular backdrop stands with mermaid-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Moana Backdrop Package', price: '$150.00', image: '/images/secondary/Moanabd.png', description: 'Circular backdrop stands with Moana-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Mr & Mrs Backdrop Package', price: '$150.00', image: '/images/secondary/mr&msbd.png', description: 'Circular backdrop stands with "Mr & Mrs" themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Boss Baby Backdrop Package', price: '$150.00', image: '/images/secondary/BossBabybd.png', description: 'Circular backdrop stands with Boss Baby–themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Toy Story Backdrop Package', price: '$150.00', image: '/images/secondary/toybd.png', description: 'Circular backdrop stands with Toy Story–themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Marble Backdrop Package', price: '$150.00', image: '/images/secondary/marblebd.png', description: 'Circular backdrop stands with marble-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Pink Floral Backdrop Package', price: '$150.00', image: '/images/secondary/floralbd.png', description: 'Full pink floral backdrop panel with pink and blush-toned flowers and a backdrop stand.' },
      { name: 'Blue Floral Backdrop Package', price: '$150.00', image: '/images/secondary/blueforalbd.png', description: 'White modern arch frame with a blue and white faux floral arrangement.' },
      { name: 'Safari Backdrop Package', price: '$150.00', image: '/images/secondary/safaribd.png', description: 'Circular backdrop stands with safari-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'OM Backdrop Package', price: '$150.00', image: '/images/secondary/ombd.jpeg', description: 'Circular backdrop stands with OM-themed covers. Optional add-on: +$60 for candles shown in image.' },
      { name: 'Minnie Mouse Backdrop Package', price: '$150.00', image: '/images/secondary/minnie.png', description: 'Circular backdrop stands with Minnie Mouse–themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Basketball Backdrop Package', price: '$150.00', image: '/images/secondary/basketballbd.png', description: 'Circular backdrop stands with basketball-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Tangled Backdrop Package', price: '$150.00', image: '/images/secondary/tangledbd.png', description: 'Circular backdrop stands with Tangled-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Fortnite Backdrop Package', price: '$150.00', image: '/images/secondary/fortnitebd.png', description: 'Circular backdrop stands with Fortnite-themed covers. Optional add-on: +$50 for cake stands.' },
      { name: 'Arched Panel Backdrop (Custom Wording)', price: '$150.00', image: '/images/secondary/archedbd.png', description: '7 ft white arched panel with custom wording. Additional items inquire for.' },
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
    image: '/images/secondary/happybirth.png',
    pricingType: 'variants',
    variants: [
      {
        name: 'Marquee Letters',
        price: '$50.00',
        image: '/images/secondary/Aletter.png',
        description: '3.2ft white marquee letter (A–Z) with built-in lights.',
      },
      {
        name: 'Marquee Numbers',
        price: '$50.00',
        image: '/images/secondary/1number.png',
        description: '3.2ft white marquee number (0–9) with built-in lights.',
      },
      { name: 'Marquee Heart', price: '$70.00', image: '/images/secondary/heartmarq.png', description: '3.2ft white marquee heart with built-in lights.' },
      { name: 'Marquee – Ring', price: '$50.00', image: '/images/secondary/ring.png' },
      { name: 'Marquee – BABY (Word Set)', price: '$125.00', image: '/images/secondary/babymarq.png', description: '3.2ft white marquee letters with lights spelling BABY.' },
      { name: '"Will You Marry Me" Neon Sign', price: '$80.00', image: '/images/secondary/marry-sign.png', description: '"Will You Marry Me" LED neon sign with bright white cursive lighting.' },
      { name: '"Bride to Be" Neon Sign', price: '$80.00', image: '/images/secondary/bridemarquee.png', description: '"Bride to Be" LED neon sign with warm white cursive lighting.' },
      { name: '"Congrats" Neon Sign', price: '$70.00', image: '/images/secondary/congrats.png', description: '"Congrats" LED neon sign with warm white cursive lighting.' },
      { name: '"Happy Birthday" Neon Sign', price: '$70.00', image: '/images/secondary/happybirth.png', description: '"Happy Birthday" LED neon sign with cursive lighting.' },
      { name: '"Happy Valentine\'s Day" Neon Sign', price: '$70.00', image: '/images/secondary/happyv.png', description: '"Happy Valentine\'s" LED neon sign with cursive lighting.' },
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
    name: 'Decor & Props',
    description:
      'Elegant props and decor pieces to elevate any event space with a personal touch',
    category: 'decor',
    image: '/images/secondary/cherrydecor.jpeg',
    pricingType: 'variants',
    variants: [
      { name: 'Cherry Blossom Tree', price: '$250.00', image: '/images/secondary/cherrydecor.jpeg', description: '10 ft lifelike cherry blossom tree in pink or white with a freestanding base.' },
      { name: 'Giant Teddy Bear', price: '$50.00', image: '/images/secondary/teddy.png', description: 'Giant light brown teddy bear with soft plush material.' },
      { name: 'Solid Wood "BABY" Blocks', price: '$80.00', image: '/images/secondary/wood-baby.png', description: 'Solid wood baby blocks with a smooth natural finish spelling B-A-B-Y. Approximate 16" each.' },
      { name: 'Red Rose Heart', price: '$250.00', image: '/images/secondary/heart-display.jpg', description: 'Red rose heart arrangement with a sturdy stand.' },
      { name: 'White Rose Heart', price: '$250.00', image: '/images/secondary/white-heart-display.jpeg', description: 'White rose heart arrangement with a sturdy stand.' },
      { name: 'Golden Heart', price: '$200.00', image: '/images/secondary/golden-heart.png', description: 'Heart-shaped gold frame mirror with a reflective finish.' },
      { name: 'White Arch', price: '$100.00', image: '/images/secondary/white-arch.png', description: '7 ft white arch frame.' },
      { name: 'Champagne Wall', price: '$125.00', image: '/images/secondary/cham-wall.png', description: 'White champagne wall with a sleek finish and built-in glass holders.' },
      { name: 'Charcuterie Cart', price: '$200.00', image: '/images/secondary/dessertcart.jpg', description: 'White charcuterie cart with wood panel accents and built-in LED lighting.' },
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
    image: '/images/secondary/RedCarpetVelvetRope.png',
    pricingType: 'variants',
    variants: [
      { name: 'Red Carpet', price: '$60.00', image: '/images/secondary/red-carpet.png', description: '8 ft red carpet runner.' },
      { name: 'Velvet Ropes', price: '$40.00', image: '/images/secondary/velvet-ropes.png', description: 'Velvet ropes with chrome stanchion stands. Includes 4 velvet ropes.' },
      { name: 'Red Carpet + Velvet Ropes', price: '$100.00', image: '/images/secondary/RedCarpetVelvetRope.png', description: '8 ft red carpet runner with velvet ropes and chrome stanchion stands.' },
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
      { name: 'Standard Folding Chairs', price: '$2.00', image: '/images/secondary/standard-chair.png' },
      { name: 'Spandex Chair Covers', price: '$3.00', image: '/images/secondary/SpandexChairCovers.png', description: 'Available in black or white.' },
      { name: 'Black Chiavari Chairs', price: '$7.00 each', image: '/images/secondary/BlackChiavariChairs.jpg', description: 'Includes seat cushions.' },
      { name: 'Clear Chiavari Chairs', price: '$7.00 each', image: '/images/secondary/ClearChiavariChairs.png', description: 'Includes seat cushions.' },
      { name: 'Gold Chiavari Chairs', price: '$7.00 each', image: '/images/secondary/GoldChiavariChairs.png', description: 'Includes seat cushions.' },
      { name: 'Crossback Harvest Chairs', price: '$9.50 each', image: '/images/secondary/CrossbackHarvestChairs.jpg', description: 'Cross-back harvest chair with a wooden frame and seat.' },
      { name: 'Fruitwood Folding Chairs', price: '$8.00 each', image: '/images/secondary/FruitwoodFoldingChairs.jpg' },
      { name: 'Throne Chair – Gold', price: '$150.00', image: '/images/secondary/ThroneChair-Gold.png', description: 'Gold high-back throne chair with an ornate frame and cushioned seat.' },
      { name: 'Throne Chair – Silver', price: '$150.00', image: '/images/secondary/ThroneChair-silver.jpg', description: 'Silver high-back throne chair with an ornate frame and cushioned seat.' },
      { name: 'Boho Peacock Chair', price: '$100.00', image: '/images/secondary/BohoPeacockChair.png', description: 'Boho peacock chair with a woven rattan frame and high back design.' },
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
      { name: 'Rectangle Tables – 4-6 ft', price: '$10.00', image: '/images/secondary/table-4.jpeg', description: 'Rectangular table available in 4 ft or 6 ft size.' },
      { name: 'Rectangle Tables – 8 ft', price: '$12.00', image: '/images/secondary/table-8.jpeg', description: 'Rectangular table available in 8 ft size.' },
      { name: 'Round Tables', price: '$12.50', image: '/images/secondary/round-table.png', description: 'Round tables available in 4 ft or 5 ft size.' },
      { name: 'Cruiser Tables', price: '$15.00', image: '/images/secondary/crusier-table.jpeg', description: 'Cruiser cocktail table with a tall round surface and sturdy base.' },
      { name: 'Round Table Cloths', price: '$16.00', image: '/images/secondary/RoundTableCloths.png', description: 'Round tablecloth designed to fit standard round tables.' },
      { name: 'Cruiser Table Cloths', price: '$4.00', image: '/images/secondary/CruiserTable-cloth.png', description: 'High-top cruiser tablecloth designed to fit standard cocktail/cruiser tables.' },
      { name: 'Rectangle Table Cloths (4 ft)', price: '$10.00', image: '/images/secondary/Rectangle-Table-Cloths.png' },
      { name: 'Rectangle Table Cloths (6 ft)', price: '$13.00', image: '/images/secondary/Rectangle-Table-Cloths.png' },
      { name: 'Rectangle Table Cloths (8 ft)', price: '$16.00', image: '/images/secondary/Rectangle-Table-Cloths.png' },
      { name: 'Cylinder Decor Tables', price: '$150.00', image: '/images/secondary/CylinderDecorTables.png', description: 'Available in blue, white, pink, or gold.' },
    ],
    features: [
      '60" & 72" rounds',
      '6ft & 8ft rectangles',
      'Cocktail tables',
      'Folding tables',
    ],
    note: 'All prices in CAD. HST extra. Inquire about your choice of colour in the form as well.',
  },

  // --- GLOW FURNITURE --------------------------------------------------------
  {
    slug: 'glow-furniture',
    name: 'Glow Furniture',
    description:
      'LED illuminated furniture for stunning event ambiance — bars, tables, benches, and barstools with multicolor LED lighting, cordless battery-powered design, and weather-resistant materials.',
    category: 'glow-furniture',
    image: '/images/secondary/led-tables-chairs.png',
    pricingType: 'variants',
    variants: [
      { name: 'LED Curved Bench', price: '$55.00', image: '/images/secondary/LEDCurvedBench.png', description: 'Illuminated seating surface and base.' },
      { name: 'LED Barstool', price: '$40.00', image: '/images/secondary/LEDBarstool.png', description: 'LED podium bar stool with illuminated base and seat.' },
      { name: 'LED Bar', price: '$200.00', image: '/images/secondary/led-bar.jpg', description: 'Curved LED bar with illuminated front panel and display shelves for bottles and glassware.' },
      { name: 'LED Lounge Table', price: '$60.00', image: '/images/secondary/LEDLoungeTable.png', description: 'LED lounge cocktail table with illuminated base and top.' },
    ],
    features: [
      'LED Bar',
      'LED Lounge Table',
      'LED Curved Bench',
      'LED Barstool',
    ],
    note: 'All prices in CAD. HST extra.',
  },

  // --- KIDS FURNITURE --------------------------------------------------------
  {
    slug: 'kids-furniture',
    name: 'Kids Furniture',
    description:
      'Child-sized chairs and tables perfect for kids parties and family events. Lightweight yet sturdy, with matching seat cushions included on chairs.',
    category: 'kids-furniture',
    image: '/images/secondary/kids-table-chairs.png',
    pricingType: 'variants',
    variants: [
      { name: 'Kids Chiavari Chair - Blue', price: '$7.00', image: '/images/secondary/KidsChiavariChairblue.png', description: 'Blue chiavari chair sized for children. Includes seat cushion.' },
      { name: 'Kids Chiavari Chair - Pink', price: '$7.00', image: '/images/secondary/KidsChiavariChairpink.png', description: 'Pink chiavari chair sized for children. Includes seat cushion.' },
      { name: 'Kids Chiavari Chair - White', price: '$7.00', image: '/images/secondary/KidsChiavariChairwhite.png', description: 'White chiavari chair sized for children. Includes seat cushion.' },
      { name: 'Kids Rectangle Table (6ft)', price: '$20.00', image: '/images/secondary/KidsRectangleTable.png', description: 'Child-height 6-foot rectangle table. Sturdy folding design.' },
    ],
    features: [
      'Chiavari chairs',
      'Rectangle tables',
      'Child-sized',
      'Multiple colors',
    ],
    note: 'All prices in CAD. HST extra.',
  },

  // --- STRUCTURES ------------------------------------------------------------
  {
    slug: 'inflatables',
    name: 'Inflatables & Bounce Houses',
    description:
      'Fun and safe inflatable entertainment for kids and adults — perfect for backyard parties and large events.',
    category: 'structures',
    image: '/images/secondary/WhiteInflatableHouse.png',
    pricingType: 'variants',
    variants: [
      { name: 'Inflatable Bounce House', price: '$360.00', description: 'All-white inflatable house made from durable, weather-resistant material.', image: '/images/secondary/WhiteInflatableHouse.png' },
      { name: 'Inflatable Igloo', price: '$200.00', description: 'White and clear inflatable igloo dome made from weather-resistant material.', image: '/images/secondary/InflatablIgloo.png' },
      { name: 'Inflatable Party House', price: '$800.00', description: 'Black inflatable party house made from durable, weather-resistant material.', image: '/images/secondary/InflatablePartyHouse.png' },
    ],
    features: [
      'Bouncy houses',
      'Inflatable igloos',
      'Party houses',
      'Safe & clean',
    ],
    note: 'All prices in CAD. HST extra. Delivery & setup additional charge.',
  },
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug);
}
