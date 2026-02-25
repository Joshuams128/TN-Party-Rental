# True North Party Rentals

A modern, responsive website for True North Party Rentals - a premier event rental company based in Scarborough, Ontario.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first CSS framework
- **Resend** - Email API for contact form

## Features

- 🎨 Modern, elegant design with gold accents (#D4AF37)
- 📱 Fully responsive mobile-first design
- 📧 Contact form with email integration via Resend
- 🔍 SEO-optimized with metadata
- 🎯 7 main pages + custom 404
- ⚡ Fast performance with Next.js 14

## Pages

- **Home** (`/`) - Hero section, services overview, CTAs
- **Inventory** (`/inventory`) - Available rental items and equipment
- **Packages** (`/packages`) - Pre-curated event packages
- **Event Design and Styling** (`/event-design-styling`) - Event design and styling services
- **Corporate** (`/corporate`) - Corporate event solutions
- **About** (`/about`) - Company story and team
- **Contact** (`/contact`) - Contact form with location info
- **404** - Custom not found page

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
The `.env.local` file has been created. Update it with your Resend API key:
```env
RESEND_API_KEY=your_resend_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `RESEND_API_KEY` - Your Resend API key for email functionality

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in Vercel project settings
4. Deploy!

### Vercel Configuration

The project includes automatic configuration for Vercel. Simply:
- Connect your GitHub repository
- Configure environment variables
- Deploy

## Project Structure

```
TN-Party-Rental/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts          # Contact form API endpoint
│   ├── about/
│   │   └── page.tsx              # About page
│   ├── contact/
│   │   └── page.tsx              # Contact page
│   ├── corporate/
│   │   └── page.tsx              # Corporate events page
│   ├── event-design-styling/
│   │   └── page.tsx              # Event design and styling page
│   ├── inventory/
│   │   └── page.tsx              # Inventory page
│   ├── packages/
│   │   └── page.tsx              # Packages page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── components/
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Site footer
│   └── ContactForm.tsx           # Contact form component
├── public/
│   └── images/                   # Image assets
├── .env.local                    # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Customization

### Colors

The gold accent color is defined in `tailwind.config.ts`:
```typescript
colors: {
  gold: {
    DEFAULT: '#D4AF37',
    light: '#F4E4B1',
    dark: '#B8941F',
  },
}
```

### Contact Information

Update contact details in:
- `components/Footer.tsx`
- `app/contact/page.tsx`
- `app/api/contact/route.ts`

### Email Configuration

To use Resend for the contact form:
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get your API key
4. Update the `from` email in `app/api/contact/route.ts`
5. Add your API key to `.env.local`

## License

Copyright © 2026 True North Party Rentals. All rights reserved.

## Support

For questions or support, contact info@truenorthpartyrentals.com