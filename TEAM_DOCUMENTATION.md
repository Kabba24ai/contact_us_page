# Rent 'n King Contact Page - Team Documentation

## Project Overview

A production-ready contact page application for Rent 'n King's two locations (Bon Aqua and Waverly). The application features a modern, responsive design with location information, contact forms, and dynamic store hours management.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for production deployment

## Project Structure

```
/project
├── src/
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── ContactForm.tsx        # Contact form with validation
│   │   ├── HoursEditor.tsx        # Store hours management component
│   │   └── LocationBlock.tsx      # Location card component
│   ├── pages/
│   │   ├── StoreHoursAdmin.tsx    # Admin page for managing store hours
│   │   └── StoreSettings.tsx      # Complete store settings admin page
│   └── lib/
│       └── supabase.ts            # Supabase client configuration
├── supabase/
│   └── migrations/
│       ├── 20251109135513_create_contact_submissions_table.sql
│       ├── 20251115111518_create_store_settings_table.sql
│       └── 20251116120000_add_store_fields.sql
├── store-settings-hours.html      # Standalone hours editor demo
├── hours-section-snippet.html     # HTML snippet for existing forms
├── HOURS_INTEGRATION_GUIDE.md     # Hours editor integration guide
├── STORE_SETTINGS_GUIDE.md        # Store Settings admin page guide
└── .env                           # Environment variables (not in git)
```

## Key Features

### 1. Contact Form
- Real-time validation
- Success/error feedback
- Stores submissions in Supabase
- Fields: Name, Email, Phone, Message
- Located in: `src/components/ContactForm.tsx`

### 2. Location Cards
- Two locations: Bon Aqua and Waverly
- Clickable phone numbers (tel: links)
- SMS text functionality
- Address display with map pin icons
- Located in: `src/App.tsx`

### 3. Dynamic Store Hours
- Fetched from Supabase `store_settings` table
- Displays hours for each location
- Falls back to default hours if database unavailable
- Display component: `src/App.tsx` (useEffect hook)
- Admin editor: `src/components/HoursEditor.tsx`
- Admin page: `src/pages/StoreHoursAdmin.tsx`

### 4. Responsive Design
- Mobile-first approach
- Two-column layout on desktop
- Single column on mobile
- Optimized spacing and typography

## Database Schema

### Table: `contact_submissions`
```sql
- id (uuid, primary key)
- name (text, required)
- email (text, required)
- phone (text, required)
- message (text, required)
- location (text, required)
- created_at (timestamptz)
```

### Table: `store_settings`
```sql
- id (uuid, primary key)
- location (text, required, unique) - Location identifier
- store_name (text) - Store display name
- phone (text) - Contact phone number
- email (text) - Contact email address
- details (text) - Additional store information
- address (text) - Street address
- city (text) - City name
- state (text) - State name
- zip_code (text) - Postal code
- country (text, default: 'USA') - Country name
- latitude (text) - GPS latitude coordinate
- longitude (text) - GPS longitude coordinate
- is_primary (boolean, default: false) - Primary store flag
- status (text, default: 'Active') - Store status
- hours_of_operation (jsonb) - Weekly hours
- created_at (timestamptz)
- updated_at (timestamptz)
```

Hours format (stored in `hours_of_operation` field):
```json
{
  "monday": {
    "open": "07:00",
    "close": "17:00",
    "closed": false
  },
  "tuesday": {
    "open": "07:00",
    "close": "17:00",
    "closed": false
  },
  "wednesday": {
    "open": "07:00",
    "close": "17:00",
    "closed": false
  },
  "thursday": {
    "open": "07:00",
    "close": "17:00",
    "closed": false
  },
  "friday": {
    "open": "07:00",
    "close": "17:00",
    "closed": false
  },
  "saturday": {
    "open": "07:00",
    "close": "12:00",
    "closed": false
  },
  "sunday": {
    "open": "",
    "close": "",
    "closed": true
  }
}
```

**Note**: Times are stored in 24-hour format (HH:MM) but displayed to users in 12-hour format with AM/PM.

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file with Supabase credentials

### 3. Database Setup
- Migrations are in `supabase/migrations/`
- Tables have Row Level Security (RLS) enabled
- Public can insert contact submissions
- Public can read store settings

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

## Development Workflow

### Adding New Locations
1. Update `locations` array in `src/App.tsx`
2. Add corresponding entry in `store_settings` table
3. Test contact form submission with new location

### Modifying Store Hours

**Option 1: Using the Admin Interface (Recommended)**
1. Navigate to Store Hours Admin page
2. Select the location from dropdown
3. Edit hours for each day
4. Use quick copy buttons for efficiency
5. Click "Save Hours"

**Option 2: Direct Database Update**
```sql
UPDATE store_settings
SET hours_of_operation = '{
  "monday": {"open": "08:00", "close": "18:00", "closed": false},
  "tuesday": {"open": "08:00", "close": "18:00", "closed": false},
  ...
}'::jsonb,
updated_at = now()
WHERE location = 'bonaqua';
```

### Styling Changes
- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Inline Tailwind classes

## Security Considerations

### Row Level Security (RLS)
- All tables have RLS enabled
- Contact submissions: Insert-only for public
- Store settings: Read-only for public
- No data can be updated or deleted via public API

