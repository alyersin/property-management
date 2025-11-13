## Tenant Management Removal - November 2025

### Overview
To simplify the Home Admin walkthrough we removed every tenant-specific feature and ultimately focused financial tracking on a single utility expenses experience.

### Elements Removed
- **Navigation item** – `src/utils/constants.js`
```javascript
// Before
{ href: "/tenants", label: "👥 Tenants", icon: "👥" },
{ href: "/expenses", label: "💸 Expenses", icon: "💸" },

// After
{ href: "/expenses", label: "💡 Expenses", icon: "💡" },
```
- **Tenants page** – `src/app/tenants/page.js` (entire file deleted)
- **Property tenant management modal** – `src/components/shared/PropertyTenantManagement.js` (entire file deleted)
- **API routes**
  - `src/app/api/tenants/route.js`
  - `src/app/api/tenants/[tenantId]/properties/route.js`
  - `src/app/api/properties/[propertyId]/tenants/route.js`
- **Database tables** – removed `tenants`, `property_tenants`, `transactions`, `expenses`; introduced the consolidated `expenses` table
```sql
-- Current consolidated expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **Utility metadata** – removed the expense category dropdown, status colors, and related helpers to keep tracking free-form
  - `src/config/formFields.js` (removed the `category` select)
  - `src/config/tableColumns.js` (removed the utility column)
  - `src/utils/helpers.js` / `src/utils/constants.js` (dropped status/category color helpers)
  - `src/database/schema.sql`, `src/services/dataService.js`, `src/services/databaseService.js` (simplified persistence and reporting)
- **UI integrations**
  - Removed tenant-specific custom actions from `src/app/properties/page.js`
  - Updated `src/components/shared/UniversalPage.js` singular names and filters
  - Replaced transaction/expense columns with `EXPENSE_COLUMNS` in `src/config/tableColumns.js`
  - Replaced transaction/expense form configs with `EXPENSE_FIELDS` in `src/config/formFields.js`
- **Service layer**
  - Simplified `src/services/dataService.js` to manage utility `expenses` only
  - Replaced tenant, transaction, and legacy expense handlers in `src/services/databaseService.js` with `expenses` equivalents

### Reason for Removal
- Reduce cognitive load when demoing the app
- Remove unused tenant flows that required additional explanations
- Unify expense tracking to a single page so “Expenses” covers all utility bills

### Impact
- UI now exposes four main tabs: Dashboard, Properties, Expenses, Settings
- Local storage and mock data now exclude tenants and transactions arrays (expenses remain for utility tracking)
- Documentation updated (`docs/FINANCES_EXPENSES_EXPLANATION.md`, `docs/DATABASE_SCHEMA_VERIFICATION.md`)

### Migration
- Fresh installs only need `src/database/schema.sql`.
- For legacy databases, manually drop tenant/expense tables or restore the former migration script from Git history if required.
# Removed Elements Documentation

This document tracks all elements that have been removed from the Home Admin application. These elements can be restored in the future if needed.

## ⚠️ IMPORTANT: This file must be updated whenever ANY element is removed from the application.

**PRIORITY:** Always update this documentation file immediately after removing any element, component, feature, or functionality from the application.

## Table of Contents
1. [Tenant Management Removal - November 2025](#tenant-management-removal---november-2025)
2. [Form Simplification - December 2024](#form-simplification---december-2024)
3. [Maintenance System](#maintenance-system)
4. [Dashboard Quick Actions](#dashboard-quick-actions)
5. [Dashboard Alerts & Notifications](#dashboard-alerts--notifications)
6. [Navigation Elements](#navigation-elements)
7. [Form Options](#form-options)
8. [Status Options](#status-options)
9. [Component References](#component-references)
10. [Amenities Feature - REMOVED](#7-amenities-feature---removed-december-2024)
11. [Future Removals](#future-removals)

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
- User profiles now contain no fields (phone field also removed)

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
- **User Profiles table**: Removed `emergency_contact`, `emergency_phone` columns, and `phone` column

**Migration File Created (historical):**
`src/database/migration_remove_simplified_fields.sql` *(removed from main branch; retrieve from Git history if you need to back-port the change)*

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

**User Profiles INSERT (line 110-115):**
```javascript
// Updated: Removed emergency_contact, emergency_phone, and phone from INSERT statement
INSERT INTO user_profiles (user_id)
VALUES ($1)
```

**Query Updates:**
- Removed `p.state, p.zip` from property-tenant join queries
- Removed `emergency_contact, emergency_phone` from getUserProfile fallback return

**For Existing Databases:**
If you encounter these legacy columns, drop them manually or restore the legacy migration script from Git history.

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
        <Button as="a" href="/expenses" leftIcon={<Icon as={DollarIcon} />} colorScheme="purple" variant="outline">
          View Expenses
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
  { href: "/expenses", label: "💡 Expenses", icon: "💡" },
  { href: "/expenses", label: "💸 Expenses", icon: "💸" },
  { href: "/maintenance", label: "🔧 Maintenance", icon: "🔧" }, // REMOVED
  { href: "/settings", label: "⚙️ Settings", icon: "⚙️" },
];
```

