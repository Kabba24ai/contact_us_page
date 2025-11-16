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
│   │   └── LocationBlock.tsx      # Location card component
│   └── lib/
│       └── supabase.ts            # Supabase client configuration
├── supabase/
│   └── migrations/
│       ├── 20251109135513_create_contact_submissions_table.sql
│       └── 20251115111518_create_store_settings_table.sql
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
- Managed in: `src/App.tsx` (useEffect hook)

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
- location_id (text, required, unique)
- hours (jsonb, required)
- created_at (timestamptz)
- updated_at (timestamptz)
```

Hours format:
```json
{
  "monday": "7:00 Am - 5:00 Pm",
  "tuesday": "7:00 Am - 5:00 Pm",
  "wednesday": "7:00 Am - 5:00 Pm",
  "thursday": "7:00 Am - 5:00 Pm",
  "friday": "7:00 Am - 5:00 Pm",
  "saturday": "7:00 Am - 12:00 Pm",
  "sunday": "Closed"
}
```

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
Update the `hours` JSONB field in `store_settings` table:
```sql
UPDATE store_settings
SET hours = '{"monday": "8:00 Am - 6:00 Pm", ...}'
WHERE location_id = 'bonaqua';
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

- [ ] Contact form submission works for both locations
- [ ] Phone numbers are clickable and trigger phone app
- [ ] SMS text button opens messaging app
- [ ] Store hours display correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Form validation prevents invalid submissions
- [ ] Success/error messages display properly
- [ ] Database connections work in production

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
Use Supabase dashboard or SQL:
```sql
UPDATE store_settings
SET hours = '{"monday": "New Hours", ...}',
    updated_at = now()
WHERE location_id = 'bonaqua';
```

## Support & Contact

For questions or issues, refer to:
- React docs: https://react.dev
- Vite docs: https://vitejs.dev
- Supabase docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com

## Version History

- **Current**: Production-ready contact page with dynamic hours
- Location cards with phone/SMS functionality
- Contact form with database integration
- Responsive design optimized for all devices
