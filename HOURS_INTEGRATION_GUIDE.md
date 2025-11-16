# Hours of Operation Integration Guide

This guide explains how to add the Hours of Operation editor to your Store Settings page.

## What Was Created

1. **HoursEditor.tsx** - React component for managing store hours
2. **StoreHoursAdmin.tsx** - Standalone admin page for managing hours
3. **store-settings-hours.html** - Standalone demo page
4. **hours-section-snippet.html** - HTML snippet for existing forms

## Option 1: Add to Existing HTML Form (Kabba Admin)

### Step 1: Add Alpine.js (if not already included)
```html
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Step 2: Insert the Hours Section
Copy the contents of `hours-section-snippet.html` and paste it into your form after the "Store Settings" section and before the save buttons.

### Step 3: Backend Integration
When the form is submitted, you'll receive hours data in this format:

```php
$hours = [
    'monday' => [
        'open' => $_POST['hours']['monday']['open'],
        'close' => $_POST['hours']['monday']['close'],
        'closed' => $_POST['hours']['monday']['closed'] === '1'
    ],
    // ... repeat for all days
];

// Save to Supabase
$supabase->from('store_settings')
    ->upsert([
        'location' => $location_id,
        'hours_of_operation' => json_encode($hours),
        'updated_at' => date('c')
    ]);
```

### Step 4: Load Existing Hours
When editing a store, populate the hours:

```php
// Fetch from database
$settings = $supabase->from('store_settings')
    ->select('hours_of_operation')
    ->eq('location', $location_id)
    ->single();

$hours = json_decode($settings['hours_of_operation'], true);
```

Then modify the Alpine.js data initialization:
```javascript
hours: <?php echo json_encode($hours); ?>
```

## Option 2: Use React Component (Recommended)

### Step 1: Import the Component
```typescript
import HoursEditor from './components/HoursEditor';
```

### Step 2: Use in Your Page
```typescript
<HoursEditor
  locationId="bonaqua"
  locationName="Bon Aqua"
/>
```

### Step 3: Create Admin Route
Add to your routing:
```typescript
import StoreHoursAdmin from './pages/StoreHoursAdmin';

// In your router
<Route path="/admin/store-hours" element={<StoreHoursAdmin />} />
```

## Database Schema

The hours are stored in the `store_settings` table:

```sql
CREATE TABLE store_settings (
  id uuid PRIMARY KEY,
  location text UNIQUE NOT NULL,
  hours_of_operation jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

### Hours Format (JSONB)
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

## Features

### 1. Individual Day Management
- Set open/close times for each day
- Mark days as closed
- Times are in 24-hour format (HH:MM)

### 2. Quick Copy Functions
- **Copy Monday to Weekdays**: Applies Monday hours to Tue-Fri
- **Copy Monday to All Days**: Applies Monday hours to all days

### 3. Live Preview
- See how hours will appear on the website
- Displays in 12-hour format (e.g., "7:00 AM - 5:00 PM")
- Shows "Closed" for non-operating days

### 4. Validation
- Disabled inputs when day is marked closed
- Required fields for open days
- Time format validation

## Display on Contact Page

The Contact page already fetches and displays hours from the database:

```typescript
// In App.tsx
const { data: storeSettings } = await supabase
  .from('store_settings')
  .select('hours_of_operation')
  .eq('location', 'bonaqua')
  .maybeSingle();
```

Hours are formatted and displayed automatically.

## Testing Checklist

- [ ] Can mark days as closed
- [ ] Can set different hours for each day
- [ ] Quick copy functions work correctly
- [ ] Preview matches input values
- [ ] Hours save to database
- [ ] Hours display correctly on Contact page
- [ ] Editing existing hours loads correctly
- [ ] Validation prevents invalid times

## Styling

The component uses:
- Tailwind CSS classes matching your existing design
- Responsive grid layout (mobile-friendly)
- Dark mode support (if enabled)
- Focus states for accessibility

## Support

For questions or issues:
1. Check browser console for errors
2. Verify Supabase connection
3. Check database table exists
4. Confirm RLS policies allow read/write

## Future Enhancements

Potential additions:
- Holiday hours override
- Multiple hour ranges per day (split shifts)
- Temporary closures/notifications
- Bulk import/export
- Hours history/audit log
