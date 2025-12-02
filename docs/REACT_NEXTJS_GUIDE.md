# React/Next.js Functionality Guide

This document explains how React and Next.js features work throughout your application, covering hooks, state management, props, and component patterns.

---

## Table of Contents

1. [Hooks](#hooks)
2. [State Management](#state-management)
3. [Props & Component Composition](#props--component-composition)
4. [Next.js App Router](#nextjs-app-router)
5. [Data Flow](#data-flow)
6. [Component Patterns](#component-patterns)

---

## Hooks

### Custom Hooks

#### 1. `useAppData` Hook (`src/hooks/useAppData.js`)

**Purpose**: Universal hook for CRUD operations on any data type (properties, tenants, etc.)

**How it works**:
```javascript
const { data, loading, error, create, update, remove, refetch } = useAppData('properties', userId);
```

**State Management**:
- `useState` for `data`, `loading`, and `error`
- `useCallback` to memoize functions (`fetchData`, `create`, `update`, `remove`)
- `useEffect` to automatically fetch data when `userId` or `dataType` changes

**Key Features**:
- **Automatic fetching**: Calls API on mount and when dependencies change
- **CRUD operations**: Provides `create`, `update`, `remove` functions
- **Error handling**: Catches and stores errors in state
- **Loading states**: Tracks loading during async operations

**Usage Example**:
```javascript
// In UniversalPage component
const { data, loading, error, create, update, remove } = useAppData(dataType, user?.id);

// Create new item
await create({ name: "New Property", city: "NYC" });

// Update existing item
await update(itemId, { name: "Updated Name" });

// Delete item
await remove(itemId);
```

#### 2. `useDashboardData` Hook (`src/hooks/useAppData.js`)

**Purpose**: Specialized hook for dashboard statistics and activities

**How it works**:
```javascript
const { stats, activities, loading, error, refetch } = useDashboardData(userId);
```

**State Management**:
- Separate `useState` for `stats` (object) and `activities` (array)
- `useCallback` for `fetchDashboardData`
- `useEffect` to fetch on mount

**Key Difference**: Returns structured data (`stats` + `activities`) instead of a generic array

#### 3. `usePersistentState` Hook (`src/hooks/usePersistentState.js`)

**Purpose**: State that persists to `localStorage` and survives page refreshes

**How it works**:
```javascript
const [preferences, setPreferences, hydrated] = usePersistentState('key', defaultValue);
```

**State Management**:
- `useState` for the actual state
- `useState` for `hydrated` flag (tracks if localStorage has been read)
- `useRef` to track first render (prevents saving default value on mount)
- Two `useEffect` hooks:
  1. **Hydration**: Reads from localStorage on mount
  2. **Persistence**: Saves to localStorage when state changes

**Key Features**:
- **SSR-safe**: Checks `typeof window !== "undefined"` before accessing localStorage
- **Hydration tracking**: Returns `hydrated` flag so components know when data is ready
- **Merge strategy**: Merges objects instead of replacing them

**Usage Example**:
```javascript
// In dashboard page
const [preferences, setPreferences, preferencesHydrated] = 
  usePersistentState('dashboard_prefs', { showWelcome: true });

// Only use preferences after hydration
if (preferencesHydrated) {
  // Safe to use preferences
}
```

### React Built-in Hooks

#### `useState`
Used throughout the app for local component state:
- **Login page**: `email`, `password`, `loading`, `error`
- **DataTable**: `selectedItem` for delete confirmation
- **UniversalPage**: `editingItem`, `selectedProperty`, `selectedTenant`
- **Dashboard**: `pageTitle`

**Pattern**: `const [state, setState] = useState(initialValue)`

#### `useEffect`
Used for side effects:
- **AuthContext**: Initialize user from localStorage on mount
- **ProtectedRoute**: Redirect to login if not authenticated
- **useAppData**: Fetch data when dependencies change
- **Dashboard**: Update page title when tab changes

**Pattern**: `useEffect(() => { /* effect */ }, [dependencies])`

#### `useCallback`
Used to memoize functions and prevent unnecessary re-renders:
- **useAppData**: Memoizes `fetchData`, `create`, `update`, `remove`
- Prevents infinite loops in `useEffect` dependencies

**Pattern**: `const memoizedFn = useCallback(() => { /* fn */ }, [deps])`

#### `useRef`
Used for values that don't trigger re-renders:
- **DataTable**: `cancelRef` for AlertDialog focus management
- **usePersistentState**: `isFirstRun` to track first render

**Pattern**: `const ref = useRef(initialValue)`

#### `useContext`
Used to access context values:
- **useAuth**: `const { user, login, logout } = useAuth()`
- **useTab**: `const { activeTab, switchTab } = useTab()`
- **Sidebar**: Direct `useContext(TabContext)` (with fallback handling)

**Pattern**: `const context = useContext(ContextName)`

#### Chakra UI Hooks
- **useDisclosure**: Manages modal/drawer open/close state
- **useBreakpointValue**: Responsive design (mobile/desktop)
- **useToast**: Display toast notifications
- **useRouter**: Next.js navigation (`router.push()`)
- **usePathname**: Get current route path

---

## State Management

### 1. Context API (Global State)

#### AuthContext (`src/contexts/AuthContext.js`)

**Purpose**: Manages authentication state globally

**State**:
- `user`: Current authenticated user (null if not logged in)
- `loading`: Loading state for auth operations

**Methods**:
- `login(email, password)`: Authenticates user
- `register(name, email, password, confirmPassword)`: Creates new account
- `logout()`: Clears user session
- `updateUser(updates)`: Updates user data

**Persistence**: Saves user to `localStorage` on login/register, reads on mount

**Provider Setup**:
```javascript
// In layout.js
<AuthProvider>
  {children}
</AuthProvider>
```

**Usage**:
```javascript
const { user, login, logout, loading } = useAuth();
```

#### TabContext (`src/contexts/TabContext.js`)

**Purpose**: Manages active tab state in dashboard

**State**:
- `activeTab`: Current tab index (0, 1, 2)

**Methods**:
- `switchTab(index)`: Changes active tab
- `getTabTitle(index)`: Returns tab title

**Provider Setup**:
```javascript
// In dashboard/page.js
<TabProvider>
  <TabContent />
</TabProvider>
```

**Usage**:
```javascript
const { activeTab, switchTab } = useTab();
```

### 2. Local Component State (`useState`)

Used for component-specific state that doesn't need to be shared:

**Examples**:
- **Form inputs**: `email`, `password` in login page
- **UI state**: Modal open/close, selected items
- **Temporary state**: Loading indicators, error messages

### 3. Persistent State (`usePersistentState`)

State that survives page refreshes using `localStorage`:

**Examples**:
- Dashboard preferences
- User settings
- Form drafts (if implemented)

### 4. Server State (via Hooks)

Data fetched from API endpoints:
- Managed by `useAppData` and `useDashboardData`
- Automatically refetched when dependencies change
- Loading and error states handled by hooks

---

## Props & Component Composition

### Props Patterns

#### 1. Destructured Props with Defaults

```javascript
const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  actions = [],
  isLoading = false,
  emptyMessage = "No data available",
  ...props  // Rest props for spreading
}) => {
  // Component code
}
```

**Benefits**:
- Clear API: See all props at a glance
- Default values: Components work without all props
- Rest props: Pass through additional props to child components

#### 2. Props Drilling vs Context

**Props Drilling** (passing props through multiple levels):
```javascript
// Dashboard -> TabContent -> UniversalPage -> DataTable
<UniversalPage 
  dataType="properties"
  columns={columns}
  emptyMessage="No properties"
/>
```

**Context** (for shared state):
```javascript
// AuthContext: No props needed, use useAuth() hook
const { user } = useAuth(); // Available anywhere

// TabContext: No props needed, use useTab() hook
const { activeTab } = useTab(); // Available in TabProvider children
```

#### 3. Function Props (Callbacks)

**Pattern**: Pass functions as props for parent-child communication

```javascript
// Parent component
<DataTable
  onEdit={(item) => handleEdit(item)}
  onDelete={(item) => handleDelete(item)}
  onView={(item) => handleView(item)}
/>

// Child component
<Button onClick={() => onEdit(item)}>Edit</Button>
```

**Common Callback Props**:
- `onChange`: Form field changes
- `onSubmit`: Form submission
- `onClick`: Button clicks
- `onEdit`, `onDelete`, `onView`: Table actions
- `onClose`: Modal/drawer close

#### 4. Render Props Pattern

**Not used in this codebase**, but could be implemented like:
```javascript
<Component render={(data) => <CustomView data={data} />} />
```

#### 5. Children Prop

**Pattern**: Components that wrap other components

```javascript
// Provider components
<AuthProvider>
  {children}  // Any child components
</AuthProvider>

// Layout components
<PageLayout title="Dashboard">
  {children}  // Page content
</PageLayout>

// Modal components
<FormModal title="Edit Property">
  {children}  // Form content
</FormModal>
```

### Component Composition Examples

#### 1. UniversalPage Component

**Composition**:
```javascript
<UniversalPage
  dataType="properties"
  title="Property Management"
  columns={columns}
>
  {/* Internally composes: */}
  <PageLayout>
    <DataTable />
    <FormModal>
      <DynamicForm />
    </FormModal>
  </PageLayout>
</UniversalPage>
```

#### 2. DynamicForm Component

**Composition**:
```javascript
<DynamicForm fields={fields} values={values} onSubmit={handleSubmit}>
  {/* Internally renders: */}
  <TextField />
  <SelectField />
  <NumberField />
  <TextareaField />
</DynamicForm>
```

#### 3. Dashboard Page

**Composition**:
```javascript
<ProtectedRoute>
  <TabProvider>
    <PageLayout>
      <TabContent>
        {/* Conditionally renders: */}
        <DashboardStats /> OR
        <UniversalPage /> OR
        <UniversalPage />
      </TabContent>
    </PageLayout>
  </TabProvider>
</ProtectedRoute>
```

---

## Next.js App Router

### File Structure

```
src/app/
├── layout.js          # Root layout (wraps all pages)
├── page.js            # Home page (/)
├── login/
│   └── page.js        # Login page (/login)
├── register/
│   └── page.js        # Register page (/register)
├── dashboard/
│   └── page.js        # Dashboard page (/dashboard)
└── api/               # API routes
    ├── auth/
    ├── properties/
    └── tenants/
```

### Key Features

#### 1. Server Components vs Client Components

**Server Components** (default):
- Run on server
- No `"use client"` directive
- Can't use hooks or browser APIs
- Example: `layout.js` (root layout)

**Client Components** (marked with `"use client"`):
- Run in browser
- Can use hooks, event handlers, browser APIs
- Examples: All components in `components/`, pages that use hooks

**Pattern**: 
```javascript
"use client";  // Must be first line

import { useState } from 'react';
// Component code
```

#### 2. Layouts

**Root Layout** (`src/app/layout.js`):
- Wraps all pages
- Sets up providers (Chakra UI, Auth)
- Configures fonts (Lexend)
- Sets metadata

**Nested Layouts**: Not used in this app, but could be added:
```
app/dashboard/layout.js  // Would wrap only dashboard pages
```

#### 3. Pages

**Page Components**:
- Export default function
- Can be Server or Client Components
- File path = URL route

**Examples**:
- `app/page.js` → `/`
- `app/login/page.js` → `/login`
- `app/dashboard/page.js` → `/dashboard`

#### 4. API Routes

**Structure**:
```
app/api/[resource]/route.js
app/api/[resource]/[id]/route.js
```

**Methods**: Export functions named after HTTP methods:
```javascript
export async function GET(request) { }
export async function POST(request) { }
export async function PUT(request) { }
export async function DELETE(request) { }
```

#### 5. Navigation

**Client-side Navigation**:
```javascript
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard');  // Navigate programmatically
```

**Link Component** (for declarative navigation):
```javascript
import Link from 'next/link';

<Link href="/dashboard">Go to Dashboard</Link>
```

#### 6. Route Protection

**Pattern**: `ProtectedRoute` component wraps protected pages

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**How it works**:
- Checks `user` from `AuthContext`
- Redirects to `/login` if not authenticated
- Shows loading state while checking auth

---

## Data Flow

### 1. Authentication Flow

```
User Action (Login)
  ↓
Login Page (useState for form)
  ↓
useAuth().login() (AuthContext)
  ↓
API Call (/api/auth/login)
  ↓
Update AuthContext state (setUser)
  ↓
Save to localStorage
  ↓
Redirect to Dashboard (router.push)
  ↓
ProtectedRoute checks user
  ↓
Render Dashboard
```

### 2. Data Fetching Flow

```
Component Mounts
  ↓
useAppData('properties', userId)
  ↓
useEffect triggers fetchData()
  ↓
API Call (/api/properties?userId=123)
  ↓
Update hook state (setData, setLoading)
  ↓
Component re-renders with data
  ↓
DataTable displays data
```

### 3. CRUD Operation Flow

```
User clicks "Edit" button
  ↓
handleEdit(item) sets editingItem state
  ↓
FormModal opens with item data
  ↓
DynamicForm renders with values prop
  ↓
User edits form (onChange updates formData)
  ↓
User clicks "Save"
  ↓
handleSubmit calls update(itemId, formData)
  ↓
useAppData.update() makes API call
  ↓
API updates database
  ↓
fetchData() refetches all data
  ↓
Component re-renders with updated data
  ↓
FormModal closes
```

### 4. Tab Switching Flow

```
User clicks sidebar tab
  ↓
Sidebar calls switchTab(index)
  ↓
TabContext updates activeTab state
  ↓
TabContent re-renders (uses useTab())
  ↓
Switch statement renders correct content
  ↓
useEffect updates page title
```

---

## Component Patterns

### 1. Container/Presentational Pattern

**Container** (logic + state):
- `UniversalPage`: Manages data, handles CRUD operations
- `Dashboard`: Manages tabs, coordinates components

**Presentational** (UI only):
- `DataTable`: Displays data, calls callbacks
- `DynamicForm`: Renders form fields, calls onSubmit
- `StatCard`: Displays statistics

### 2. Higher-Order Components (HOCs)

**Not used**, but `ProtectedRoute` is similar:
```javascript
<ProtectedRoute>
  <Component />
</ProtectedRoute>
```

### 3. Compound Components

**Not explicitly used**, but similar pattern:
```javascript
<FormModal>
  <DynamicForm />
</FormModal>
```

### 4. Render Props

**Not used** in this codebase.

### 5. Custom Hooks Pattern

**Extract logic into reusable hooks**:
- `useAppData`: Data fetching logic
- `usePersistentState`: localStorage logic
- `useAuth`: Auth logic (via context)

### 6. Provider Pattern

**Wrap app with providers**:
```javascript
<Providers>        // Chakra UI theme
  <AuthProvider>   // Auth context
    {children}
  </AuthProvider>
</Providers>
```

### 7. Conditional Rendering

**Patterns used**:
```javascript
// Ternary
{loading ? <Loading /> : <Content />}

// Logical AND
{error && <ErrorMessage />}

// Switch statement
switch (activeTab) {
  case 0: return <Dashboard />;
  case 1: return <Properties />;
}

// Conditional component
{dataType === 'properties' && (
  <PropertyTenantManagement />
)}
```

### 8. Controlled Components

**Form inputs are controlled**:
```javascript
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**DynamicForm manages form state**:
```javascript
const [formData, setFormData] = useState(values);

const handleChange = (fieldName, value) => {
  setFormData({ ...formData, [fieldName]: value });
};
```

---

## Key React Concepts Used

### 1. Component Lifecycle

**Mount**: Component first renders
- `useEffect(() => {}, [])` - Empty deps = run on mount

**Update**: Component re-renders
- `useEffect(() => {}, [deps])` - Run when deps change

**Unmount**: Component removed
- `useEffect(() => { return () => {} }, [])` - Return cleanup function

### 2. Re-rendering

**Triggers**:
- State changes (`useState`, `useContext`)
- Props changes
- Parent re-renders

**Prevention**:
- `useCallback`: Memoize functions
- `useMemo`: Memoize values (not used in this codebase)
- `React.memo`: Memoize components (not used)

### 3. Event Handling

**Synthetic Events**:
```javascript
onClick={(e) => handleClick(e)}
onChange={(e) => setValue(e.target.value)}
onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
```

### 4. Keys in Lists

**Required for dynamic lists**:
```javascript
{data.map((item, index) => (
  <Component key={item.id || index} />
))}
```

### 5. Fragment

**Not explicitly used**, but could be:
```javascript
<>
  <Component1 />
  <Component2 />
</>
```

---

## Best Practices Observed

1. ✅ **Separation of Concerns**: Logic in hooks, UI in components
2. ✅ **Reusability**: UniversalPage works for any data type
3. ✅ **Type Safety**: Props with defaults prevent errors
4. ✅ **Error Handling**: Try/catch in async operations
5. ✅ **Loading States**: User feedback during async operations
6. ✅ **Accessibility**: Chakra UI components are accessible
7. ✅ **Responsive Design**: Mobile/desktop breakpoints
8. ✅ **SSR Safety**: Checks for `window` before using browser APIs
9. ✅ **Memoization**: `useCallback` prevents unnecessary re-renders
10. ✅ **Clean Code**: Well-organized file structure

---

## Summary

Your application uses:

- **Hooks**: Custom hooks (`useAppData`, `usePersistentState`) + React hooks (`useState`, `useEffect`, `useCallback`, `useContext`)
- **State**: Context API (global), `useState` (local), `localStorage` (persistent)
- **Props**: Destructured with defaults, callbacks for communication, children for composition
- **Next.js**: App Router, Server/Client Components, API routes, layouts
- **Patterns**: Container/Presentational, Provider, Custom Hooks, Controlled Components

The architecture is well-organized with clear separation between data fetching (hooks), state management (context), and UI (components).

