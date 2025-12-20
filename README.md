# Surgical Instruments Store

A full-stack e-commerce website for showcasing and selling surgical instruments, built with Next.js 14+, TypeScript, MongoDB, and Cloudinary.

## Features

### User-Facing Features
- 🎵 Browse instruments in a responsive grid layout
- 🔍 Search and filter by category, price range, and availability
- 📱 Mobile-first responsive design
- 🖼️ Image gallery for each instrument
- 💬 WhatsApp integration for purchases
- ⭐ Featured instruments highlighting

### Admin Panel Features
- 🔐 Secure authentication
- 📊 Dashboard with statistics
- ➕ Add new instruments with image upload
- ✏️ Edit and delete instruments
- 🏷️ Category management
- 📸 Multiple image upload to Cloudinary

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with shadcn/ui styling

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account
- WhatsApp Business number (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd orthopoint
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/instruments

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here_generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# WhatsApp
WHATSAPP_PHONE_NUMBER=919XXXXXXXXX

# Admin (for first time setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

5. Generate NextAuth secret:
```bash
openssl rand -base64 32
```

6. Create the first admin user:
```bash
npm run seed-admin
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
orthopoint/
├── app/
│   ├── (public)/                  # Public-facing pages
│   │   ├── page.tsx              # Homepage
│   │   └── instruments/
│   │       └── [id]/page.tsx     # Instrument details
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/
│   │   ├── instruments/
│   │   └── login/
│   └── api/                      # API routes
│       ├── auth/
│       ├── instruments/
│       ├── upload/
│       └── categories/
├── components/
│   ├── public/                   # Public components
│   ├── admin/                    # Admin components
│   └── ui/                       # UI components
├── lib/
│   ├── mongodb.ts               # Database connection
│   ├── cloudinary.ts            # Image upload config
│   ├── auth.ts                  # NextAuth config
│   └── utils.ts                 # Utility functions
├── models/                      # Mongoose models
│   ├── Instrument.ts
│   ├── Category.ts
│   └── Admin.ts
└── types/                       # TypeScript types
    └── index.ts
```

## Usage

### Admin Panel

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. Access dashboard at `/admin/dashboard`
4. Manage instruments at `/admin/instruments`

### Adding Instruments

1. Click "Add New Instrument" in admin panel
2. Fill in instrument details:
   - Name, category, description
   - Price and currency
   - Specifications (optional)
   - Upload images (drag & drop or select)
3. Mark as available/featured
4. Click "Create Instrument"

### Managing Categories

Categories are created automatically when you add instruments. You can also create them via the API:

```bash
POST /api/categories
{
  "name": "Guitars",
  "slug": "guitars",
  "description": "String instruments"
}
```

## API Endpoints

### Public Endpoints

- `GET /api/instruments` - Get all instruments (with filters)
- `GET /api/instruments/[id]` - Get single instrument
- `GET /api/categories` - Get all categories

### Protected Endpoints (Admin Only)

- `POST /api/instruments` - Create instrument
- `PUT /api/instruments/[id]` - Update instrument
- `DELETE /api/instruments/[id]` - Delete instrument
- `POST /api/upload` - Upload image to Cloudinary
- `POST /api/categories` - Create category

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Base URL of application | Yes |
| `WHATSAPP_PHONE_NUMBER` | WhatsApp number with country code | Optional |
| `ADMIN_EMAIL` | Initial admin email | For seeding |
| `ADMIN_PASSWORD` | Initial admin password | For seeding |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist Vercel IP addresses or use `0.0.0.0/0` (for development)
3. Create database user
4. Get connection string
5. Add to `MONGODB_URI` in Vercel

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from dashboard
3. Add to environment variables

## Features Roadmap

- [ ] Order management system
- [ ] Email notifications
- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Bulk CSV import
- [ ] PDF catalog generation
- [ ] Advanced analytics

## Security

- All admin routes protected by NextAuth.js middleware
- Passwords hashed with bcrypt
- Input validation with Zod (can be added)
- XSS protection enabled
- CORS configured
- Rate limiting (recommended for production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
