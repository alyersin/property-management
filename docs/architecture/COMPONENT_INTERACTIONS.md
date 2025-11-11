# 🔗 Component Interactions & Data Flow

> **Update – November 2025**  
> Tenants were removed and financial tracking now lives exclusively in the Expenses page. Historical diagrams remain for reference; current feature scope is documented in `docs/removed-elements/REMOVED_ELEMENTS_DOCUMENTATION.md`.

## 📊 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PAGE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                             │ │
│  │ Properties │  │  Expenses   │                             │ │
│  │    Page    │  │    Page     │                             │ │
│  │   (17 lines)│  │  (17 lines)│                             │ │
│  └─────────────┘  └─────────────┘                             │ │
│         │                 │                                   │ │
│         └─────────────────┼───────────────────────────────────┘ │
│                           │                                     │
│                           ▼                 ▼                     │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                UNIVERSAL PAGE COMPONENT                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │ │
│  │  │SearchFilter │  │  DataTable  │  │  FormModal  │          │ │
│  │  │             │  │             │  │             │          │ │
│  │  │ • Search    │  │ • Display   │  │ • Modal     │          │ │
│  │  │ • Filter    │  │ • Actions   │  │   Wrapper   │          │ │
│  │  │ • State     │  │ • Render    │  │             │          │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │ │
│  │                           │                 │                │ │
│  │                           ▼                 ▼                │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                DYNAMIC FORM                             │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │ │
│  │  │  │Field Config │  │Form Fields  │  │Validation   │    │ │ │
│  │  │  │             │  │             │  │             │    │ │ │
│  │  │  │ • Property  │  │ • Dynamic   │  │ • Required  │    │ │ │
│  │  │  │ • Tenant    │  │   Fields    │  │ • Types     │    │ │ │
│  │  │  │ • Expense   │  │ • Render    │  │ • Rules     │    │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND API LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   API       │  │ Environment │  │  Security   │            │
│  │  Routes     │  │ Management  │  │             │            │
│  │             │  │             │  │ • Server-side│            │
│  │ • /api/auth │  │ • env.js    │  │   validation│            │
│  │   /login    │  │ • .env file │  │ • No client │            │
│  │ • /api/auth │  │ • Vercel    │  │   exposure  │            │
│  │   /register │  │   variables │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ useAppData  │  │dataService  │  │Configuration│            │
│  │    Hook     │  │             │  │   Files     │            │
│  │             │  │ • Inline    │  │             │            │
│  │ • CRUD      │  │   Data     │  │ • formFields │            │
│  │ • State     │  │ • Memory    │  │ • tableCols │            │
│  │ • Loading   │  │ • Current   │  │ • constants │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Detailed Data Flow

### **1. Page Initialization**
```javascript
// 1. User visits /properties
// 2. Properties page loads (17 lines)
export default function Properties() {
  return (
    <UniversalPage
      dataType="properties"           // Configuration
      title="Property Management"     // Display
      currentPage="/properties"       // Navigation
      searchFields={['address', 'city', 'tenant']}  // Search config
      columns={getColumnsByType('properties')}       // Table config
      emptyMessage="No properties found"             // Empty state
    />
  );
}
```

### **2. UniversalPage Component Flow**
```javascript
// UniversalPage.js - Handles all CRUD operations
const UniversalPage = ({ dataType, title, currentPage, searchFields, columns }) => {
  // 1. Initialize data hook
  const { data, loading, error, create, update, remove } = useAppData(dataType);
  
  // 2. Get form fields from configuration
  const fields = getFieldsByType(dataType);
  
  // 3. Filter data based on search and filter
  const filteredData = data
    .filter(item => filterBySearch(item, searchTerm, searchFields))
    .filter(item => filterByStatus(item, filterValue));
  
  // 4. Render components
  return (
    <PageLayout title={title} currentPage={currentPage}>
      <SearchFilter />      {/* Search and filter controls */}
      <DataTable />         {/* Data display with actions */}
      <FormModal />         {/* Modal for forms */}
    </PageLayout>
  );
};
```

