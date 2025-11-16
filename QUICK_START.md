# Quick Start Guide

## How to View the Admin Pages

The application now has routing set up with a navigation bar at the top. Here's how to access everything:

### Starting the Development Server

```bash
npm run dev
```

This will start the server (usually at http://localhost:5173)

### Available Pages

Once the dev server is running, you can access:

#### 1. **Contact Page** (Public)
- **URL**: `http://localhost:5173/`
- **Description**: Public-facing contact page with store locations and hours
- **Features**: Phone numbers, maps, hours of operation display

#### 2. **Admin Page** (Store Settings)
- **URL**: `http://localhost:5173/admin/store-settings`
- **Description**: Complete store management interface - ALL IN ONE PAGE
- **Features**:
  - Edit store name, phone, email, details
  - Manage full address and GPS coordinates
  - Set primary/alternate store designation
  - Toggle active/inactive status
  - **Integrated hours editor** (always visible on the same page)
  - All settings in one convenient location

### Navigation Bar

A navigation bar appears at the top of every page with quick links:
- 🏠 **Contact Page** - Public contact page
- 🏢 **Admin** - Complete store management (everything in one page)

Click any link to navigate between pages.

## First Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Migrations

Run these migrations in your Supabase SQL editor:

1. `supabase/migrations/20251109135513_create_contact_submissions_table.sql`
2. `supabase/migrations/20251115111518_create_store_settings_table.sql`
3. `supabase/migrations/20251116120000_add_store_fields.sql`

### 4. Seed Initial Data (Optional)

Add your store locations to the database:

```sql
INSERT INTO store_settings (location, store_name, phone, email, address, city, state, zip_code, country)
VALUES
  ('bonaqua', 'Bon Aqua', '(615) 815-6734', 'sales@rentnking.com', '10296 Highway 46', 'Bon Aqua', 'Tennessee', '37025', 'USA'),
  ('waverly', 'Waverly', '(615) 815-6734', 'sales@rentnking.com', 'Highway 70', 'Waverly', 'Tennessee', '37185', 'USA');
```

### 5. Start Development
```bash
npm run dev
```

Then open your browser to http://localhost:5173

## Testing the Admin Pages

### Test Admin Page
1. Navigate to `/admin/store-settings`
2. Select a store from the dropdown
3. Edit any field (name, phone, email, etc.)
4. Scroll down to see the hours editor (always visible)
5. Modify hours for any day
6. Use "Copy Monday to Weekdays" button for quick setup
7. Click "Save Hours" in the hours section
8. Click "Save Store Information" at the bottom to save other fields
9. Return to Contact Page (/) to see all changes live

## Common URLs

- **Home/Contact**: `http://localhost:5173/`
- **Admin (All Settings)**: `http://localhost:5173/admin/store-settings`

## Production Build

When ready to deploy:

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Troubleshooting

### Pages not loading
- Check that dev server is running (`npm run dev`)
- Verify you're accessing the correct URL
- Check browser console for errors

### Data not saving
- Verify `.env` file has correct Supabase credentials
- Check Supabase dashboard is accessible
- Confirm all migrations have been applied
- Check browser console for error messages

### Navigation not working
- Clear browser cache
- Restart dev server
- Check that `react-router-dom` is installed

## Next Steps

1. Customize the navigation bar styling in `src/components/AdminNav.tsx`
2. Add authentication to protect admin routes
3. Add more store fields as needed
4. Implement user roles and permissions
5. Add audit logging for changes

## Need Help?

- Check `TEAM_DOCUMENTATION.md` for complete documentation
- Review `STORE_SETTINGS_GUIDE.md` for Store Settings details
- See `HOURS_INTEGRATION_GUIDE.md` for Hours Editor details
