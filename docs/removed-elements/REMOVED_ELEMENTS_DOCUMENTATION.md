# Removed Elements Documentation

This document tracks all elements that have been removed from the Home Admin application. These elements can be restored in the future if needed.

## ⚠️ IMPORTANT: This file must be updated whenever ANY element is removed from the application.

**PRIORITY:** Always update this documentation file immediately after removing any element, component, feature, or functionality from the application.

## Table of Contents
1. [Form Simplification - December 2024](#form-simplification---december-2024)
2. [Maintenance System](#maintenance-system)
3. [Dashboard Quick Actions](#dashboard-quick-actions)
4. [Dashboard Alerts & Notifications](#dashboard-alerts--notifications)
5. [Navigation Elements](#navigation-elements)
6. [Form Options](#form-options)
7. [Status Options](#status-options)
8. [Component References](#component-references)
9. [Amenities Feature - REMOVED](#7-amenities-feature---removed-december-2024)
10. [Future Removals](#future-removals)

---

## Form Simplification - December 2024

### Purpose
Simplified forms for university exam presentation while maintaining functionality. All removed fields can be easily restored.

### 1. Property Form Fields Removed
**Location:** `src/config/formFields.js` - PROPERTY_FIELDS array  
**Status:** ❌ REMOVED (can be restored)

**Removed Fields:**
- `state` - State field (text input)
- `zip` - ZIP Code field (text input)
- `sqft` - Square Feet field (number input)
- `tenant` - Tenant Name field (text input)
- `tenantEmail` - Tenant Email field (email input)
- `tenantPhone` - Tenant Phone field (tel input)
- `leaseEnd` - Lease End Date field (date input)

**Original Implementation:**
```javascript
{ name: 'state', label: 'State', type: 'text', required: true, placeholder: 'Enter state' },
{ name: 'zip', label: 'ZIP Code', type: 'text', required: true, placeholder: 'Enter ZIP code' },
{ name: 'sqft', label: 'Square Feet', type: 'number', required: true, min: 100 },
{ name: 'tenant', label: 'Tenant Name', type: 'text', placeholder: 'Enter tenant name' },
{ name: 'tenantEmail', label: 'Tenant Email', type: 'email', placeholder: 'Enter tenant email' },
{ name: 'tenantPhone', label: 'Tenant Phone', type: 'tel', placeholder: 'Enter tenant phone' },
{ name: 'leaseEnd', label: 'Lease End Date', type: 'date' },
```

**Reason for Removal:** Simplify property form for exam presentation. Tenants are now managed separately via the tenants tab and linked to properties through the property selection dropdown in tenant creation.

**Impact:** 
- Property creation form is simpler with only: address, city, bedrooms, bathrooms, rent, status, notes
- Tenant information is no longer stored directly on properties
- Tenants must be created separately and linked to properties via the tenants tab

### 2. Tenant Form Fields Removed
**Location:** `src/config/formFields.js` - TENANT_FIELDS array  
**Status:** ❌ REMOVED (can be restored)

**Removed Fields:**
- `emergencyContact` - Emergency Contact field (text input)
- `emergencyPhone` - Emergency Phone field (tel input)
- `leaseEnd` - Lease End Date field (date input)

**Original Implementation:**
```javascript
{ name: 'emergencyContact', label: 'Emergency Contact', type: 'text', placeholder: 'Enter emergency contact name' },
{ name: 'emergencyPhone', label: 'Emergency Phone', type: 'tel', placeholder: 'Enter emergency contact phone' },
{ name: 'leaseEnd', label: 'Lease End Date', type: 'date', required: true },
```

**Reason for Removal:** Simplify tenant form for exam presentation

**Impact:**
- Tenant creation form is simpler
- Emergency contact information is no longer tracked
- Lease end dates can be managed through property-tenant relationships if needed

### 2b. User Profile Fields Removed
**Location:** `src/components/shared/UserProfile.js`  
**Status:** ❌ REMOVED (can be restored)

**Removed Fields:**
- `emergency_contact` - Emergency Contact field (text input)
- `emergency_phone` - Emergency Phone field (tel input)

**Original Implementation:**
```javascript
// In formData state (lines 8-15):
const [formData, setFormData] = useState({
  bio: '',
  phone: '',
  address: '',
  date_of_birth: '',
  emergency_contact: '',  // REMOVED
  emergency_phone: ''     // REMOVED
});

// In form inputs (lines 155-181):
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label>Emergency Contact</label>
    <input
      type="text"
      value={formData.emergency_contact}
      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
      placeholder="Emergency contact name"
    />
  </div>
  <div>
    <label>Emergency Phone</label>
    <input
      type="tel"
      value={formData.emergency_phone}
      onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
      placeholder="(555) 123-4567"
    />
  </div>
</div>

// In display section (lines 232-250):
{(profile?.emergency_contact || profile?.emergency_phone) && (
  <div>
    <h4>Emergency Contact</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {profile.emergency_contact && (
        <div>
          <span>Name:</span>
          <p>{profile.emergency_contact}</p>
        </div>
      )}
      {profile.emergency_phone && (
        <div>
          <span>Phone:</span>
          <p>{profile.emergency_phone}</p>
        </div>
      )}
    </div>
  </div>
)}
```

**Reason for Removal:** Simplify user profile form for exam presentation

**Impact:**
- User profile form is simpler
- Emergency contact information is no longer tracked in user profiles
- User profiles now only contain: bio, phone, address, date_of_birth

### 3. Property Table Columns Simplified
**Location:** `src/config/tableColumns.js` - PROPERTY_COLUMNS array  
**Status:** ❌ CHANGED (can be restored)

**Changes:**
- Removed state and zip code from address display (now shows only city)
- Removed square feet from details display
- Removed tenant column (tenants shown via property-tenant relationships)

**Original Implementation:**
```javascript
// Address column showed: {item.city}, {item.state} {item.zip}
// Details column showed: {item.bedrooms} bed, {item.bathrooms} bath + {item.sqft} sqft
// Had a separate tenant column showing tenant name and email
```

**Current Implementation:**
```javascript
// Address column shows only: {item.city}
// Details column shows only: {item.bedrooms} bed, {item.bathrooms} bath
// No tenant column (tenants managed separately)
```

### 4. Tenant Table Columns Simplified
**Location:** `src/config/tableColumns.js` - TENANT_COLUMNS array  
**Status:** ❌ CHANGED (can be restored)

**Changes:**
- Removed lease end date column

**Original Implementation:**
```javascript
{
  key: 'leaseEnd',
  label: 'Lease End',
  render: (value) => value ? new Date(value).toLocaleDateString() : '-'
}
```

### 5. FormModal Duplicate Buttons Fixed
**Location:** `src/components/shared/FormModal.js`  
**Status:** ✅ FIXED

**Issue:** FormModal component had its own Cancel/Submit buttons that duplicated the buttons in DynamicForm, resulting in two sets of buttons in modals.

**Original Implementation:**
```javascript
<ModalBody pb={6}>
  <VStack spacing={4}>
    {children}
    <Flex gap={2} w="full" justify="flex-end">
      <Button variant="outline" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button colorScheme="blue" onClick={onSubmit}>
        {submitLabel}
      </Button>
    </Flex>
  </VStack>
</ModalBody>
```

**Current Implementation:**
```javascript
<ModalBody pb={6}>
  {children}
</ModalBody>
```

**Reason for Change:** DynamicForm already handles form submission with its own buttons, making FormModal's buttons redundant and confusing.

**Impact:** 
- Only one set of buttons (Cancel/Create or Cancel/Update) now appears in modals
- Cleaner UI with no duplicate actions

### 6. Database Schema Fields - REMOVED
**Location:** `src/database/schema.sql` and `src/services/databaseService.js`  
**Status:** ✅ REMOVED from schema and service layer

**Database Schema Updates:**
- **Properties table**: Removed `state`, `zip`, `sqft` columns
- **Tenants table**: Removed `emergency_contact`, `emergency_phone` columns
- **User Profiles table**: Removed `emergency_contact`, `emergency_phone` columns

**Migration File Created:**
`src/database/migration_remove_simplified_fields.sql` - Run this on existing databases to remove the columns

**DatabaseService Updates:**
**Location:** `src/services/databaseService.js`

**Properties INSERT (line 167-173):**
```javascript
// Updated: Removed state, zip, sqft from INSERT statement
INSERT INTO properties (user_id, address, city, bedrooms, bathrooms, rent, status, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
```

**Tenants INSERT (line 240-244):**
```javascript
// Updated: Removed emergency_contact, emergency_phone from INSERT statement
INSERT INTO tenants (user_id, name, email, phone, status, notes)
VALUES ($1, $2, $3, $4, $5, $6)
```

**User Profiles INSERT (line 98-107):**
```javascript
// Updated: Removed emergency_contact, emergency_phone from INSERT statement
INSERT INTO user_profiles (user_id, bio, phone, address, date_of_birth)
VALUES ($1, $2, $3, $4, $5)
```

**Query Updates:**
- Removed `p.state, p.zip` from property-tenant join queries
- Removed `emergency_contact, emergency_phone` from getUserProfile fallback return

**For Existing Databases:**
If you have an existing database with these columns, run:
```bash
psql -d your_database_name -f src/database/migration_remove_simplified_fields.sql
```

**For Fresh Installations:**
The updated `schema.sql` no longer includes these columns, so new installations will match the simplified schema automatically.

## Future Removals

*This section will be updated whenever new elements are removed from the application.*

### Template for New Removals

When documenting new removals, use this template:

```markdown
### [Element Name] - [Date]
**Location:** `path/to/file.js`
**Status:** ❌ REMOVED/CHANGED/DELETED
**Original Implementation:**
```javascript
// Include the exact code that was removed
```

**Reason for Removal:** [Brief explanation]
**Impact:** [What functionality was affected]
```

### Update Log
- **Initial Documentation**: Created comprehensive documentation of all maintenance system removals and dashboard cleanup
- **Last Updated**: December 2024 - Initial comprehensive documentation created
- **Form Simplification (December 2024)**: Removed duplicate buttons from FormModal, simplified property and tenant forms for university exam presentation
- **Test Login Page**: Created new styled-components test login page at `/test-login` with animated background and Home Admin branding
- **Test Login Improvements**: Removed browser autocomplete suggestions and increased circle size to cover entire form
- **Test Register Page**: Created new styled-components register page at `/test-register` with same design as login but without demo credentials
- **Navigation Links**: Added proper navigation between test-login and test-register pages
- **Hydration Error Fix**: Used dynamic imports with SSR disabled to fix hydration errors in test-login and test-register pages
- **Login/Register Replacement**: Replaced old Chakra UI login/register pages with new styled-components versions
- **Test Pages Cleanup**: Removed test-login and test-register pages after integrating styles into main pages
- **Final Cleanup**: Removed all test directories and empty maintenance directory, keeping only clean login/register folders
- **Code Optimization**: Implemented comprehensive code optimization with JSON data files, reusable components, and database preparation
- **Runtime Error Fix**: Fixed useRef import issue in DataTable component and replaced JSON imports with inline data to resolve build issues
- **DRY Principle Implementation**: Created universal components and hooks to eliminate code duplication across all pages
- **Comprehensive Cleanup**: Removed all redundant hooks, unused components, unused forms, and JSON files for maximum optimization

---

## Maintenance System

### 1. Maintenance Page
**Location:** `src/app/maintenance/page.js`
**Status:** ❌ DELETED
**Original Implementation:**
- Full maintenance request management page
- Used `PageLayout`, `SearchFilter`, `MaintenanceCard`, `FormModal`, `MaintenanceForm`, `StatCard`
- Had CRUD operations for maintenance requests
- Included status filtering and search functionality

### 2. Maintenance Card Component
**Location:** `src/components/data/MaintenanceCard.js`
**Status:** ❌ DELETED
**Original Implementation:**
```javascript
// Displayed maintenance request details
- Request title, description, property, tenant
- Priority badges (Urgent, Medium, Low)
- Status badges (Open, In Progress, Completed)
- Date created, due date, assigned vendor
- Estimated cost, actual cost
- Action buttons (View, Edit, Actions menu)
- Notes section
```

### 3. Maintenance Form Component
**Location:** `src/components/forms/MaintenanceForm.js`
**Status:** ❌ DELETED
**Original Implementation:**
```javascript
// Form fields included:
- Title (text input)
- Description (textarea)
- Property (select dropdown)
- Priority (select: Urgent, Medium, Low)
- Due Date (date input)
- Estimated Cost (number input)
- Assigned To (text input)
- Notes (textarea)
```

### 4. Maintenance Navigation Link
**Location:** `src/components/shared/Sidebar.js` and `src/utils/constants.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
// In NAVIGATION_ITEMS array:
{ href: "/maintenance", label: "🔧 Maintenance", icon: "🔧" }

// In Sidebar component:
<Button as="a" href="/maintenance" variant="ghost" justifyContent="flex-start">
  🔧 Maintenance
</Button>
```

---

## Dashboard Quick Actions

### 1. Quick Actions Card
**Location:** `src/app/dashboard/page.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
<Card>
  <CardBody>
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Quick Actions</Heading>
      <SimpleGrid columns={2} spacing={4}>
        <Button as="a" href="/properties" leftIcon={<Icon as={HomeIcon} />} colorScheme="blue" variant="outline">
          Manage Properties
        </Button>
        <Button as="a" href="/tenants" leftIcon={<Icon as={UsersIcon} />} colorScheme="green" variant="outline">
          Manage Tenants
        </Button>
        <Button as="a" href="/finances" leftIcon={<Icon as={DollarIcon} />} colorScheme="purple" variant="outline">
          View Finances
        </Button>
        <Button as="a" href="/expenses" leftIcon={<Icon as={TrendingDownIcon} />} colorScheme="orange" variant="outline">
          Track Expenses
        </Button>
      </SimpleGrid>
    </VStack>
  </CardBody>
</Card>
```

---

## Dashboard Alerts & Notifications

### 1. Alerts & Notifications Card
**Location:** `src/app/dashboard/page.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
<Card>
  <CardBody>
    <VStack align="stretch" spacing={4}>
      <Heading size="md">Alerts & Notifications</Heading>
      <VStack align="stretch" spacing={3}>
        <Box p={3} bg="red.50" borderRadius="md" borderLeft="4px" borderColor="red.500">
          <HStack>
            <Icon as={AlertIcon} color="red.500" />
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="red.700">Urgent Maintenance</Text>
              <Text fontSize="xs" color="red.600">AC Unit Not Working - 123 Main Street</Text>
            </Box>
          </HStack>
        </Box>
        <Box p={3} bg="yellow.50" borderRadius="md" borderLeft="4px" borderColor="yellow.500">
          <HStack>
            <Icon as={DollarIcon} color="yellow.500" />
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="yellow.700">Overdue Payment</Text>
              <Text fontSize="xs" color="yellow.600">Sarah Johnson - $4,500 overdue</Text>
            </Box>
          </HStack>
        </Box>
        <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.500">
          <HStack>
            <Icon as={HomeIcon} color="blue.500" />
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="blue.700">Property Available</Text>
              <Text fontSize="xs" color="blue.600">456 Oak Avenue is now available for rent</Text>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </VStack>
  </CardBody>
</Card>
```

### 2. Dashboard Maintenance Stats
**Location:** `src/app/dashboard/page.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
// In stats object:
maintenanceRequests: 2,

// In recentActivities array:
{
  id: 2,
  type: "maintenance",
  message: "New maintenance request: AC Unit Not Working",
  time: "4 hours ago",
  priority: "Urgent",
},

// In getActivityIcon function:
case "maintenance":
  return AlertIcon;

// In getActivityColor function:
case "maintenance":
  return "red";
```

---

## Navigation Elements

### 1. Maintenance Navigation Item
**Location:** `src/utils/constants.js` - NAVIGATION_ITEMS array
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
export const NAVIGATION_ITEMS = [
  { href: "/", label: "🏠 Dashboard", icon: "🏠" },
  { href: "/properties", label: "🏘️ Properties", icon: "🏘️" },
  { href: "/tenants", label: "👥 Tenants", icon: "👥" },
  { href: "/finances", label: "💰 Finances", icon: "💰" },
  { href: "/expenses", label: "💸 Expenses", icon: "💸" },
  { href: "/maintenance", label: "🔧 Maintenance", icon: "🔧" }, // REMOVED
  { href: "/settings", label: "⚙️ Settings", icon: "⚙️" },
];
```

### 2. Hardcoded Sidebar Navigation
**Location:** `src/app/finances/page.js` and `src/app/expenses/page.js`
**Status:** ❌ REPLACED with PageLayout
**Original Implementation:**
```javascript
// In finances page:
<Box w="250px" bg="white" minH="calc(100vh - 80px)" shadow="sm" p={4}>
  <VStack align="stretch" spacing={2}>
    <Button as="a" href="/" variant="ghost" justifyContent="flex-start">🏠 Dashboard</Button>
    <Button as="a" href="/properties" variant="ghost" justifyContent="flex-start">🏘️ Properties</Button>
    <Button as="a" href="/tenants" variant="ghost" justifyContent="flex-start">👥 Tenants</Button>
    <Button variant="ghost" justifyContent="flex-start" colorScheme="blue">💰 Finances</Button>
    <Button as="a" href="/maintenance" variant="ghost" justifyContent="flex-start">🔧 Maintenance</Button>
  </VStack>
</Box>
```

---

## Form Options

### 1. Maintenance Category in Expense Forms
**Location:** `src/components/forms/ExpenseForm.js`
**Status:** ❌ CHANGED to "Repair"
**Original Implementation:**
```javascript
<option value="Maintenance">Maintenance</option>
```

### 2. Maintenance Status in Property Forms
**Location:** `src/components/forms/PropertyForm.js`
**Status:** ❌ CHANGED to "Renovating"
**Original Implementation:**
```javascript
<option value="Maintenance">Maintenance</option>
```

### 3. Maintenance Category in Finances Page
**Location:** `src/app/finances/page.js`
**Status:** ❌ CHANGED to "Repair"
**Original Implementation:**
```javascript
// In transaction data:
category: "Maintenance",

// In form options:
<option value="Maintenance">Maintenance</option>
```

---

## Status Options

### 1. Maintenance Status in Constants
**Location:** `src/utils/constants.js`
**Status:** ❌ CHANGED to "Renovating"
**Original Implementation:**
```javascript
// In STATUS_COLORS:
property: {
  Occupied: "green",
  Available: "blue", 
  Maintenance: "orange", // CHANGED to "Renovating"
},

// In FILTER_OPTIONS:
properties: [
  { value: "Occupied", label: "Occupied" },
  { value: "Available", label: "Available" },
  { value: "Maintenance", label: "Maintenance" }, // REMOVED
],
```

### 2. Maintenance Priority Colors
**Location:** `src/utils/constants.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
// Maintenance priorities
priority: {
  Urgent: "red",
  Medium: "yellow",
  Low: "green",
},
// Maintenance statuses
maintenance: {
  Open: "red",
  "In Progress": "yellow",
  Completed: "green",
  Cancelled: "gray",
},
```

### 3. Maintenance Filter Options
**Location:** `src/utils/constants.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
maintenance: [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
],
```

---

## Component References

### 1. Maintenance Menu Items
**Location:** `src/components/data/TenantRow.js`
**Status:** ❌ CHANGED to "Repair Request"
**Original Implementation:**
```javascript
<MenuItem>Maintenance Request</MenuItem>
```

**Location:** `src/components/data/PropertyCard.js`
**Status:** ❌ CHANGED to "Repair Request"
**Original Implementation:**
```javascript
<MenuItem>Maintenance Request</MenuItem>
```

### 2. Maintenance Category Colors
**Location:** `src/components/data/ExpenseRow.js`
**Status:** ❌ CHANGED to "Repair"
**Original Implementation:**
```javascript
const getCategoryColor = (category) => {
  const colors = {
    Water: "blue",
    Electricity: "yellow",
    Heating: "orange",
    Garbage: "purple",
    Internet: "teal",
    Insurance: "red",
    Taxes: "red",
    Maintenance: "yellow", // CHANGED to "Repair"
    Cleaning: "green",
    Landscaping: "green",
  };
  return colors[category] || "gray";
};
```

### 3. Maintenance Status Colors
**Location:** `src/components/data/PropertyCard.js`
**Status:** ❌ CHANGED to "Renovating"
**Original Implementation:**
```javascript
const getStatusColor = (status) => {
  switch (status) {
    case "Occupied":
      return "green";
    case "Available":
      return "blue";
    case "Maintenance": // CHANGED to "Renovating"
      return "orange";
    default:
      return "gray";
  }
};
```

### 4. Maintenance Helper Functions
**Location:** `src/utils/helpers.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
import { 
  AlertTriangle as AlertTriangleIcon,
  Time as TimeIcon,
  CheckCircle as CheckCircleIcon,
} from "@chakra-ui/icons";

// Status icon functions
export const getStatusIcon = (status) => {
  const iconMap = {
    Open: AlertTriangleIcon,
    "In Progress": TimeIcon,
    Completed: CheckCircleIcon,
  };
  return iconMap[status] || TimeIcon;
};
```

---

## Settings References

### 1. Maintenance Alerts in Settings
**Location:** `src/app/settings/page.js`
**Status:** ❌ CHANGED to "Repair Alerts"
**Original Implementation:**
```javascript
// In settings object:
notifications: {
  email: true,
  sms: false,
  maintenance: true, // CHANGED to "repair"
  payments: true,
},

// In settings form:
<Text>Maintenance Alerts</Text>
<Switch
  isChecked={settings.notifications.maintenance}
  onChange={(e) => handleSettingChange('notifications', 'maintenance', e.target.checked)}
/>
```

---

## Data References

### 1. Sample Maintenance Data
**Location:** `src/app/maintenance/page.js` (DELETED)
**Status:** ❌ DELETED
**Original Implementation:**
```javascript
const initialRequests = [
  {
    id: 1,
    title: "AC Unit Not Working",
    description: "Tenant reports AC unit is not cooling properly",
    property: "123 Main Street",
    tenant: "John Smith",
    priority: "Urgent",
    status: "Open",
    dateCreated: "2024-01-15",
    dueDate: "2024-01-20",
    assignedTo: "HVAC Pro",
    estimatedCost: 500,
    actualCost: null,
    notes: "Tenant says it's been getting worse over the past week"
  },
  // ... more sample data
];
```

### 2. Dashboard Maintenance Stats
**Location:** `src/app/dashboard/page.js`
**Status:** ❌ REMOVED
**Original Implementation:**
```javascript
const stats = {
  totalProperties: 4,
  occupiedProperties: 3,
  totalTenants: 4,
  monthlyIncome: 13000,
  monthlyExpenses: 3200,
  netIncome: 9800,
  maintenanceRequests: 2, // REMOVED
  overduePayments: 1,
};
```

---

## Restoration Notes

To restore any of these elements:

1. **Maintenance System**: Recreate the maintenance page, forms, and components using the patterns from other pages (properties, tenants, expenses)
2. **Dashboard Elements**: Add back the Quick Actions and Alerts sections to the dashboard
3. **Navigation**: Add maintenance link back to NAVIGATION_ITEMS array
4. **Form Options**: Add maintenance options back to form dropdowns
5. **Status Options**: Add maintenance status back to constants and helper functions
6. **Component References**: Update menu items and color mappings

All removed elements followed the same patterns as existing components, so they can be easily restored by following the established component structure and data management patterns.

---

## 7. Amenities Feature - REMOVED (December 2024)

**Location:** Multiple files  
**Status:** ✅ REMOVED (can be restored)

**Reason for Removal:** Simplified property management for exam presentation - properties should only use the basic form fields (address, city, bedrooms, bathrooms, rent, status, notes).

### 7a. Component Removal

**Removed Files:**
- ✅ `src/components/shared/PropertyAmenities.js` - Complete component deleted

**Original Implementation:**
```javascript
// PropertyAmenities.js - Modal component for managing property amenities
const PropertyAmenities = ({ propertyId, onClose }) => {
  const [amenities, setAmenities] = useState([]);
  const [propertyAmenities, setPropertyAmenities] = useState([]);
  
  // Component allowed users to:
  // - View all available amenities
  // - Toggle amenities on/off for a property
  // - Group amenities by category (indoor, outdoor, building, unit)
};
```

### 7b. API Routes Removal

**Removed Files:**
- ✅ `src/app/api/amenities/route.js` - GET endpoint for all amenities
- ✅ `src/app/api/properties/[propertyId]/amenities/route.js` - GET, POST, DELETE endpoints for property amenities

**Original API Endpoints:**
- `GET /api/amenities` - Get all available amenities
- `GET /api/properties/[propertyId]/amenities` - Get amenities for a property
- `POST /api/properties/[propertyId]/amenities` - Add amenity to property
- `DELETE /api/properties/[propertyId]/amenities` - Remove amenity from property

### 7c. Properties Page Updates

**Location:** `src/app/properties/page.js`  
**Changes:**
- Removed `PropertyAmenities` import
- Removed `showAmenities` state
- Removed `handleAmenitiesClick` handler
- Removed "Manage Amenities" button from `customActions`
- Removed amenities modal rendering

**Before:**
```javascript
import PropertyAmenities from "../../components/shared/PropertyAmenities";

const customActions = [
  {
    label: 'Manage Amenities',
    onClick: handleAmenitiesClick,
    className: 'bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm'
  },
  {
    label: 'Manage Tenants',
    onClick: handleTenantManagementClick,
    className: 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm'
  }
];

{showAmenities && (
  <PropertyAmenities propertyId={selectedPropertyId} onClose={...} />
)}
```

**After:**
```javascript
// PropertyAmenities import removed
// Only "Manage Tenants" action remains
```

### 7d. Database Service Updates

**Location:** `src/services/databaseService.js`  
**Changes:**
- Removed `getAmenities()` method
- Removed `getPropertyAmenities(propertyId, userId)` method
- Removed amenities JOIN from `getProperties()` query
- Removed amenities aggregation from properties query

**Removed Methods:**
```javascript
// REMOVED: Get all amenities
async getAmenities() {
  if (this.useDatabase) {
    const result = await this.query('SELECT * FROM amenities ORDER BY category, name');
    return result.rows;
  }
  return [/* fallback amenities */];
}

// REMOVED: Get amenities for a property
async getPropertyAmenities(propertyId, userId = null) {
  // ... implementation removed
}
```

**Query Changes:**
```javascript
// BEFORE: getProperties() included amenities
SELECT p.*, 
  STRING_AGG(DISTINCT a.name, ', ') as amenities,
  STRING_AGG(DISTINCT CONCAT(t.name, ' (', pt.lease_start, ' - ', pt.lease_end, ')'), '; ') as current_tenants
FROM properties p
LEFT JOIN property_amenities pa ON p.id = pa.property_id
LEFT JOIN amenities a ON pa.amenity_id = a.id
...

// AFTER: Removed amenities JOIN and aggregation
SELECT p.*, 
  STRING_AGG(DISTINCT CONCAT(t.name, ' (', pt.lease_start, ' - ', pt.lease_end, ')'), '; ') as current_tenants
FROM properties p
...
```

### 7e. Database Schema Removal

**Location:** `src/database/schema.sql`  
**Status:** ✅ REMOVED from schema

**Removed from Schema:**
- ✅ `amenities` table definition
- ✅ `property_amenities` junction table definition
- ✅ `idx_amenities_category` index
- ✅ All amenities INSERT statements (10 sample amenities)

**Original Schema:**
```sql
-- REMOVED: Amenities table
CREATE TABLE amenities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'indoor', 'outdoor', 'building', 'unit'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REMOVED: Property-Amenities junction table
CREATE TABLE property_amenities (
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, amenity_id)
);

-- REMOVED: Index
CREATE INDEX idx_amenities_category ON amenities(category);

-- REMOVED: Sample data (10 amenities)
INSERT INTO amenities (name, description, category) VALUES
('Swimming Pool', 'Outdoor swimming pool with deck area', 'outdoor'),
('Fitness Center', '24/7 fitness center with modern equipment', 'building'),
...
```

**Migration File Created:**
- `src/database/migration_remove_amenities.sql` - Run this on existing databases to drop the tables

**Impact:**
- Properties can no longer have amenities assigned
- "Manage Amenities" button removed from properties page
- Properties are now managed with basic form fields only
- Tables removed from schema for fresh installations
- Existing databases need migration to remove tables

### 7f. Restoration Instructions

To restore amenities functionality:

1. **Restore Component:**
   - Recreate `src/components/shared/PropertyAmenities.js` (see original implementation above)

2. **Restore API Routes:**
   - Recreate `src/app/api/amenities/route.js` with GET endpoint
   - Recreate `src/app/api/properties/[propertyId]/amenities/route.js` with GET, POST, DELETE endpoints

3. **Restore Database Service Methods:**
   - Add back `getAmenities()` method
   - Add back `getPropertyAmenities()` method
   - Restore amenities JOIN in `getProperties()` query

4. **Restore Properties Page:**
   - Re-add `PropertyAmenities` import
   - Re-add amenities state and handlers
   - Re-add "Manage Amenities" button to `customActions`
   - Re-add amenities modal rendering

5. **Database:**
   - Re-add `amenities` and `property_amenities` table definitions to `schema.sql`
   - Re-add amenities index and sample data if desired
   - For existing databases, recreate tables using the schema definitions

**Files to Restore:**
- `src/components/shared/PropertyAmenities.js`
- `src/app/api/amenities/route.js`
- `src/app/api/properties/[propertyId]/amenities/route.js`

**Code to Restore:**
- Amenities methods in `databaseService.js`
- Amenities button and modal in `properties/page.js`
- Amenities JOIN in `getProperties()` query
