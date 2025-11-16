# Store Settings Admin Page - Implementation Guide

## Overview

The Store Settings page is a comprehensive admin interface for managing all store location information, including basic details, address, settings, and hours of operation.

## Features

### 1. Store Selection
- Dropdown to select between different store locations
- Automatically loads store data when selection changes
- Stores loaded from `store_settings` table

### 2. Basic Information
- **Store Name**: Display name for the location
- **Phone Number**: Auto-formatted as (xxx) xxx-xxxx
- **Email**: Contact email with validation
- **Details**: Additional store information

### 3. Store Address
- **Street Address**: Full street address
- **City**: City name
- **State**: US state selector with all 50 states
- **Zip Code**: Postal code
- **Country**: Country name (defaults to USA)
- **Latitude/Longitude**: GPS coordinates for mapping

### 4. Store Settings
- **Store Designation**: Primary or Alternate store
- **Status**: Active/Inactive toggle switch

### 5. Hours of Operation
- Integrated HoursEditor component
- Toggle button to show/hide hours editor
- Fully functional hours management
- Saves to same database record

## Component Structure

```typescript
StoreSettings.tsx
├── Store selector dropdown
├── Basic Information section
├── Store Address section
├── Store Settings section
├── Save button
├── Hours toggle button
└── HoursEditor component (conditional)
```

## Database Schema

### Required Migration

Apply migration: `20251116120000_add_store_fields.sql`

This adds the following fields to `store_settings` table:
- `store_name` (text)
- `phone` (text)
- `email` (text)
- `details` (text)
- `address` (text)
- `city` (text)
- `state` (text)
- `zip_code` (text)
- `country` (text, default: 'USA')
- `latitude` (text)
- `longitude` (text)
- `is_primary` (boolean, default: false)
- `status` (text, default: 'Active')

### Complete Table Structure

```sql
store_settings
├── id (uuid, primary key)
├── location (text, unique) - Location identifier
├── store_name (text) - Display name
├── phone (text) - Phone number
├── email (text) - Email address
├── details (text) - Additional info
├── address (text) - Street address
├── city (text) - City
├── state (text) - State
├── zip_code (text) - Zip code
├── country (text) - Country
├── latitude (text) - GPS latitude
├── longitude (text) - GPS longitude
├── is_primary (boolean) - Primary store flag
├── status (text) - Active/Inactive
├── hours_of_operation (jsonb) - Weekly hours
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

## Usage

### Import and Use

```typescript
import StoreSettings from './pages/StoreSettings';

// In your router
<Route path="/admin/store-settings" element={<StoreSettings />} />
```

### Navigation

Add to your admin navigation:
```typescript
<Link to="/admin/store-settings">Store Settings</Link>
```

## Key Features Explained

### Auto-Formatting Phone Numbers

Phone numbers are automatically formatted as users type:
- Input: `6158156734`
- Display: `(615) 815-6734`

### Form Validation

Required fields are marked with red asterisk (*):
- Store Name
- Phone Number
- Email Address
- Street Address
- City
- State
- Zip Code
- Country

Validation runs before save:
- Checks for empty required fields
- Validates email format
- Shows error messages for invalid data

### Toggle Hours Editor

The Hours of Operation editor can be shown/hidden:
- Click "Edit Hours of Operation" to show
- Click "Hide Hours of Operation" to collapse
- Saves independently from main form
- Uses the same location_id for data consistency

### Status Toggle

Active/Inactive status uses a visual toggle switch:
- Green = Active
- Gray = Inactive
- Click to toggle between states

## API Integration

### Loading Store Data

```typescript
const { data, error } = await supabase
  .from('store_settings')
  .select('*')
  .eq('location', locationId)
  .maybeSingle();
```

### Saving Store Data

```typescript
const { error } = await supabase
  .from('store_settings')
  .upsert({
    location: formData.location_id,
    store_name: formData.store_name,
    phone: formData.phone,
    email: formData.email,
    // ... all other fields
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'location'
  });
```

## Styling

The page uses:
- Tailwind CSS for all styling
- Gradient background (`bg-gradient-to-br from-slate-50 to-slate-100`)
- Card-based layout with shadows
- Lucide React icons
- Responsive grid system
- Focus states for accessibility

## Error Handling

### Display Messages

Success and error messages appear at the top of the page:
- **Success**: Green background with checkmark icon
- **Error**: Red background with info icon
- Auto-dismiss after 3 seconds for success messages

### Common Errors

1. **Validation errors**: Show specific field requirement
2. **Database errors**: Show generic "failed to save" message
3. **Network errors**: Caught and logged to console

## State Management

The component uses React hooks for state:
- `stores`: List of available stores
- `selectedStore`: Currently selected location ID
- `formData`: All form field values
- `loading`: Loading state for async operations
- `saving`: Saving state for submit button
- `message`: Success/error message object
- `showHoursEditor`: Toggle for hours editor visibility

## Best Practices

### 1. Always Validate
- Check required fields before submitting
- Validate email format
- Show clear error messages

### 2. Save Feedback
- Disable button while saving
- Show loading spinner
- Display success/error messages

### 3. Data Consistency
- Use upsert to handle new and existing records
- Update `updated_at` timestamp on saves
- Use location as unique identifier

### 4. User Experience
- Auto-format phone numbers
- Use toggle switches for boolean values
- Provide field labels and placeholders
- Mark required fields clearly

## Testing Checklist

- [ ] Store selector loads all locations
- [ ] Selecting a store loads its data
- [ ] All form fields display correctly
- [ ] Phone number formats automatically
- [ ] Email validation works
- [ ] State selector shows all states
- [ ] Primary/Alternate radio buttons work
- [ ] Status toggle switches correctly
- [ ] Form validation prevents invalid saves
- [ ] Save button shows loading state
- [ ] Success message appears after save
- [ ] Error message shows on failure
- [ ] Hours editor toggle button works
- [ ] Hours editor displays correctly
- [ ] Hours save independently
- [ ] Data persists after page reload
- [ ] Responsive design works on mobile
- [ ] All icons display correctly

## Integration with Contact Page

Store data flows to the contact page:

```typescript
// Contact page loads store settings
const { data } = await supabase
  .from('store_settings')
  .select('*')
  .eq('location', 'bonaqua')
  .maybeSingle();

// Uses: address, phone, email, hours_of_operation
```

## Future Enhancements

Potential additions:
- Image upload for store photos
- Social media links
- Operating schedule exceptions
- Store amenities/features
- Multi-language support
- Bulk import/export
- Change history/audit log
- Google Maps integration for coordinates
- Address validation API

## Troubleshooting

### Store data not loading
- Check Supabase connection
- Verify table exists
- Check RLS policies
- Confirm location ID matches

### Save fails silently
- Check browser console for errors
- Verify authentication
- Check database permissions
- Confirm all required fields filled

### Hours not displaying
- Verify hours_of_operation field exists
- Check JSON format in database
- Confirm HoursEditor component imported
- Check location ID consistency

## Support

For issues or questions:
- Review migration files in `supabase/migrations/`
- Check component code in `src/pages/StoreSettings.tsx`
- Verify database schema in Supabase dashboard
- Test with Supabase SQL editor