### Environment Variables
- Never commit `.env` to version control
- Use VITE_ prefix for client-accessible variables
- Anon key is safe for client-side use

## Performance Optimizations

1. **Code Splitting**: Vite automatically splits code
2. **Asset Optimization**: Images and CSS are minified
3. **Tree Shaking**: Unused code is removed in production
4. **Lazy Loading**: Components load as needed

## Testing Checklist

### Contact Page
- [ ] Contact form submission works for both locations
- [ ] Phone numbers are clickable and trigger phone app
- [ ] SMS text button opens messaging app
- [ ] Store hours display correctly for each location
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Form validation prevents invalid submissions
- [ ] Success/error messages display properly
- [ ] Database connections work in production

### Hours Management
- [ ] Can open Store Hours Admin page
- [ ] Location selector switches between stores
- [ ] Can mark days as closed/open
- [ ] Can set different hours for each day
- [ ] Quick copy functions work correctly
- [ ] Preview matches input values
- [ ] Hours save to database successfully
- [ ] Saved hours appear on Contact page
- [ ] Loading existing hours works on page refresh
- [ ] Success/error messages display properly

## Deployment

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

### Environment Variables for Production
Set the following on your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Maintenance

### Monitoring Contact Submissions
```sql
SELECT * FROM contact_submissions
ORDER BY created_at DESC
LIMIT 100;
```

### Updating Store Hours
Use the admin interface at `/admin/store-hours` or via Supabase dashboard/SQL:
```sql
UPDATE store_settings
SET hours_of_operation = '{
  "monday": {"open": "08:00", "close": "18:00", "closed": false}
}'::jsonb,
updated_at = now()
WHERE location = 'bonaqua';
```

## Support & Contact

For questions or issues, refer to:
- React docs: https://react.dev
- Vite docs: https://vitejs.dev
- Supabase docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com

## Admin Pages

### 1. Store Settings (Complete Management)

**Location**: `src/pages/StoreSettings.tsx`

A comprehensive admin interface for managing all store information:

#### Features
- **Store Selection**: Dropdown to switch between locations
- **Basic Information**: Name, phone, email, details
- **Store Address**: Full address with GPS coordinates
- **Store Settings**: Primary/alternate designation, active/inactive status
- **Hours Management**: Integrated hours editor (toggle to show/hide)
- **Auto-formatting**: Phone numbers formatted as (xxx) xxx-xxxx
- **Validation**: Required field checking and email validation
- **Real-time Save**: Instant database updates with feedback

#### Usage
```typescript
import StoreSettings from './pages/StoreSettings';

<Route path="/admin/store-settings" element={<StoreSettings />} />
```

See `STORE_SETTINGS_GUIDE.md` for detailed documentation.

---

### 2. Store Hours Management System

**Location**: `src/pages/StoreHoursAdmin.tsx`

Dedicated interface for managing store hours only.

### Features
- **Individual Day Management**: Set unique hours for each day of the week
- **Closed Day Handling**: Mark specific days as closed with a checkbox
- **Quick Copy Functions**:
  - Copy Monday to Weekdays (Mon-Fri)
  - Copy Monday to All Days
- **Live Preview**: See exactly how hours will display on the website
- **Database Persistence**: All changes saved to Supabase
- **Real-time Updates**: Changes appear immediately on Contact page
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Components

#### 1. HoursEditor Component (`src/components/HoursEditor.tsx`)
React component that provides the full hours management interface:
- Loads existing hours from database
- Allows editing all days of the week
- Validates time inputs
- Saves changes to database
- Shows success/error messages

#### 2. StoreHoursAdmin Page (`src/pages/StoreHoursAdmin.tsx`)
Standalone admin page featuring:
- Location selector dropdown
- Full hours editor interface
- Usage instructions and notes
- Dedicated route for admin access

#### 3. HTML Integration Options
For non-React environments:
- **store-settings-hours.html**: Standalone demo page
- **hours-section-snippet.html**: Code snippet for existing forms
- Uses Alpine.js for interactivity
- Matches existing Kabba admin styling

### Integration Guide
See `HOURS_INTEGRATION_GUIDE.md` for detailed instructions on:
- Adding hours editor to existing HTML forms
- Using the React component
- Backend integration examples
- Database queries and updates
- Testing procedures

### Data Flow
```
Admin Interface → HoursEditor Component → Supabase Database → Contact Page
```

1. Admin edits hours in HoursEditor
2. Component saves to `store_settings` table
3. Contact page fetches hours on load
4. Hours display in location cards

## Version History

### v3.0 - Complete Store Settings Admin (Current)
- Full Store Settings admin page with all fields
- Integrated hours management
- Auto-formatting phone numbers
- Form validation and error handling
- Database migration for store fields
- Comprehensive admin documentation

### v2.0 - Hours Management System
- Added Store Hours Admin interface
- HoursEditor React component
- HTML/Alpine.js integration options
- Comprehensive documentation
- Database schema updates
- Live preview functionality

### v1.0 - Initial Release
- Production-ready contact page with dynamic hours
- Location cards with phone/SMS functionality
- Contact form with database integration
- Responsive design optimized for all devices
