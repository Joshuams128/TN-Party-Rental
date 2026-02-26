# Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Build is successful (`npm run build` passes)
- [x] No ESLint errors or TypeScript errors
- [x] All environment variables are documented in `.env.example`
- [x] `.gitignore` properly excludes sensitive files and `.env.local`
- [x] `next.config.mjs` is properly configured

## 🚀 Deployment Steps

### 1. Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Create Vercel Account

If you don't have one, create an account at https://vercel.com

### 3. Connect Your Repository

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Find and select your GitHub repository (`TN-Party-Rental`)
4. Vercel will auto-detect Next.js configuration

### 4. Configure Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

#### Required Variables:

- **`RESEND_API_KEY`** (from https://resend.com/api-tokens)
  - Scope: Production, Preview, Development
  
- **`STRIPE_SECRET_KEY`** (from Stripe Dashboard → API Keys)
  - Scope: Production, Preview, Development
  - ⚠️ Keep this private - never expose in client code

- **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** (from Stripe Dashboard → API Keys)
  - Scope: All (can be public)
  
- **`NEXT_PUBLIC_URL`** (your production domain)
  - Example: `https://truenorthpartyrentals.com`
  - Scope: Production only

### 5. Configure Production Settings (Recommended)

For production environment, use your live API keys (not test keys):

```
STRIPE_SECRET_KEY: sk_live_... (production key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_live_... (production key)
NEXT_PUBLIC_URL: https://yourdomain.com
```

For preview/development, use test keys:

```
STRIPE_SECRET_KEY: sk_test_... (test key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_... (test key)
```

### 6. Deploy

Click **Deploy** in the Vercel dashboard. The deployment will:

1. Install dependencies
2. Run build checks
3. Generate optimized production build
4. Deploy to Vercel's CDN

### 7. Test Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://tn-party-rental.vercel.app`)
2. Test contact form submission (check Resend email delivery)
3. Test Stripe checkout flow
4. Verify all images are loading correctly
5. Test responsive design on mobile

## 📧 Email Configuration (Resend)

The contact form uses **Resend** for email delivery.

### Update Sender Email:

In `/app/api/contact/route.ts`, update this line with your verified domain:

```typescript
from: 'True North Party Rentals <onboarding@resend.dev>', // ← Update this
```

After verification in Resend, use:

```typescript
from: 'True North Party Rentals <noreply@yourdomain.com>',
```

### Update Recipient Email:

Also update the recipient email address:

```typescript
to: ['info@truenorthpartyrentals.com'], // ← Update with actual business email
```

## 💳 Stripe Configuration

### Test Mode (Current):
- Uses test API keys from `.env.local`
- Test cards for checkout: Use `4242 4242 4242 4242` with any future expiry date

### Live Mode (Production):
1. Get live API keys from Stripe Dashboard
2. Set environment variables in Vercel production environment
3. Enable Stripe webhook for order notifications (if needed)

## 🔐 Security Checklist

- [x] Secret keys are in environment variables (not hardcoded)
- [x] `.env.local` is in `.gitignore`
- [x] Sensitive data never logged to console in production
- [x] HTTPS enforced (Vercel auto-configures)
- [x] API routes validate inputs properly

## 📱 Domain Configuration

To use a custom domain:

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `truenorthpartyrentals.com`)
3. Update DNS records according to Vercel's instructions
4. Update `NEXT_PUBLIC_URL` environment variable to your domain

## 🔍 Monitoring

After deployment:

1. **Vercel Analytics**: Dashboard shows real-time performance metrics
2. **Check Logs**: View deployment logs for any errors
3. **Monitor Email**: Ensure Resend is delivering emails
4. **Monitor Payments**: Check Stripe dashboard for transaction logs

## 🆘 Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build` locally
- Verify all environment variables are set
- Check `.env.example` for required variables

### Emails Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for bounce reports
- Verify sender email is verified in Resend
- Check logs in Vercel dashboard

### Stripe Checkout Issues
- Verify `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are correct
- Test with Stripe test keys first
- Check Stripe dashboard for webhook errors

### Images Not Loading
- Verify image paths are correct
- Check if remote image domains need to be added to `next.config.mjs`
- Clear Vercel cache and redeploy

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/learn/foundations/how-nextjs-works/deployment)
- [Resend Documentation](https://resend.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated**: February 26, 2026
