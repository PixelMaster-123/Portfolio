# Custom Domain & Free Deployment Guide for Pramod Ramakrishna's Portfolio

This guide explains how to host your new portfolio website **without any Wix branding or Wix subdomains**, completely free, and connect your own custom domain (e.g. `www.pramodramakrishna.com` or `pramodramakrishna.de` or `pramodr.dev`).

---

## Option 1: GitHub Pages (Recommended — 100% Free Forever)

GitHub Pages provides free fast hosting with free SSL (HTTPS) and custom domain support.

### Step 1: Push your project to GitHub
1. Create a free account on [github.com](https://github.com) if you haven't already.
2. Create a new repository, for example: `pramod-portfolio` or `rpramod27.github.io`.
3. In this directory (`C:\Users\Pramod\.gemini\antigravity\scratch\pramod-portfolio`), run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of custom portfolio website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/pramod-portfolio.git
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (on the left sidebar).
3. Under **Build and deployment** > **Source**, select `Deploy from a branch`.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your site is now live at `https://<your-username>.github.io/pramod-portfolio/`!

### Step 3: Connect your Custom Domain (No Wix in the URL!)
1. Buy your preferred domain name (e.g., from [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/), [Namecheap](https://www.namecheap.com), [Hostinger](https://www.hostinger.com), or [GoDaddy](https://www.godaddy.com)). Examples:
   - `pramodramakrishna.com`
   - `pramodramakrishna.de`
   - `pramodr.dev`
2. In GitHub repository **Settings** → **Pages** → **Custom domain**, type your domain name (e.g. `pramodramakrishna.com`) and click **Save**.
3. Check **Enforce HTTPS**.
4. In your domain registrar's DNS management dashboard, add these standard DNS records:

   **Apex Domain (e.g. `pramodramakrishna.com`):**
   - Type: `A` | Host: `@` | Value: `185.199.108.153`
   - Type: `A` | Host: `@` | Value: `185.199.109.153`
   - Type: `A` | Host: `@` | Value: `185.199.110.153`
   - Type: `A` | Host: `@` | Value: `185.199.111.153`

   **Subdomain (e.g. `www.pramodramakrishna.com`):**
   - Type: `CNAME` | Host: `www` | Value: `<your-username>.github.io.`

---

## Option 2: Vercel (Zero-Config & Super Fast)

Vercel provides edge hosting with automatic global CDN and zero configuration.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select your `pramod-portfolio` repository.
3. Click **Deploy**. Your site will be live instantly!
4. Go to **Settings** → **Domains** and enter `pramodramakrishna.com`.
5. Follow the one-step DNS pointer provided by Vercel.

---

## Option 3: Netlify or Cloudflare Pages

Both Netlify ([netlify.com](https://www.netlify.com)) and Cloudflare Pages ([pages.cloudflare.com](https://pages.cloudflare.com)) allow you to drag-and-drop the `pramod-portfolio` folder directly into their web dashboard to deploy in under 30 seconds with 100% free custom domain support and SSL certificates.

---

## Testing Locally on Your Computer

To preview your website locally:
```bash
npx serve .
# or simply double-click index.html in file explorer to open it in your browser!
```
