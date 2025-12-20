# Deployment Guide

Complete guide to deploying your Surgical Instruments Store to production.

## Option 1: Vercel (Recommended)

Vercel is created by the Next.js team and provides the best experience for Next.js apps.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- MongoDB Atlas cluster (free tier available)
- Cloudinary account (free tier available)

### Step 1: Prepare Your Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Surgical Instruments Store"
```

2. Create a new repository on GitHub:
   - Go to github.com
   - Click "New Repository"
   - Name it "surgical-instruments-store"
   - Don't initialize with README (you already have one)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/surgical-instruments-store.git
git branch -M main
git push -u origin main
```

### Step 2: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create database user:
   - Database Access → Add New Database User
   - Choose password authentication
   - Save username and password securely
4. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Vercel IPs specifically
5. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your user's password
   - Replace `<dbname>` with `instruments`

Example:
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/instruments?retryWrites=true&w=majority
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. Add Environment Variables:
   Click "Environment Variables" and add:

```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/instruments

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-project.vercel.app

WHATSAPP_PHONE_NUMBER=919XXXXXXXXX

ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
```

6. Click "Deploy"

### Step 4: Post-Deployment Setup

1. Wait for deployment to complete (2-3 minutes)

2. Note your deployment URL (e.g., `https://surgical-instruments-store.vercel.app`)

3. Update `NEXTAUTH_URL` in Vercel:
   - Go to Project Settings → Environment Variables
   - Edit `NEXTAUTH_URL` to match your deployment URL
   - Redeploy

4. Create admin user:
   - Option A: Use Vercel CLI
   ```bash
   vercel env pull .env.local
   npm run seed-admin
   ```

   - Option B: Create a temporary API route in your deployed app
   - Option C: Use MongoDB Compass to manually insert admin user (password must be bcrypt hashed)

5. Seed categories:
   ```bash
   npm run seed-categories
   ```

### Step 5: Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (5-60 minutes)
5. Update `NEXTAUTH_URL` to your custom domain
6. Redeploy

---

## Option 2: AWS (Advanced)

### Prerequisites
- AWS account
- Basic AWS knowledge (EC2, RDS, S3)

### Architecture
- EC2 instance for Next.js app
- MongoDB Atlas or AWS DocumentDB
- Cloudinary for images
- Route 53 for DNS (optional)
- Load Balancer (optional, for scaling)

### Deployment Steps

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or t3.small
   - Configure security groups (ports 22, 80, 443, 3000)

2. **Connect and Setup:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

3. **Deploy Application:**
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/surgical-instruments-store.git
cd surgical-instruments-store

# Install dependencies
npm install

# Create .env.local file
nano .env.local
# Add your environment variables

# Build
npm run build

# Start with PM2
pm2 start npm --name "instruments-store" -- start
pm2 startup
pm2 save
```

4. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/instruments-store
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/instruments-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option 3: DigitalOcean App Platform

1. Create DigitalOcean account
2. Go to App Platform
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add environment variables
6. Deploy

---

## Option 4: Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Add environment variables
5. Deploy

---

## Post-Deployment Checklist

### Security
- [ ] Change default admin password
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Regular security updates

### Performance
- [ ] Enable image optimization
- [ ] Configure CDN (Cloudinary handles this)
- [ ] Monitor application performance
- [ ] Set up error tracking (Sentry)
- [ ] Configure caching headers

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error logging
- [ ] Monitor database performance
- [ ] Track user analytics
- [ ] Set up alerts for downtime

### Backup
- [ ] Enable MongoDB automated backups
- [ ] Backup Cloudinary assets
- [ ] Document recovery procedures
- [ ] Test backup restoration

---

## Environment Variables for Production

```env
# Production MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/instruments

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# NextAuth (CRITICAL - Must be secure!)
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://yourdomain.com

# WhatsApp
WHATSAPP_PHONE_NUMBER=919876543210

# Admin (Only for seeding, remove after first admin created)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=VerySecurePassword123!@#
```

---

## Scaling Considerations

### When to Scale
- More than 10,000 visitors/month
- Response times > 2 seconds
- Database queries slow
- Image loading slow

### How to Scale

**Horizontal Scaling:**
- Deploy multiple instances behind load balancer
- Use Vercel's automatic scaling
- Redis for session storage

**Database:**
- Upgrade MongoDB Atlas tier
- Add read replicas
- Implement database indexes (already done)

**Images:**
- Cloudinary handles this automatically
- Configure auto-optimization
- Use responsive images

**Caching:**
- Implement Redis for API responses
- Configure CDN caching
- Use Next.js ISR (Incremental Static Regeneration)

---

## Troubleshooting Production Issues

### Build Fails
```bash
# Check environment variables
vercel env ls

# Check build logs
vercel logs

# Test build locally
npm run build
```

### Database Connection Issues
- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Verify database user credentials
- Check network connectivity

### Image Upload Fails
- Verify all 3 Cloudinary credentials
- Check API key permissions
- Verify upload preset (if used)
- Check file size limits

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches deployment
- Clear browser cookies
- Check session configuration

---

## Maintenance

### Weekly
- Check error logs
- Monitor database size
- Review user activity

### Monthly
- Update dependencies
- Review security advisories
- Backup verification
- Performance review

### Quarterly
- Security audit
- Feature review
- User feedback analysis
- Infrastructure optimization

---

## Cost Estimation

### Free Tier (Good for starting)
- Vercel: Free (hobby plan)
- MongoDB Atlas: Free (M0, 512MB)
- Cloudinary: Free (25GB storage, 25GB bandwidth)
- **Total: $0/month** (limits apply)

### Production (Small Business)
- Vercel: $20/month (Pro)
- MongoDB Atlas: $9/month (M10)
- Cloudinary: $89/month (Plus plan)
- Custom domain: $12/year
- **Total: ~$118/month**

### Enterprise
- Vercel: Custom pricing
- MongoDB Atlas: $57+/month
- Cloudinary: Custom pricing
- **Total: Varies based on traffic**

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Good luck with your deployment! 🚀**
