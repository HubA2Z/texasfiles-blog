# TexasFiles blog

The texasfiles.in website: a Next.js blog with a built-in admin panel (`/admin`) for writing and publishing articles.

## What's included

- **Public site:** Home, Guides & Articles (`/blog`, with search and categories), article pages, About, Contact (the form saves to your inbox in the admin panel), Privacy Policy, and Terms & Conditions.
- **SEO continuity:** every URL from the old Hostinger site works unchanged (no trailing slashes). `/sitemap.xml` uses the same format and priorities as before and adds new articles automatically. Also includes `robots.txt`, an RSS feed at `/rss.xml`, canonical tags, Open Graph tags, and Article/Breadcrumb structured data.
- **Admin panel (`/admin`):**
  - Email and password login, locked for 15 minutes after 5 failed attempts.
  - A rich text editor with image upload, paste, and drag-and-drop.
  - Drafts, publishing, and scheduled publishing.
  - Cover images, categories, SEO title and description, and a Google preview.
  - A contact-message inbox.
- **Safe URL changes:** if you change the URL of a published article, the old URL permanently redirects to the new one.
- **Migrated articles:** the 7 existing articles are imported automatically the first time the database starts up.

## Setup (one time)

1. **Upload to GitHub.** Unzip the file. On your empty `texasfiles-blog` repo page, click **uploading an existing file**. Drag everything *inside* the `texasfiles-blog` folder (not the folder itself) into the page, then click **Commit changes**.
2. **Import into Vercel.** Go to vercel.com → **Add New… → Project**, import `texasfiles-blog`, and leave the defaults.
3. **Add environment variables.** Before clicking Deploy, open **Environment Variables** and add:
   - `ADMIN_EMAIL`: the email address you'll log in with
   - `ADMIN_PASSWORD`: a long password
   - `SESSION_SECRET`: any random text, 32+ characters
   - `NEXT_PUBLIC_SITE_URL`: `https://texasfiles.in`

   Then click **Deploy**.
4. **Create a database.** In the project, open **Storage → Create → Neon (Postgres)**, choose the free plan, and connect it to the project. This adds `DATABASE_URL` for you.
5. **Enable image uploads.** In **Storage → Create → Blob**, create a store and connect it. This adds `BLOB_READ_WRITE_TOKEN` for you.
6. **Redeploy.** Go to **Deployments → ⋯ → Redeploy** so the new settings take effect.
7. **Test.** Open `your-project.vercel.app/admin`, log in, and check a few old URLs.
8. **Connect the domain.** In **Settings → Domains**, add `texasfiles.in` and `www.texasfiles.in`, then set the DNS records Vercel shows at your domain registrar or in Hostinger DNS.
9. **Check Google Search Console.** Submit `https://texasfiles.in/sitemap.xml` again.

## Updating the code later

Upload the changed files to the same GitHub repo. Vercel redeploys automatically.
