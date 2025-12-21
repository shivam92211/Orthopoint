# Quick Start Guide

Get your Orthopaedic Instruments Store up and running in minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB database (local or Atlas account)
- [ ] Cloudinary account (free tier works)
- [ ] WhatsApp number (optional, for Buy button)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy the example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your credentials:

#### MongoDB Setup
- **Option A - MongoDB Atlas** (Recommended for beginners):
  1. Go to [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
  2. Create a free cluster
  3. Create a database user
  4. Whitelist your IP (or use `0.0.0.0/0` for development)
  5. Get connection string and add to `MONGODB_URI`

- **Option B - Local MongoDB**:
  ```
  MONGODB_URI=mongodb://localhost:27017/instruments
  ```

#### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Add to `.env.local`

#### NextAuth Secret
Generate a secret key:
```bash
openssl rand -base64 32
```
Add it to `NEXTAUTH_SECRET`

#### WhatsApp (Optional)
Add your WhatsApp number with country code (e.g., `919876543210`)

### 3. Create Admin User

```bash
npm run seed-admin
```

This will create an admin account with:
- Email: from `ADMIN_EMAIL` in `.env.local`
- Password: from `ADMIN_PASSWORD` in `.env.local`

### 4. Seed Categories (Optional)

```bash
npm run seed-categories
```

This adds default instrument categories (Guitars, Keyboards, Drums, etc.)

### 5. Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## Next Steps

### Access Admin Panel

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with your admin credentials
3. You'll be redirected to the dashboard

### Add Your First Instrument

1. Click "Add New Instrument"
2. Fill in details:
   - Name (e.g., "Yamaha Acoustic Guitar")
   - Category (e.g., "Guitars")
   - Description
   - Price (e.g., 15000)
   - Upload images
3. Click "Create Instrument"

### View on Public Site

1. Go back to [http://localhost:3000](http://localhost:3000)
2. Your instrument will appear on the homepage
3. Click to view details
4. Test the WhatsApp button

## Common Issues

### MongoDB Connection Error
- **Issue**: Can't connect to MongoDB
- **Solution**:
  - Check `MONGODB_URI` format
  - If using Atlas, whitelist your IP
  - Check database user has correct permissions

### Cloudinary Upload Fails
- **Issue**: Images not uploading
- **Solution**:
  - Verify all three Cloudinary credentials
  - Check API key is active
  - Try re-copying from Cloudinary dashboard

### Admin Login Not Working
- **Issue**: Can't login to admin panel
- **Solution**:
  - Run `npm run seed-admin` again
  - Check `.env.local` has correct email/password
  - Clear browser cookies

### WhatsApp Button Not Working
- **Issue**: WhatsApp link opens but no message
- **Solution**:
  - Check `WHATSAPP_PHONE_NUMBER` format (include country code)
  - Format should be: `919876543210` (no spaces, +, or -)

## Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

See [README.md](README.md) for detailed deployment instructions.

## Project Structure Overview

```
├── app/
│   ├── (public)/           # Customer-facing pages
│   ├── admin/              # Admin panel
│   └── api/                # Backend API routes
├── components/             # React components
├── lib/                    # Utilities & config
├── models/                 # Database models
└── types/                  # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed-admin` - Create/update admin user
- `npm run seed-categories` - Add default categories

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Review error messages in terminal
- Check browser console for frontend errors
- Ensure all environment variables are set correctly

## Success! 🎉

You should now have:
- ✅ A working website at localhost:3000
- ✅ Admin access at localhost:3000/admin
- ✅ Ability to add/edit/delete instruments
- ✅ Image uploads working
- ✅ WhatsApp integration active

Start adding your instruments and customize as needed!