### 2. Hardcoded Sidebar Navigation
**Location:** `src/app/expenses/page.js`
**Status:** ❌ REPLACED with PageLayout
**Original Implementation:**
```javascript
// In finances page:
<Box w="250px" bg="white" minH="calc(100vh - 80px)" shadow="sm" p={4}>
  <VStack align="stretch" spacing={2}>
    <Button as="a" href="/" variant="ghost" justifyContent="flex-start">🏠 Dashboard</Button>
    <Button as="a" href="/properties" variant="ghost" justifyContent="flex-start">🏘️ Properties</Button>
    <Button as="a" href="/tenants" variant="ghost" justifyContent="flex-start">👥 Tenants</Button>
    <Button variant="ghost" justifyContent="flex-start" colorScheme="blue">💡 Expenses</Button>
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

### 3. Maintenance Category in Expenses Page
**Location:** `src/app/expenses/page.js`
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
  STRING_AGG(DISTINCT CONCAT(t.name, ' (', pt.start_date, ' - ', pt.end_date, ')'), '; ') as current_tenants
FROM properties p
LEFT JOIN property_amenities pa ON p.id = pa.property_id
LEFT JOIN amenities a ON pa.amenity_id = a.id
...

// AFTER: Removed amenities JOIN and aggregation
SELECT p.*, 
  STRING_AGG(DISTINCT CONCAT(t.name, ' (', pt.start_date, ' - ', pt.end_date, ')'), '; ') as current_tenants
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

**Migration File Created (historical):**
- `src/database/migration_remove_amenities.sql` *(removed from main branch; retrieve from Git history if you need to drop these tables in-place)*

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

---

## 8. Search Functionality Removed from Properties - December 2024

**Location:** Multiple files  
**Status:** ✅ REMOVED (can be restored)

**Reason for Removal:** Simplified properties page to use only status filter, removing search input for cleaner UI.

### 8a. Properties Page Updates

**Location:** `src/app/properties/page.js`  
**Changes:**
- Removed `searchFields={['city', 'status', 'notes']}` prop from UniversalPage

**Before:**
```javascript
<UniversalPage
  dataType="properties"
  title="Property Management"
  currentPage="/properties"
  searchFields={['city', 'status', 'notes']}  // REMOVED
  columns={getColumnsByType('properties')}
  emptyMessage="No properties found"
/>
```

**After:**
```javascript
<UniversalPage
  dataType="properties"
  title="Property Management"
  currentPage="/properties"
  columns={getColumnsByType('properties')}
  emptyMessage="No properties found"
/>
```

### 8b. UniversalPage Component Updates

**Location:** `src/components/shared/UniversalPage.js`  
**Changes:**
- Made search conditional - only shows if `searchFields` prop is provided
- Updated filtering logic to skip search when no searchFields
- Updated SearchFilter props to conditionally pass search-related props

**Filtering Logic:**
```javascript
// BEFORE: Always applied search filter
const filteredData = safeData.filter(item => 
  itemMatchesSearch(item, searchTerm, searchFields) && 
  itemMatchesStatus(item, filterValue)
);

// AFTER: Only applies search if searchFields provided
const filteredData = safeData.filter(item => {
  const matchesSearch = searchFields.length > 0 
    ? itemMatchesSearch(item, searchTerm, searchFields)
    : true;
  return matchesSearch && itemMatchesStatus(item, filterValue);
});
```

**SearchFilter Props:**
```javascript
// BEFORE: Always passed search props
<SearchFilter
  searchTerm={searchTerm}
  onSearchChange={(value) => updatePreferences({ searchTerm: value })}
  filterValue={filterValue}
  onFilterChange={(value) => updatePreferences({ filterValue: value })}
  filterOptions={availableFilterOptions}
  placeholder={`Search ${displayName}...`}
/>

// AFTER: Conditionally passes search props
<SearchFilter
  searchTerm={searchFields.length > 0 ? searchTerm : undefined}
  onSearchChange={searchFields.length > 0 ? (value) => updatePreferences({ searchTerm: value }) : undefined}
  filterValue={filterValue}
  onFilterChange={(value) => updatePreferences({ filterValue: value })}
  filterOptions={availableFilterOptions}
  placeholder={searchFields.length > 0 ? `Search ${displayName}...` : undefined}
/>
```

### 8c. SearchFilter Component Updates

**Location:** `src/components/shared/SearchFilter.js`  
**Changes:**
- Made search input conditional - only renders if `searchTerm` and `onSearchChange` props are provided

**Before:**
```javascript
<Flex gap={4} align="center" flexWrap="wrap">
  <InputGroup maxW="360px" bg="bg.surface" borderRadius="lg">
    {/* Search input always shown */}
  </InputGroup>
  {/* Filter dropdown */}
</Flex>
```

**After:**
```javascript
const showSearch = searchTerm !== undefined && onSearchChange !== undefined;

<Flex gap={4} align="center" flexWrap="wrap">
  {showSearch && (
    <InputGroup maxW="360px" bg="bg.surface" borderRadius="lg">
      {/* Search input only shown if props provided */}
    </InputGroup>
  )}
  {/* Filter dropdown */}
</Flex>
```

### 8d. Impact

**Properties Page:**
- Search input removed from UI
- Only status filter (Available/Occupied) remains
- Cleaner, simpler interface

**Other Pages:**
- Expenses page still uses search (has `searchFields={['description', 'notes']}`)
- Search functionality remains available for other pages that provide `searchFields` prop

**Backend/Database:**
- No backend changes required (search was client-side only)
- No database changes required (no search queries existed)

### 8e. Restoration Instructions

To restore search functionality on properties page:

1. **Restore Properties Page:**
   ```javascript
   <UniversalPage
     dataType="properties"
     title="Property Management"
     currentPage="/properties"
     searchFields={['city', 'status', 'notes']}  // Add back
     columns={getColumnsByType('properties')}
     emptyMessage="No properties found"
   />
   ```

2. **No other changes needed** - UniversalPage and SearchFilter already support conditional search rendering

**Note:** The `itemMatchesSearch` helper function in `src/utils/helpers.js` was kept for potential future use but is no longer called anywhere in the application.

---

## 9. Search Functionality Removed from Entire App - December 2024

**Location:** Multiple files  
**Status:** ✅ REMOVED (can be restored)

**Reason for Removal:** Removed search inputs from all pages (Properties and Expenses) to simplify the UI. Only status filters remain.

### 9a. Expenses Page Updates

**Location:** `src/app/expenses/page.js`  
**Changes:**
- Removed `searchFields={['description', 'notes']}` prop from UniversalPage

**Before:**
```javascript
<UniversalPage
  dataType="expenses"
  title="Expenses"
  currentPage="/expenses"
  searchFields={['description', 'notes']}  // REMOVED
  columns={getColumnsByType('expenses')}
  emptyMessage="No expenses recorded"