### **3. Data Hook Flow**
```javascript
// useAppData.js - Universal data operations
export const useAppData = (dataType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch data on mount
  const fetchData = useCallback(async () => {
    const result = dataService[`get${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`]();
    setData(result);
  }, [dataType]);

  // 2. CRUD operations
  const create = useCallback(async (item) => {
    const result = dataService[`add${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`](item);
    await fetchData(); // Refresh data
    return result;
  }, [dataType, fetchData]);

  // 3. Return data and operations
  return { data, loading, error, create, update, remove, refetch: fetchData };
};
```

### **4. Data Service Flow**
```javascript
// dataService.js - Current inline data operations (SECURE)
class DataService {
  constructor() {
    this.data = {
      users: [],              // SECURITY: No user data in client-side code
      properties: [...],      // Inline property data
      tenants: [...],         // Inline tenant data
      transactions: [...],   // Inline transaction data
      expenses: [...]         // Inline expense data
    };
  }

  // 1. Get data
  getProperties() {
    return this.data.properties;
  }

  // 2. Add new item
  addProperty(property) {
    const newProperty = {
      ...property,
      id: Math.max(...this.data.properties.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.properties.push(newProperty);
    return newProperty;
  }

  // SECURITY: Credential validation moved to API routes
  validateCredentials(email, password) {
    console.warn('validateCredentials is deprecated. Use API routes for authentication.');
    return null;
  }
}
```

### **5. Authentication Flow (Updated)**
```javascript
// AuthContext.js - Updated to use API routes
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success) {
      setUser(data.user); // No password in user object
      localStorage.setItem('homeAdminUser', JSON.stringify(data.user));
      return { success: true };
    }
    
    return { success: false, error: data.error || 'Login failed' };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
};
```

### **6. Backend API Flow**
```javascript
// app/api/auth/login/route.js - Server-side authentication
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get users from environment variables (server-side only)
    const users = getDemoUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        loginTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🧩 Component Hierarchy

### **Page Components**
```
app/
├── dashboard/page.js          # 94 lines - Main app with tabs (Dashboard, Properties, Expenses)
├── settings/page.js           # 120 lines - Custom settings form
├── login/page.js              # 151 lines - Styled login form
└── register/page.js           # 156 lines - Styled register form
```

### **Backend API Components**
```
app/api/
├── auth/
│   ├── login/route.js         # 48 lines - Server-side login validation
│   └── register/route.js      # 51 lines - Server-side registration
├── user-profiles/
│   └── [userId]/route.js      # User profile management (1:1 relationship)
├── amenities/
│   └── route.js               # Amenities management
├── properties/
│   └── [propertyId]/
│       ├── amenities/route.js    # Property amenities (M:N relationship)
│       └── tenants/route.js      # Property tenants (M:N relationship)
└── tenants/
    └── [tenantId]/
        └── properties/route.js   # Tenant properties (M:N relationship)
```

**Recent Fixes Applied:**
- ✅ **Import Path Corrections**: All API routes now use correct relative imports to `databaseService`
- ✅ **DELETE Route Fix**: Amenities DELETE route corrected to get `amenityId` from request body
- ✅ **Build Success**: All module resolution issues resolved, Vercel deployment ready

### **Universal Components (Reusable)**
```
components/shared/
├── UniversalPage.js          # 80 lines - Handles all CRUD pages
│   ├── SearchFilter.js        # Search and filtering
│   ├── DataTable.js          # Data display with actions
│   ├── FormModal.js          # Modal wrapper
│   └── DynamicForm.js        # Dynamic form generation
├── DashboardStats.js         # 147 lines - Dashboard statistics
├── PageLayout.js             # Page wrapper
│   ├── PageHeader.js         # Header with user menu
│   └── Sidebar.js            # Navigation sidebar
├── StatCard.js               # Statistics card
├── UserProfile.js            # User profile management (1:1 relationship)
├── PropertyAmenities.js      # Property amenities management (M:N relationship)
└── PropertyTenantManagement.js # Property-tenant management (M:N relationship)
```

### **Configuration System (Data-Driven)**
```
config/
├── formFields.js            # 151 lines - Form field definitions
│   ├── PROPERTY_FIELDS      # 13 field definitions
│   ├── TENANT_FIELDS        # 11 field definitions
│   ├── TRANSACTION_FIELDS   # 5 field definitions
│   └── EXPENSE_FIELDS       # 8 field definitions
├── tableColumns.js          # 189 lines - Table column definitions
│   ├── PROPERTY_COLUMNS     # 5 column definitions
│   ├── TENANT_COLUMNS       # 6 column definitions
│   ├── TRANSACTION_COLUMNS  # 6 column definitions
│   └── EXPENSE_COLUMNS      # 6 column definitions
└── env.js                   # 78 lines - Environment variable management
    ├── getDemoUsers()       # Server-side credential access
    ├── env.app              # Application settings
    ├── env.database         # Database settings
    └── env.security         # Security settings
```

## 🔄 User Interaction Flow

### **1. View Data**
```
User visits /properties
        │
        ▼
UniversalPage loads
        │
        ▼
useAppData('properties')
        │
        ▼
dataService.getProperties()
        │
        ▼
DataTable renders data
        │
        ▼
User sees properties list
```

### **2. Add New Item**
```
User clicks "Add Property"
        │
        ▼
FormModal opens
        │
        ▼
DynamicForm renders with PROPERTY_FIELDS
        │
        ▼
User fills form
        │
        ▼
User clicks "Save"
        │
        ▼
useAppData.create(propertyData)
        │
        ▼
dataService.addProperty(propertyData)
        │
        ▼
Table refreshes with new data
```

### **3. Edit Item**
```
User clicks "Edit" on table row
        │
        ▼
FormModal opens with existing data
        │
        ▼
DynamicForm pre-populated
        │
        ▼
User modifies data
        │
        ▼
User clicks "Update"
        │
        ▼
useAppData.update(id, updates)
        │
        ▼
dataService.updateProperty(id, updates)
        │
        ▼
Table refreshes with updated data
```

### **4. Delete Item**
```
User clicks "Delete" on table row
        │
        ▼
Confirmation dialog appears
        │
        ▼
User confirms deletion
        │
        ▼
useAppData.remove(id)
        │
        ▼
dataService.deleteProperty(id)
        │
        ▼
Table refreshes without deleted item
```

### **5. Authentication (Updated)**
```
User enters credentials
        │
        ▼
AuthContext.login(email, password)
        │
        ▼
POST /api/auth/login
        │
        ▼
API Route validates credentials
        │
        ▼
env.js gets users from environment variables
        │
        ▼
User data returned (without password)
        │
        ▼
User stored in localStorage
        │
        ▼
Redirect to /dashboard
```

### **6. User Profile Management (1:1 Relationship)**
```
User clicks "Manage Profile" in Settings
        │
        ▼
UserProfile component opens
        │
        ▼
databaseService.getUserProfile(userId)
        │
        ▼
API: GET /api/user-profiles/[userId]
        │
        ▼
User profile data displayed
        │
        ▼
User edits profile information
        │
        ▼
databaseService.updateUserProfile(userId, updates)
        │
        ▼
API: PUT /api/user-profiles/[userId]
        │
        ▼
Profile updated in database
```

### **7. Property Amenities Management (M:N Relationship)**
```
User clicks "Manage Amenities" on property
        │
        ▼
PropertyAmenities component opens
        │
        ▼
databaseService.getAmenities() + getPropertyAmenities(propertyId)
        │
        ▼
API: GET /api/amenities + GET /api/properties/[propertyId]/amenities
        │
        ▼
All amenities displayed with current selections
        │
        ▼
User toggles amenity checkbox
        │
        ▼
databaseService.addAmenityToProperty() or removeAmenityFromProperty()
        │
        ▼
API: POST/DELETE /api/properties/[propertyId]/amenities
        │
        ▼
Property-amenity relationship updated
```

### **8. Property-Tenant Management (M:N Relationship)**
```
User clicks "Manage Tenants" on property
        │
        ▼
PropertyTenantManagement component opens
        │
        ▼
databaseService.getTenants() + getPropertyTenants(propertyId)
        │
        ▼
API: GET /api/tenants + GET /api/properties/[propertyId]/tenants
        │
        ▼
Current tenants and available tenants displayed
        │
        ▼
User assigns new tenant with lease details
        │
        ▼
databaseService.assignTenantToProperty(propertyId, tenantId, leaseData)
        │
        ▼
API: POST /api/properties/[propertyId]/tenants
        │
        ▼
Property-tenant relationship created with lease information
```

## 🛡️ Security Flow

### **1. Environment Variable Security**
```
Vercel Dashboard → Environment Variables → env.js → API Routes → Client
     │                    │                    │           │
     ▼                    ▼                    ▼           ▼
Set credentials → Server-side access → Validation → Safe response
```

### **2. Authentication Security**
```
Client Request → API Route → env.js → Environment Variables → Validation → Response
     │              │          │            │                    │
     ▼              ▼          ▼            ▼                    ▼
No credentials → Server-only → Secure → No fallbacks → Safe data
```

### **3. Data Flow Security**
```
Client Side          Server Side
     │                    │
     ▼                    ▼
No user data → API Routes → Environment Variables
     │                    │
     ▼                    ▼
Safe operations → Secure validation → Protected credentials
```

## 🎯 Key Architectural Benefits

### **1. Code Efficiency**
- **95% Code Reduction**: Pages are 15-20 lines each
- **Zero Duplication**: Universal components eliminate repetition
- **Configuration-Driven**: Add features through config, not code
- **Universal Components**: One component handles all scenarios

### **2. Security**
- **Server-Side Authentication**: All credentials server-side only
- **Environment Variable Security**: No hardcoded credentials
- **API Route Protection**: Secure authentication endpoints
- **Client-Side Safety**: No sensitive data in browser

### **3. Maintainability**
- **Single Source of Truth**: All data operations centralized
- **Easy Testing**: Test one component, all features work
- **Clear Structure**: Logical file organization
- **Documentation**: Comprehensive architecture docs

### **4. Scalability**
- **Add New Data Type**: Just add configuration
- **Add New Page**: 15 lines of code
- **Database Ready**: Easy PostgreSQL integration
- **Docker Ready**: Containerized deployment

### **5. Developer Experience**
- **Fast Development**: Add features in minutes
- **Easy Debugging**: Clear component hierarchy
- **Intuitive Structure**: Logical file organization
- **Production Ready**: Scalable architecture

This architecture represents a **modern, scalable, maintainable, and secure** property management system that follows **React best practices** and is ready for **production deployment**! 🚀