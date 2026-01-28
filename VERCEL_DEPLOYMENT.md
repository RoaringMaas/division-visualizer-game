# Vercel Deployment Guide - Division Visualizer Game

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Push your code to GitHub (public or private)
3. **Database** - Set up a MySQL database (e.g., PlanetScale, AWS RDS, or any MySQL provider)
4. **Manus OAuth Credentials** - Obtain from your Manus account

## Step 1: Prepare Your GitHub Repository

```bash
# If not already done, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: Division Visualizer Game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/division-visualizer-game.git
git push -u origin main
```

## Step 2: Create a MySQL Database

Choose one of these options:

### Option A: PlanetScale (Recommended - Free tier available)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Copy the connection string (looks like: `mysql://user:password@host/database?sslaccept=strict`)

### Option B: AWS RDS
1. Create a MySQL 8.0 instance
2. Get the connection string from AWS console

### Option C: Other MySQL Providers
- DigitalOcean Managed Databases
- Heroku ClearDB
- Any MySQL-compatible database

## Step 3: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**
5. Vercel will auto-detect the project settings

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel
```

## Step 4: Configure Environment Variables

After deployment starts, Vercel will ask for environment variables. Set these in the Vercel dashboard:

### Required Environment Variables

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your MySQL connection string | `mysql://user:pass@host/db?sslaccept=strict` |
| `JWT_SECRET` | Random string for session signing | Generate: `openssl rand -base64 32` |
| `VITE_APP_ID` | Your Manus OAuth App ID | From Manus dashboard |
| `OAUTH_SERVER_URL` | Manus OAuth server URL | `https://oauth.manus.im` |
| `OWNER_OPEN_ID` | Your Manus Open ID | From Manus account |
| `OWNER_NAME` | Your name | "John Doe" |
| `BUILT_IN_FORGE_API_URL` | Manus API URL | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Manus API key | From Manus dashboard |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | From Manus dashboard |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API URL | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL | `https://portal.manus.im` |
| `VITE_APP_TITLE` | Your app name | "Division Visualizer" |
| `VITE_APP_LOGO` | Logo URL or path | `/logo.png` |

### How to Set Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable from the table above
4. Click **Save**
5. Redeploy: Click **Deployments** → **Redeploy** on the latest deployment

## Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to update DNS records
4. Update OAuth redirect URIs in Manus dashboard to match your new domain

## Step 6: Update OAuth Redirect URI

After deployment, update your Manus OAuth settings:

1. Go to Manus dashboard
2. Find OAuth settings for this app
3. Update redirect URI to: `https://your-vercel-domain.vercel.app/api/oauth/callback`

## Troubleshooting

### "Page Unresponsive" or Raw Code Showing
- **Solution**: Check that all environment variables are set correctly
- Verify DATABASE_URL is accessible from Vercel
- Check build logs in Vercel dashboard

### Database Connection Error
- **Solution**: Ensure DATABASE_URL is correct
- For PlanetScale: Add `?sslaccept=strict` to connection string
- Test connection locally first with the same URL

### OAuth Login Not Working
- **Solution**: Verify OAuth redirect URI matches your Vercel domain
- Check VITE_OAUTH_PORTAL_URL is set correctly
- Ensure VITE_APP_ID matches your Manus app ID

### Build Fails
- **Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are installed: `pnpm install`
- Verify Node.js version is 18+ (Vercel default is 18.x)

## Monitoring and Logs

1. Go to Vercel dashboard → Your project
2. Click **Deployments** to see deployment history
3. Click on a deployment to see build logs
4. Click **Functions** to see serverless function logs

## Database Migrations

After first deployment, you need to run database migrations:

```bash
# This is done automatically during build via the build command
# But if you need to manually migrate:
pnpm db:push
```

## Performance Optimization

For better performance on Vercel:

1. **Enable Edge Caching**: Set cache headers in middleware
2. **Use CDN**: Vercel includes built-in CDN
3. **Monitor Function Duration**: Keep API responses under 10 seconds
4. **Database Connection Pooling**: Use PlanetScale or similar for better pooling

## Rollback

To rollback to a previous deployment:

1. Go to Vercel dashboard → Deployments
2. Find the deployment you want to rollback to
3. Click the **...** menu → **Promote to Production**

## Support

For issues with:
- **Vercel**: Check [vercel.com/docs](https://vercel.com/docs)
- **Database**: Contact your database provider
- **Manus OAuth**: Check Manus documentation or contact support
- **This Project**: Review the project README.md

---

**Last Updated**: January 2026