/>
```

**After:**
```javascript
<UniversalPage
  dataType="expenses"
  title="Expenses"
  currentPage="/expenses"
  columns={getColumnsByType('expenses')}
  emptyMessage="No expenses recorded"
/>
```

### 9b. UniversalPage Component Updates

**Location:** `src/components/shared/UniversalPage.js`  
**Changes:**
- Removed `searchFields` prop entirely
- Removed `searchTerm` from preferences storage
- Removed search filtering logic
- Removed `itemMatchesSearch` import
- Made SearchFilter conditional - only renders if filterOptions exist

**Filtering Logic:**
```javascript
// BEFORE: Applied both search and status filters
const filteredData = safeData.filter(item => {
  const matchesSearch = searchFields.length > 0 
    ? itemMatchesSearch(item, searchTerm, searchFields)
    : true;
  return matchesSearch && itemMatchesStatus(item, filterValue);
});

// AFTER: Only applies status filter
const filteredData = safeData.filter(item => 
  itemMatchesStatus(item, filterValue)
);
```

**Preferences:**
```javascript
// BEFORE: Stored both searchTerm and filterValue
const [preferences, setPreferences] = usePersistentState(storageKey, {
  searchTerm: "",
  filterValue: "all",
  lastUpdated: null,
});

// AFTER: Only stores filterValue
const [preferences, setPreferences] = usePersistentState(storageKey, {
  filterValue: "all",
  lastUpdated: null,
});
```

**SearchFilter Rendering:**
```javascript
// BEFORE: Always rendered SearchFilter
<SearchFilter
  searchTerm={searchFields.length > 0 ? searchTerm : undefined}
  onSearchChange={...}
  filterValue={filterValue}
  onFilterChange={...}
  filterOptions={availableFilterOptions}
/>

// AFTER: Only renders if filterOptions exist
{availableFilterOptions.length > 0 && (
  <SearchFilter
    filterValue={filterValue}
    onFilterChange={(value) => updatePreferences({ filterValue: value })}
    filterOptions={availableFilterOptions}
  />
)}
```

### 9c. SearchFilter Component Updates

**Location:** `src/components/shared/SearchFilter.js`  
**Changes:**
- Removed all search-related props (`searchTerm`, `onSearchChange`, `searchPlaceholder`)
- Removed search input rendering code
- Removed unused imports (`Input`, `InputGroup`, `InputLeftElement`, `Icon`, `SearchIcon`)
- Added early return if no filterOptions
- Component now only handles filter dropdown

**Before:**
```javascript
export default function SearchFilter({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue = "all",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All",
}) {
  // ... search input rendering code
  const showSearch = searchTerm !== undefined && onSearchChange !== undefined;
  
  return (
    <Card>
      <CardBody>
        <Flex>
          {showSearch && (
            <InputGroup>
              {/* Search input */}
            </InputGroup>
          )}
          {/* Filter dropdown */}
        </Flex>
      </CardBody>
    </Card>
  );
}
```

**After:**
```javascript
export default function SearchFilter({
  filterValue = "all",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All",
}) {
  // Only render if filter options exist
  if (!Array.isArray(filterOptions) || filterOptions.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardBody>
        <Flex>
          {/* Only filter dropdown */}
        </Flex>
      </CardBody>
    </Card>
  );
}
```

### 9d. Impact

**Properties Page:**
- No search input
- Filter dropdown remains (Available/Occupied status filter)

**Expenses Page:**
- No search input
- No filter dropdown (no filterOptions defined for expenses)

**Helper Functions:**
- `itemMatchesSearch` in `src/utils/helpers.js` is no longer used but kept for potential future use

**Backend/Database:**
- No backend changes required (search was client-side only)
- No database changes required (no search queries existed)

### 9e. Restoration Instructions

To restore search functionality:

1. **Restore Expenses Page:**
   ```javascript
   <UniversalPage
     dataType="expenses"
     searchFields={['description', 'notes']}  // Add back
     // ...
   />
   ```

2. **Restore Properties Page (if needed):**
   ```javascript
   <UniversalPage
     dataType="properties"
     searchFields={['city', 'status', 'notes']}  // Add back
     // ...
   />
   ```

3. **Restore UniversalPage:**
   - Add back `searchFields` prop
   - Add back `searchTerm` to preferences
   - Restore search filtering logic
   - Restore SearchFilter search props

4. **Restore SearchFilter:**
   - Add back search-related props
   - Add back search input rendering
   - Restore search imports

**Note:** The `itemMatchesSearch` helper function in `src/utils/helpers.js` is still available and will work when restored.

---

## 10. Export Button Removed from Expenses - December 2024

**Location:** `src/app/expenses/page.js`  
**Status:** ✅ REMOVED (can be restored)

**Reason for Removal:** Export functionality was not implemented, button was placeholder only. Removed to simplify UI.

### 10a. Expenses Page Updates

**Location:** `src/app/expenses/page.js`  
**Changes:**
- Removed `DownloadIcon` import from `@chakra-ui/icons`
- Removed `actions` prop with Export button from UniversalPage

**Before:**
```javascript
import { DownloadIcon } from "@chakra-ui/icons";

