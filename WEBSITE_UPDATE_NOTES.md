# Daddu's Biryani – website update (v3)

The admin panel (`/admin`), Supabase setup and database schema are unchanged.
No new npm packages were added.

## What's new
- **Home**: lattice-door intro (once per visit) → storefront video hero that folds into a card on scroll,
  pinned "four cities" scroll (Lucknowi / Hyderabadi / Kolkata / Mumbai), signature dish grid,
  party estimator, scrolling photo rows, reviews, map.
- **Menu**: full menu from your price sheet (143 items), search, veg-only switch, section tabs,
  "Order on WhatsApp" on every dish.
- **Menu downloads**: `public/downloads/daddus-biryani-menu.pdf` and `.xlsx`.
- **Gallery**: all real photos + video, lightbox with arrow keys.
- **Contact**: phone-first enquiry form with guests/date for party orders.
- **About / Blogs**: stock photos replaced with your dish photos.
- WhatsApp button, mobile Call/WhatsApp/Menu bar, scroll progress, SEO metadata + Restaurant schema.

## Where leads go
Every form writes to the existing `leads` table, so they appear in **/admin/leads**.
The **Service** column tells you the source:
`Menu download`, `Bulk order`, `Order for today`, `Party or bulk order`, `Office catering`, `Feedback`, `Something else`.
Email is optional on the new forms; an empty string is saved when it's left blank.
If Supabase is unreachable, the menu download still works (the lead is just not saved).

## Updating prices
1. Edit your master workbook as usual (only the "Table Rates" columns G/H/I of `Sheet6` are read).
2. Run:
   ```
   pip install openpyxl reportlab
   python scripts/extract_menu.py "path/to/Menu.xlsx"   # updates data/menu.json (website menu)
   python scripts/build_menu_files.py                    # rebuilds the PDF + Excel downloads
   ```
3. Commit and redeploy. The website, PDF and Excel all come from `data/menu.json`.

The extractor never reads aggregator prices, commission maths or other sheets.

## Changing business details
Phone, WhatsApp number, address, hours, rating and file paths live in `lib/site.ts`.

## Using Google Drive images
Share the file as "Anyone with the link", then:
```ts
import { driveImage } from '@/lib/site';
<Image src={driveImage('https://drive.google.com/file/d/FILE_ID/view')} ... />
```
`next.config.js` already allows `lh3.googleusercontent.com`.
Local files in `public/images/dishes/` load faster, so prefer them for key images.

## Please check
- Mutton Shami Kebab and Veg Shami Kebab portion sizes (sheet shows two prices with "2 pc" / "6 pc" labels).
- Opening hours: set to "11 AM – 11 PM, every day" in `lib/site.ts`; the old contact page said Sunday 12–10.
- Testimonials (`components/home/Testimonials.tsx`) and team names (`app/about/page.tsx`) are carried over
  from the old site; swap in real reviews and add team photos via the `image` field.
- WhatsApp links use +91 96196 11561.