export default function Expenses() {
  return (
    <UniversalPage
      dataType="expenses"
      title="Expenses"
      currentPage="/expenses"
      columns={getColumnsByType('expenses')}
      actions={[
        { label: "Export", icon: DownloadIcon, variant: "outline" }  // REMOVED
      ]}
      emptyMessage="No expenses recorded"
    />
  );
}
```

**After:**
```javascript
export default function Expenses() {
  return (
    <UniversalPage
      dataType="expenses"
      title="Expenses"
      currentPage="/expenses"
      columns={getColumnsByType('expenses')}
      emptyMessage="No expenses recorded"
    />
  );
}
```

### 10b. Impact

**Expenses Page:**
- Export button removed from page header
- No export functionality was implemented, so no handlers or API endpoints to remove
- Cleaner UI with only "Add expense" button

**Other Components:**
- `PageHeader` component still supports `actions` prop (used by other pages if needed)
- `UniversalPage` still supports `actions` prop (for future use)
- No breaking changes to other pages

**Backend/Database:**
- No backend changes required (export functionality was never implemented)
- No database changes required

### 10c. Restoration Instructions

To restore export functionality:

1. **Restore Expenses Page:**
   ```javascript
   import { DownloadIcon } from "@chakra-ui/icons";
   
   <UniversalPage
     dataType="expenses"
     actions={[
       { 
         label: "Export", 
         icon: DownloadIcon, 
         variant: "outline",
         onClick: handleExport  // Implement export handler
       }
     ]}
     // ...
   />
   ```

2. **Implement Export Handler:**
   - Create `handleExport` function to export expenses data
   - Implement CSV/Excel/PDF export functionality
   - Add export API endpoint if needed (optional)

**Note:** The `actions` prop system in `UniversalPage` and `PageHeader` is still fully functional and can be used for any future action buttons.

---

## 11. Settings Removed from Sidebar - December 2024

**Location:** `src/utils/constants.js`, `src/components/shared/Sidebar.js`  
**Status:** ✅ REMOVED (Settings still accessible via profile dropdown)

**Reason for Removal:** Settings moved to profile dropdown menu for cleaner sidebar navigation. Dashboard, Properties, and Expenses converted to tabs.

### 11a. Navigation Structure Changes

**Location:** `src/utils/constants.js`  
**Changes:**
- Removed `NAVIGATION_ITEMS` array
- Created `TAB_ITEMS` array for tab-based navigation
- Removed Settings from navigation items

**Before:**
```javascript
export const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { href: "/properties", label: "🏘️ Properties", icon: "🏘️" },
  { href: "/expenses", label: "💡 Expenses", icon: "💡" },
  { href: "/settings", label: "⚙️ Settings", icon: "⚙️" },  // REMOVED
];
```

**After:**
```javascript
export const TAB_ITEMS = [
  { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
  { id: "properties", label: "🏘️ Properties", icon: "🏘️" },
  { id: "expenses", label: "💡 Expenses", icon: "💡" },
];
```

### 11b. Sidebar Updates

**Location:** `src/components/shared/Sidebar.js`  
**Changes:**
- Updated to use `TAB_ITEMS` instead of `NAVIGATION_ITEMS`
- Changed from anchor links (`<a href>`) to button navigation with `router.push()`
- Removed Settings button from sidebar
- Settings remains accessible via profile dropdown in `PageHeader`

**Before:**
```javascript
import { NAVIGATION_ITEMS } from "../../utils/constants";

const NavigationContent = () => (
  <VStack align="stretch" spacing={2}>
    {NAVIGATION_ITEMS.map((item) => (
      <Button
        key={item.href}
        as="a"
        href={item.href}  // Direct navigation
        // ...
      >
        {item.label}
      </Button>
    ))}
  </VStack>
);
```

**After:**
```javascript
import { TAB_ITEMS } from "../../utils/constants";
import { useRouter, usePathname } from "next/navigation";

const NavigationContent = () => (
  <VStack align="stretch" spacing={2}>
    {TAB_ITEMS.map((item) => (
      <Button
        key={item.id}
        onClick={() => router.push(`/${item.id}`)}  // Router navigation
        // ...
      >
        {item.label}
      </Button>
    ))}
  </VStack>
);
```

### 11c. Tab-Based Layout Implementation

**Components Consolidated (December 2024):**
- `src/components/shared/MainTabs.js` - **REMOVED** (merged into dashboard/page.js)
- `src/components/shared/DashboardContent.js` - **REMOVED** (inlined into dashboard/page.js)
- `src/components/shared/PropertiesContent.js` - **REMOVED** (inlined into dashboard/page.js)
- `src/components/shared/ExpensesContent.js` - **REMOVED** (inlined into dashboard/page.js)

**Location:** `src/app/dashboard/page.js`  
**Changes:**
- All tab content logic consolidated into single `dashboard/page.js` file
- Tab switching handled by `TabContent` component within dashboard page
- Removed separate page routes (`/properties`, `/expenses`) - now tabs only
- Removed empty folders (`src/app/properties/`, `src/app/expenses/`)
- Removed unused route constants (`ROUTES.properties`, `ROUTES.expenses`)

**Before:**
```javascript
// Separate components for each tab
// MainTabs.js, DashboardContent.js, PropertiesContent.js, ExpensesContent.js
export default function Dashboard() {
  return (
    <PageLayout title="Dashboard" currentPage="/dashboard">
      <MainTabs onTitleChange={setPageTitle} />
    </PageLayout>
  );
}
```

**After:**
```javascript
// All tab logic consolidated in dashboard/page.js
function TabContent({ onTitleChange }) {
  const { activeTab, getTabTitle } = useTab();
  // ... tab switching logic inline
  switch (activeTab) {
    case 0: return <DashboardStats ... />;
    case 1: return <UniversalPage dataType="properties" ... />;
    case 2: return <UniversalPage dataType="expenses" ... />;
  }
}

export default function Dashboard() {
  return (
    <TabProvider>
      <PageLayout title={pageTitle}>
        <TabContent onTitleChange={setPageTitle} />
      </PageLayout>
    </TabProvider>
  );
}
```

### 11d. Impact

**Sidebar:**
- Settings button removed from sidebar navigation
- Cleaner sidebar with only Dashboard, Properties, Expenses
- Settings still accessible via profile dropdown menu

**Navigation:**
- Dashboard, Properties, Expenses are now tabs instead of separate pages
- Single route (`/dashboard`) with client-side tab switching
- Sidebar navigation switches tabs instantly (no page reload)
- No separate routes for `/properties` or `/expenses` (removed)

**User Experience:**
- Faster navigation between sections (no page reload)
- Consistent layout across all main sections
- Settings moved to more appropriate location (profile menu)

**Backend/Database:**
- No backend changes required
- No database changes required
- Only `/dashboard` route exists (tabs are client-side only)

### 11e. Restoration Instructions

To restore Settings to sidebar:

1. **Update constants:**
   ```javascript
   export const TAB_ITEMS = [
     { id: "dashboard", label: "🏠 Dashboard", icon: "🏠" },
     { id: "properties", label: "🏘️ Properties", icon: "🏘️" },
     { id: "expenses", label: "💡 Expenses", icon: "💡" },
     { id: "settings", label: "⚙️ Settings", icon: "⚙️" },  // Add back
   ];
   ```

2. **Update Sidebar:**
   - Add Settings button back to navigation
   - Ensure Settings page route is accessible

**Note:** Settings is still fully functional and accessible via the profile dropdown menu in the page header.

---

## 12. Component Consolidation - December 2024

**Location:** `src/components/shared/`, `src/app/`  
**Status:** ✅ CONSOLIDATED (4 component files removed, logic merged into dashboard page)

**Reason for Consolidation:** Reduced file count by consolidating thin wrapper components into the main dashboard page. Simplified architecture with fewer files to maintain.

### 12a. Components Removed

**Files Deleted:**
- `src/components/shared/MainTabs.js` - Merged into `dashboard/page.js`
- `src/components/shared/DashboardContent.js` - Inlined into `dashboard/page.js`
- `src/components/shared/PropertiesContent.js` - Inlined into `dashboard/page.js`
- `src/components/shared/ExpensesContent.js` - Inlined into `dashboard/page.js`

**Empty Folders Removed:**
- `src/app/properties/` - Empty folder after removing redirect page
- `src/app/expenses/` - Empty folder after removing redirect page

**Unused Constants Removed:**
- `ROUTES.properties` - Removed from `src/constants/app.js`
- `ROUTES.expenses` - Removed from `src/constants/app.js`

### 12b. Consolidation Details

**Before:**
```
src/components/shared/
├── MainTabs.js (36 lines) - Tab container
├── DashboardContent.js (37 lines) - Dashboard wrapper
├── PropertiesContent.js (15 lines) - Properties wrapper
└── ExpensesContent.js (15 lines) - Expenses wrapper

src/app/
├── dashboard/page.js (25 lines)
├── properties/ (empty folder)
└── expenses/ (empty folder)
```

**After:**
```
src/components/shared/
└── (4 files removed)

src/app/
└── dashboard/page.js (94 lines) - All tab logic consolidated here
```

### 12c. Implementation

**Location:** `src/app/dashboard/page.js`  
**Changes:**
- Created `TabContent` component within dashboard page
- Inlined all tab rendering logic (Dashboard, Properties, Expenses)
- Removed dependency on separate content components
- Single file contains all tab switching logic

**Code Structure:**
```javascript
function TabContent({ onTitleChange }) {
  const { activeTab, getTabTitle } = useTab();
  // Dashboard data fetching
  const { stats, activities, loading, error } = useDashboardData(user?.id);
  
  // Tab switching logic
  switch (activeTab) {
    case 0: return <DashboardStats ... />;
    case 1: return <UniversalPage dataType="properties" ... />;
    case 2: return <UniversalPage dataType="expenses" ... />;
  }
}

export default function Dashboard() {
  return (
    <TabProvider>
      <PageLayout title={pageTitle}>
        <TabContent onTitleChange={setPageTitle} />
      </PageLayout>
    </TabProvider>
  );
}
```

### 12d. Impact

**File Reduction:**
- Removed 4 component files (103 lines total)
- Removed 2 empty folders
- Removed 2 unused route constants
- Consolidated logic into single dashboard page (94 lines)

**Benefits:**
- Fewer files to maintain
- All tab logic in one place (easier to understand)
- Reduced component hierarchy depth
- Faster development (no need to jump between files)

**Functionality:**
- All features remain unchanged
- Tab switching still works instantly
- No breaking changes to user experience

### 12e. Restoration Instructions

To restore separate component files:

1. **Create MainTabs.js:**
   ```javascript
   // Extract TabContent component from dashboard/page.js
   // Move to src/components/shared/MainTabs.js
   ```

2. **Create Content Components:**
   ```javascript
   // Extract each case from switch statement
   // Create DashboardContent.js, PropertiesContent.js, ExpensesContent.js
   ```

3. **Update dashboard/page.js:**
   ```javascript
   import MainTabs from "../../components/shared/MainTabs";
   // Use MainTabs component instead of TabContent
   ```

**Note:** Current consolidated approach is recommended for simpler maintenance.

---

## 13. Logger Utility Removed - December 2024

**Location:** `src/utils/logger.js`  
**Status:** ✅ REMOVED (replaced with direct console calls)

**Reason for Removal:** Simplified logging by removing abstraction layer. Direct console calls with prefixes provide same functionality with less code.

### 13a. Logger Utility

**File Deleted:**
- `src/utils/logger.js` (79 lines)

**Replacement:**
- All `logger.error()` → `console.error('[ERROR] ...')`
- All `logger.warn()` → `console.warn('[WARN] ...')`
- All `logger.info()` → `console.log('[INFO] ...')`
- All `logger.auth()` → `console.log('[AUTH] ...')`
- All `logger.data()` → `console.log('[DATA] ...')`

**Files Updated:**
- `src/contexts/AuthContext.js` - 10 logger calls replaced
- `src/components/shared/UniversalPage.js` - 3 logger calls replaced
- `src/app/settings/page.js` - 3 logger calls replaced
- `src/app/api/auth/login/route.js` - 2 logger calls replaced
- `src/app/api/auth/register/route.js` - 1 logger call replaced

**Development-Only Logging:**
- Maintained same behavior using `process.env.NODE_ENV === 'development'` checks
- Logs only show in development mode, not in production

### 13b. Impact

**Code Reduction:**
- Removed 79 lines (logger.js)
- Simplified logging calls (no abstraction layer)
- Same functionality with direct console calls

**Benefits:**
- Fewer files to maintain
- No dependency on logger utility
- Direct console calls are easier to debug
- Prefixes maintained for consistency (`[ERROR]`, `[AUTH]`, etc.)

---

## 14. Helper Utilities Removed - December 2024

**Location:** `src/utils/helpers.js`  
**Status:** ✅ REMOVED (inlined into components)

**Reason for Removal:** Helper functions were only used in one place. Inlining reduces file count and improves code clarity.

### 14a. Helper Functions

**File Deleted:**
- `src/utils/helpers.js` (16 lines)

**Functions Removed:**
- `itemMatchesSearch` - Unused (never called)
- `itemMatchesStatus` - Inlined into `UniversalPage.js`

**Replacement:**
```javascript
// Before: src/utils/helpers.js
export const itemMatchesStatus = (item, filterValue, statusField = 'status') => {
  if (filterValue === 'all' || !item || typeof item !== 'object') return true;
  return item[statusField] === filterValue;
};

// After: Inlined in UniversalPage.js
const filteredData = safeData.filter(item => {
  if (filterValue === 'all' || !item || typeof item !== 'object') return true;
  return item.status === filterValue;
});
```

**Files Updated:**
- `src/components/shared/UniversalPage.js` - Inlined filter logic

### 14b. Impact

**Code Reduction:**
- Removed 16 lines (helpers.js)
- Inlined filter logic directly where used
- Removed unused `itemMatchesSearch` function

**Benefits:**
- Fewer files to maintain
- Filter logic is now co-located with usage
- No unnecessary abstraction for single-use functions

---

## 15. Barrel Export Removed - December 2024

**Location:** `src/components/shared/formFields/index.js`  
**Status:** ✅ REMOVED (direct imports now)

**Reason for Removal:** Barrel export file was unnecessary. Direct imports are clearer and reduce file count.

### 15a. Barrel Export File

**File Deleted:**
- `src/components/shared/formFields/index.js` (7 lines)

**Before:**
```javascript
// formFields/index.js
import TextField from './TextField';
import TextareaField from './TextareaField';
import NumberField from './NumberField';
import SelectField from './SelectField';

export { TextField, TextareaField, NumberField, SelectField };
```

**After:**
```javascript
// DynamicForm.js - Direct imports
import TextField from "./formFields/TextField";
import TextareaField from "./formFields/TextareaField";
import NumberField from "./formFields/NumberField";
import SelectField from "./formFields/SelectField";
```

**Files Updated:**
- `src/components/shared/DynamicForm.js` - Changed to direct imports

### 15b. Impact

**Code Reduction:**
- Removed 7 lines (barrel export file)
- Direct imports are clearer and more explicit

**Benefits:**
- Fewer files to maintain
- Clearer import paths
- No unnecessary abstraction layer

---

## 16. Environment Config File Removed - December 2024

**Location:** `src/config/env.js`  
**Status:** ✅ REMOVED (inlined into login route)

**Reason for Removal:** Only `getDemoUsers()` function was used. Inlining reduces file count and keeps related code together.

### 16a. Environment Config File

**File Deleted:**
- `src/config/env.js` (58 lines)

**Functions Removed:**
- `getDemoUsers()` - Inlined into `src/app/api/auth/login/route.js`
- `env` export - Unused (never imported)

**Replacement:**
```javascript
// Before: src/config/env.js
export const getDemoUsers = () => {
  // ... validation and user creation logic
};

// After: Inlined in src/app/api/auth/login/route.js
const getDemoUsers = () => {
  // ... same validation and user creation logic
};
```

**Files Updated:**
- `src/app/api/auth/login/route.js` - Inlined `getDemoUsers()` function

### 16b. Impact

**Code Reduction:**
- Removed 58 lines (env.js)
- Inlined function directly where used
- Removed unused `env` export

**Benefits:**
- Fewer files to maintain
- Demo user logic is now co-located with login route
- No unnecessary abstraction for single-use function

---

## 17. React Key Prop Warning Fix - December 2024

**Location:** `src/components/shared/DynamicForm.js`  
**Status:** ✅ FIXED

**Reason for Fix:** React was warning about `key` prop being spread into JSX components. Fixed by passing `key` directly.

### 17a. React Warning Fix

**Problem:**
```javascript
// Before: key was in commonProps and spread
const commonProps = { key: name, name, label, ... };
return <TextField {...commonProps} />; // React warning
```

**Solution:**
```javascript
// After: key passed directly, not in spread
const commonProps = { name, label, ... }; // No key here
return <TextField key={name} {...commonProps} />; // No warning
```

**Files Updated:**
- `src/components/shared/DynamicForm.js` - Fixed all 6 field component instances

### 17b. Impact

**Code Quality:**
- Fixed 6 React warnings (TextField, NumberField x3, TextareaField, SelectField)
- Follows React best practices for `key` prop
- No functionality changes

---

## 18. TabContext Fix for Settings Page - December 2024

**Location:** `src/components/shared/Sidebar.js`, `src/contexts/TabContext.js`  
**Status:** ✅ FIXED

**Reason for Fix:** `Sidebar` was using `useTab()` hook which requires `TabProvider`, but Settings page doesn't have it. Fixed by making `Sidebar` work without `TabProvider`.

### 18a. TabContext Fix

**Problem:**
- `Sidebar` component used `useTab()` hook
- `TabProvider` only wraps `/dashboard` page
- Settings page doesn't have `TabProvider`
- Error: "useTab must be used within TabProvider"

**Solution:**
```javascript
// Before: Sidebar.js
import { useTab } from "../../contexts/TabContext";
const { activeTab, switchTab } = useTab(); // Throws error if no TabProvider

// After: Sidebar.js
import { useContext } from "react";
import { TabContext } from "../../contexts/TabContext";
const tabContext = useContext(TabContext);
const hasTabContext = !!tabContext;

// Use tab switching if available, otherwise navigate to dashboard
if (hasTabContext) {
  tabContext.switchTab(index);
} else {
  router.push(ROUTES.dashboard);
}
```

**Files Updated:**
- `src/contexts/TabContext.js` - Exported `TabContext` directly
- `src/components/shared/Sidebar.js` - Added fallback logic for missing `TabProvider`

### 18b. Impact

**Functionality:**
- `Sidebar` now works on both `/dashboard` (with `TabProvider`) and `/settings` (without `TabProvider`)
- On dashboard: Uses instant tab switching
- On settings: Navigates to dashboard when clicking sidebar items
- No more runtime errors

**Code Quality:**
- More robust component that handles both contexts gracefully
- Better user experience (no errors, smooth navigation)

---

## Properties Filter Removal - December 2025

### Overview
Removed the filter dropdown functionality from the Properties page to simplify the UI. All properties are now displayed without status-based filtering.

### Elements Removed

#### 1. Properties Filter Options
**Location:** `src/utils/constants.js`  
**Status:** ✅ REMOVED

**Before:**
```javascript
export const FILTER_OPTIONS = {
  properties: [
    { value: "Occupied", label: "Occupied" },
    { value: "Available", label: "Available" },
  ],
};
```

**After:**
```javascript
// Filter options for different pages
// Note: Properties filter removed - all properties are shown without filtering
export const FILTER_OPTIONS = {};
```

#### 2. Filter Logic in UniversalPage
**Location:** `src/components/shared/UniversalPage.js`  
**Status:** ✅ REMOVED

**Changes:**
- Removed `filterOptions` prop from component
- Removed `filterValue` from localStorage preferences
- Removed filter logic that filtered by status
- Removed SearchFilter component import and usage
- Removed FILTER_OPTIONS import

**Before:**
```javascript
const [preferences, setPreferences] = usePersistentState(storageKey, {
  filterValue: "all",
  lastUpdated: null,
});

const { filterValue = "all" } = preferences;

const filteredData = safeData.filter(item => {
  if (filterValue === 'all' || !item || typeof item !== 'object') return true;
  return item.status === filterValue;
});

{availableFilterOptions.length > 0 && (
  <SearchFilter
    filterValue={filterValue}
    onFilterChange={(value) => updatePreferences({ filterValue: value })}
    filterOptions={availableFilterOptions}
  />
)}
```

**After:**
```javascript
const [preferences, setPreferences] = usePersistentState(storageKey, {
  lastUpdated: null,
});

// Ensure data is always an array - no filtering applied
const filteredData = Array.isArray(data) ? data : [];

// SearchFilter component removed - no filter dropdown displayed
```

#### 3. Component Props
**Location:** `src/components/shared/UniversalPage.js`  
**Status:** ✅ REMOVED

**Removed Props:**
- `filterOptions` - No longer accepts filter options as prop

**Impact:**
- Properties page now shows all properties regardless of status
- No filter dropdown displayed on properties page
- Simpler UI with less complexity
- Filter functionality can be restored by adding filterOptions back to FILTER_OPTIONS

### Reason for Removal
Simplify the properties page UI by removing the status filter dropdown. All properties are displayed in a single list without filtering options.

### Impact
- Properties page is simpler and cleaner
- No filter dropdown on properties page
- All properties displayed regardless of status
- Filter functionality can be restored if needed in the future

---

## Code Cleanup - Unused Components and File Consolidation - December 2025

### Overview
Removed unused components and consolidated small utility files to reduce codebase complexity and file count.

### Elements Removed

#### 1. UserProfile Component
**Location:** `src/components/shared/UserProfile.js`  
**Status:** ✅ DELETED

**Reason:** Component was no longer used after removing the "Manage Profile" button from settings page. The component only displayed "No profile fields available" since phone field was removed.

**Impact:**
- Removed 164 lines of unused code
- Settings page simplified (no modal component needed)
- User profile management handled directly in settings page

#### 2. SearchFilter Component
**Location:** `src/components/shared/SearchFilter.js`  
**Status:** ✅ DELETED

**Reason:** Component was no longer used after removing filter functionality from properties page. The filter dropdown was removed to simplify the UI.

**Impact:**
- Removed 102 lines of unused code
- No filter dropdown components in codebase
- Simpler UniversalPage component

#### 3. Constants File Consolidation
**Location:** `src/utils/constants.js`  
**Status:** ✅ DELETED (consolidated into `src/constants/app.js`)

**Changes:**
- Moved `TAB_ITEMS` from `src/utils/constants.js` → `src/constants/app.js`
- Removed empty `FILTER_OPTIONS` export
- Deleted `src/utils/constants.js` file entirely
- Updated `Sidebar.js` import to use `constants/app.js`

**Before:**
```javascript
// src/utils/constants.js
export const TAB_ITEMS = [...];
export const FILTER_OPTIONS = {};

// src/components/shared/Sidebar.js
import { TAB_ITEMS } from "../../utils/constants";
```

**After:**
```javascript
// src/constants/app.js
export const TAB_ITEMS = [...];

// src/components/shared/Sidebar.js
import { TAB_ITEMS, ROUTES } from "../../constants/app";
```

**Impact:**
- Reduced file count by 1
- All constants now in single location (`src/constants/app.js`)
- Better organization and easier to maintain
- Removed empty/unused exports

### Files Deleted
1. `src/components/shared/UserProfile.js` (164 lines)
2. `src/components/shared/SearchFilter.js` (102 lines)
3. `src/utils/constants.js` (11 lines)

### Files Modified
1. `src/constants/app.js` - Added TAB_ITEMS export
2. `src/components/shared/Sidebar.js` - Updated import path

### Total Code Reduction
- **3 files deleted**
- **~277 lines of code removed**
- **1 file consolidated**
- **Cleaner, more maintainable codebase**

---

## Code Optimization - Redundant Code Removal - December 2025

### Overview
Removed redundant code, unused storage operations, and deprecated references to improve codebase efficiency and maintainability.

### Elements Removed/Optimized

#### 1. Unused Preferences Storage in UniversalPage
**Location:** `src/components/shared/UniversalPage.js`  
**Status:** ✅ REMOVED

**Changes:**
- Removed unused `usePersistentState` hook import
- Removed unused `STORAGE_KEYS` import
- Removed `preferences` state and `updatePreferences` function
- Removed localStorage operations that were never read

**Before:**
```javascript
import usePersistentState from "../../hooks/usePersistentState";
import { STORAGE_KEYS } from "../../constants/app";

const storageKey = `${STORAGE_KEYS.preferences}_${dataType}`;
const [preferences, setPreferences] = usePersistentState(storageKey, {
  lastUpdated: null,
});

const updatePreferences = (updates) =>
  setPreferences((prev) => ({
    ...prev,
    ...updates,
    lastUpdated: new Date().toISOString(),
  }));
```

**After:**
```javascript
// Preferences storage removed - was never used
```

**Impact:**
- Removed unnecessary localStorage operations
- Reduced component complexity
- Improved performance (no localStorage reads/writes)

#### 2. Unused Activity Type Mappings
**Location:** `src/components/shared/DashboardStats.js`  
**Status:** ✅ REMOVED

**Changes:**
- Removed `payment` and `tenant` types from `getActivityIcon` function
- Removed `getActivityColor` function entirely (was never used)
- Only kept `expense` and `property` types that are actually used

**Before:**
```javascript
const getActivityIcon = (type) => {
  const icons = {
    payment: "💰",
    tenant: "👥",
    expense: "💸",
    property: "🏠",
  };
  return icons[type] || "📊";
};

const getActivityColor = (type) => {
  const colors = {
    payment: "green",
    tenant: "blue",
    expense: "orange",
    property: "purple",
  };
  return colors[type] || "gray";
};
```

**After:**
```javascript
const getActivityIcon = (type) => {
  const icons = {
    expense: "💸",
    property: "🏠",
  };
  return icons[type] || "📊";
};
```

**Impact:**
- Removed dead code for deprecated features (tenants, payments)
- Cleaner, more focused code
- Only includes types that are actually used

#### 3. Redundant UserId Validation
**Location:** `src/app/api/user-profiles/[userId]/route.js` (PUT handler)  
**Status:** ✅ FIXED

**Changes:**
- Removed duplicate `userId` validation (was checked twice)
- Simplified empty profile update logic
- Removed unnecessary empty `updates` object creation

**Before:**
```javascript
export async function PUT(request, { params }) {
  const { userId } = params;
  const body = await request.json();
  const updates = {};

  if (Object.keys(updates).length === 0 && Object.keys(body).length > 0) {
    const existing = await databaseService.getUserProfile(userId);
    return NextResponse.json(existing || {});
  }
  
  if (!userId) {  // Duplicate check
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const profile = await databaseService.updateUserProfile(userId, updates);
  return NextResponse.json(profile || {});
}
```

**After:**
```javascript
export async function PUT(request, { params }) {
  const { userId } = params;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Currently no profile fields to update, but keeping structure for future fields
  const existing = await databaseService.getUserProfile(userId);
  return NextResponse.json(existing || {});
}
```

**Impact:**
- Removed duplicate validation
- Simplified logic flow
- More efficient code execution

#### 4. Variable Naming Improvement
**Location:** `src/components/shared/UniversalPage.js`  
**Status:** ✅ RENAMED

**Changes:**
- Renamed `filteredData` to `displayData` for clarity
- Variable name now accurately reflects that no filtering is applied

**Before:**
```javascript
const filteredData = Array.isArray(data) ? data : [];
```

**After:**
```javascript
const displayData = Array.isArray(data) ? data : [];
```

**Impact:**
- More accurate variable naming
- Better code readability
- Prevents confusion about filtering logic

#### 5. Updated Text References
**Location:** `src/components/shared/DashboardStats.js`  
**Status:** ✅ UPDATED

**Changes:**
- Updated "Ready for tenants" to "Available" to reflect removal of tenant feature

**Before:**
```javascript
helpText="Ready for tenants"
```

**After:**
```javascript
helpText="Available"
```

**Impact:**
- Updated UI text to match current functionality
- Removed references to deprecated tenant feature

### Files Modified
1. `src/components/shared/UniversalPage.js` - Removed preferences storage, renamed variable
2. `src/components/shared/DashboardStats.js` - Removed unused activity types, updated text
3. `src/app/api/user-profiles/[userId]/route.js` - Fixed redundant validation, simplified logic

### Total Optimization
- **Removed ~15 lines of unused code**
- **Eliminated unnecessary localStorage operations**
- **Removed dead code for deprecated features**
- **Fixed redundant validation logic**
- **Improved code clarity and maintainability**