# Complete Hooks Inventory

This document lists all hooks used throughout your application, organized by category.

---

## Table of Contents

1. [Custom Hooks](#custom-hooks)
2. [React Built-in Hooks](#react-built-in-hooks)
3. [Next.js Hooks](#nextjs-hooks)
4. [Chakra UI Hooks](#chakra-ui-hooks)
5. [Context Hooks](#context-hooks)
6. [Hook Usage by File](#hook-usage-by-file)

---

## Custom Hooks

### 1. `useAppData`
**Location**: `src/hooks/useAppData.js`  
**Exported**: `export const useAppData = (dataType, userId) => {}`

**Purpose**: Universal hook for CRUD operations on any data type (properties, tenants, etc.)

**Returns**:
- `data` - Array of items
- `loading` - Boolean loading state
- `error` - Error message or null
- `create` - Function to create new item
- `update` - Function to update existing item
- `remove` - Function to delete item
- `refetch` - Function to manually refetch data

**Used in**:
- `src/components/shared/UniversalPage.js`

**Internal hooks used**:
- `useState` (data, loading, error)
- `useCallback` (fetchData, create, update, remove)
- `useEffect` (auto-fetch on mount/dependency change)

---

### 2. `useDashboardData`
**Location**: `src/hooks/useAppData.js`  
**Exported**: `export const useDashboardData = (userId) => {}`

**Purpose**: Specialized hook for dashboard statistics and activities

**Returns**:
- `stats` - Dashboard statistics object
- `activities` - Array of recent activities
- `loading` - Boolean loading state
- `error` - Error message or null
- `refetch` - Function to manually refetch data

**Used in**:
- `src/app/dashboard/page.js`

**Internal hooks used**:
- `useState` (stats, activities, loading, error)
- `useCallback` (fetchDashboardData)
- `useEffect` (auto-fetch on mount)

---

### 3. `usePersistentState`
**Location**: `src/hooks/usePersistentState.js`  
**Exported**: `export default function usePersistentState(storageKey, defaultValue) {}`

**Purpose**: State that persists to localStorage and survives page refreshes

**Returns**:
- `state` - Current state value
- `setState` - State setter function
- `hydrated` - Boolean indicating if localStorage has been read

**Used in**:
- `src/app/dashboard/page.js`

**Internal hooks used**:
- `useState` (state, hydrated)
- `useRef` (isFirstRun)
- `useEffect` (hydration and persistence)

---

## React Built-in Hooks

### 1. `useState`
**Purpose**: Manage local component state

**Used in** (23+ instances):
- `src/app/login/page.js` - email, password, loading, error
- `src/app/register/page.js` - email, password, confirmPassword, loading, error
- `src/app/dashboard/page.js` - pageTitle
- `src/app/settings/page.js` - info, profileExists, loading, saving
- `src/components/shared/DataTable.js` - selectedItem
- `src/components/shared/DynamicForm.js` - formData
- `src/components/shared/UniversalPage.js` - editingItem, selectedProperty, selectedTenant
- `src/components/shared/PropertyTenantManagement.js` - loading, tenants, propertyTenants, selectedTenantId, startDate, endDate, tenantToRemove
- `src/components/shared/TenantPropertyManagement.js` - loading, tenantProperties
- `src/contexts/AuthContext.js` - user, loading
- `src/contexts/TabContext.js` - activeTab
- `src/hooks/useAppData.js` - data, loading, error (in useAppData); stats, activities, loading, error (in useDashboardData)
- `src/hooks/usePersistentState.js` - state, hydrated

**Pattern**:
```javascript
const [state, setState] = useState(initialValue);
```

---

### 2. `useEffect`
**Purpose**: Handle side effects (API calls, subscriptions, DOM manipulation)

**Used in** (15+ instances):
- `src/app/dashboard/page.js` - Update page title when tab changes; Update dashboard preferences
- `src/app/page.js` - Redirect to dashboard if user is logged in
- `src/app/settings/page.js` - Load user profile on mount
- `src/components/auth/ProtectedRoute.js` - Redirect to login if not authenticated
- `src/components/shared/DynamicForm.js` - Sync formData with values prop
- `src/components/shared/PropertyTenantManagement.js` - Fetch data when modal opens
- `src/components/shared/TenantPropertyManagement.js` - Fetch tenant properties
- `src/contexts/AuthContext.js` - Initialize user from localStorage on mount
- `src/hooks/useAppData.js` - Auto-fetch data when dependencies change
- `src/hooks/usePersistentState.js` - Hydrate from localStorage; Persist to localStorage

**Pattern**:
```javascript
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

---

### 3. `useCallback`
**Purpose**: Memoize functions to prevent unnecessary re-renders

**Used in**:
- `src/app/settings/page.js` - loadProfile function
- `src/hooks/useAppData.js` - fetchData, create, update, remove functions (in useAppData); fetchDashboardData function (in useDashboardData)

**Pattern**:
```javascript
const memoizedFn = useCallback(() => {
  // Function logic
}, [dependencies]);
```

---

### 4. `useRef`
**Purpose**: Access DOM elements or store mutable values that don't trigger re-renders

**Used in**:
- `src/components/shared/DataTable.js` - cancelRef for AlertDialog focus management
- `src/components/shared/PropertyTenantManagement.js` - cancelRef for AlertDialog
- `src/hooks/usePersistentState.js` - isFirstRun to track first render

**Pattern**:
```javascript
const ref = useRef(initialValue);
```

---

### 5. `useContext`
**Purpose**: Access React Context values

**Used in**:
- `src/components/shared/Sidebar.js` - Direct access to TabContext (with fallback handling)
- `src/contexts/AuthContext.js` - useAuth hook implementation
- `src/contexts/TabContext.js` - useTab hook implementation

**Pattern**:
```javascript
const context = useContext(ContextName);
```

---

## Next.js Hooks

### 1. `useRouter`
**Purpose**: Programmatic navigation and router access

**Used in**:
- `src/app/login/page.js` - Navigate to dashboard after login
- `src/app/register/page.js` - Navigate to dashboard after registration
- `src/app/page.js` - Redirect to dashboard if logged in
- `src/components/auth/ProtectedRoute.js` - Redirect to login if not authenticated
- `src/components/shared/PageHeader.js` - Navigate on logout
- `src/components/shared/Sidebar.js` - Navigate to dashboard

**Pattern**:
```javascript
const router = useRouter();
router.push('/dashboard');
```

---

### 2. `usePathname`
**Purpose**: Get current route pathname

**Used in**:
- `src/components/shared/Sidebar.js` - Determine active tab based on current route

**Pattern**:
```javascript
const pathname = usePathname();
```

---

## Chakra UI Hooks

### 1. `useDisclosure`
**Purpose**: Manage modal/drawer/dialog open/close state

**Used in**:
- `src/components/shared/DataTable.js` - Delete confirmation dialog
- `src/components/shared/PropertyTenantManagement.js` - Delete confirmation dialog
- `src/components/shared/Sidebar.js` - Mobile drawer
- `src/components/shared/UniversalPage.js` - Form modal, tenant modal, property modal (3 instances)

**Returns**:
- `isOpen` - Boolean
- `onOpen` - Function to open
- `onClose` - Function to close

**Pattern**:
```javascript
const { isOpen, onOpen, onClose } = useDisclosure();
```

---

### 2. `useBreakpointValue`
**Purpose**: Responsive design - get different values based on screen size

**Used in**:
- `src/components/shared/DataTable.js` - Determine if mobile view
- `src/components/shared/PageHeader.js` - Determine if mobile view
- `src/components/shared/PageLayout.js` - Determine if mobile view
- `src/components/shared/Sidebar.js` - Determine if mobile view

**Pattern**:
```javascript
const isMobile = useBreakpointValue({ base: true, md: false });
```

---

### 3. `useToast`
**Purpose**: Display toast notifications

**Used in**:
- `src/app/login/page.js` - Success toast on login
- `src/app/register/page.js` - Success toast on registration
- `src/app/settings/page.js` - Success/error toasts for profile updates
- `src/components/shared/PropertyTenantManagement.js` - Success/error toasts for tenant operations
- `src/components/shared/TenantPropertyManagement.js` - Success/error toasts

**Pattern**:
```javascript
const toast = useToast();
toast({
  title: "Success",
  status: "success",
  duration: 3000,
  isClosable: true,
});
```

---

## Context Hooks

### 1. `useAuth`
**Location**: `src/contexts/AuthContext.js`  
**Exported**: `export const useAuth = () => {}`

**Purpose**: Access authentication context

**Returns**:
- `user` - Current user object (null if not authenticated)
- `login` - Login function
- `register` - Registration function
- `logout` - Logout function
- `loading` - Loading state
- `updateUser` - Update user data function

**Used in** (10+ files):
- `src/app/login/page.js`
- `src/app/register/page.js`
- `src/app/page.js`
- `src/app/dashboard/page.js`
- `src/app/settings/page.js`
- `src/components/auth/ProtectedRoute.js`
- `src/components/shared/PageHeader.js`
- `src/components/shared/PropertyTenantManagement.js`
- `src/components/shared/TenantPropertyManagement.js`
- `src/components/shared/UniversalPage.js`

**Pattern**:
```javascript
const { user, login, logout } = useAuth();
```

---

### 2. `useTab`
**Location**: `src/contexts/TabContext.js`  
**Exported**: `export const useTab = () => {}`

**Purpose**: Access tab context for dashboard tabs

**Returns**:
- `activeTab` - Current active tab index
- `switchTab` - Function to switch tabs
- `getTabTitle` - Function to get tab title by index

**Used in**:
- `src/app/dashboard/page.js`

**Pattern**:
```javascript
const { activeTab, switchTab } = useTab();
```

---

## Hook Usage by File

### Pages

#### `src/app/login/page.js`
- `useState` (email, password, loading, error)
- `useAuth` (login)
- `useRouter` (navigation)
- `useToast` (notifications)

#### `src/app/register/page.js`
- `useState` (email, password, confirmPassword, loading, error)
- `useAuth` (register)
- `useRouter` (navigation)
- `useToast` (notifications)

#### `src/app/page.js`
- `useEffect` (redirect logic)
- `useRouter` (navigation)
- `useAuth` (user, loading)

#### `src/app/dashboard/page.js`
- `useState` (pageTitle)
- `useEffect` (2 instances - title update, preferences update)
- `useTab` (activeTab, getTabTitle)
- `useAuth` (user)
- `useDashboardData` (stats, activities, loading, error)
- `usePersistentState` (dashboard preferences)

#### `src/app/settings/page.js`
- `useState` (info, profileExists, loading, saving)
- `useCallback` (loadProfile)
- `useEffect` (load profile on mount)
- `useAuth` (user, updateUser)
- `useToast` (notifications)

---

### Components

#### `src/components/shared/DataTable.js`
- `useState` (selectedItem)
- `useRef` (cancelRef)
- `useDisclosure` (delete dialog)
- `useBreakpointValue` (mobile detection)

#### `src/components/shared/DynamicForm.js`
- `useState` (formData)
- `useEffect` (sync with values prop)

#### `src/components/shared/UniversalPage.js`
- `useState` (editingItem, selectedProperty, selectedTenant)
- `useDisclosure` (3 instances - form modal, tenant modal, property modal)
- `useAuth` (user)
- `useAppData` (data, loading, error, create, update, remove, refetch)

#### `src/components/shared/PropertyTenantManagement.js`
- `useState` (7 instances - loading, tenants, propertyTenants, selectedTenantId, startDate, endDate, tenantToRemove)
- `useEffect` (fetch data when modal opens)
- `useAuth` (user)
- `useToast` (notifications)
- `useDisclosure` (delete confirmation)
- `useRef` (cancelRef)

#### `src/components/shared/TenantPropertyManagement.js`
- `useState` (loading, tenantProperties)
- `useEffect` (fetch tenant properties)
- `useAuth` (user)
- `useToast` (notifications)

#### `src/components/shared/Sidebar.js`
- `useDisclosure` (mobile drawer)
- `useBreakpointValue` (mobile detection)
- `useRouter` (navigation)
- `usePathname` (current route)
- `useContext` (TabContext - direct access)

#### `src/components/shared/PageLayout.js`
- `useBreakpointValue` (mobile detection)

#### `src/components/shared/PageHeader.js`
- `useBreakpointValue` (mobile detection)
- `useAuth` (user, logout)
- `useRouter` (navigation)

#### `src/components/auth/ProtectedRoute.js`
- `useEffect` (redirect if not authenticated)
- `useRouter` (navigation)
- `useAuth` (user, loading)

---

### Contexts

#### `src/contexts/AuthContext.js`
- `useState` (user, loading)
- `useEffect` (initialize from localStorage)
- `createContext` (create AuthContext)
- `useContext` (useAuth hook implementation)

#### `src/contexts/TabContext.js`
- `useState` (activeTab)
- `createContext` (create TabContext)
- `useContext` (useTab hook implementation)

---

### Hooks

#### `src/hooks/useAppData.js`
- `useState` (data, loading, error - in useAppData; stats, activities, loading, error - in useDashboardData)
- `useCallback` (fetchData, create, update, remove - in useAppData; fetchDashboardData - in useDashboardData)
- `useEffect` (auto-fetch on mount/dependency change)

#### `src/hooks/usePersistentState.js`
- `useState` (state, hydrated)
- `useRef` (isFirstRun)
- `useEffect` (2 instances - hydration and persistence)

---

## Summary Statistics

### Total Hook Count by Category

- **Custom Hooks**: 3
  - `useAppData`
  - `useDashboardData`
  - `usePersistentState`

- **React Built-in Hooks**: 5
  - `useState` (23+ instances)
  - `useEffect` (15+ instances)
  - `useCallback` (6+ instances)
  - `useRef` (3 instances)
  - `useContext` (3 instances)

- **Next.js Hooks**: 2
  - `useRouter` (6 instances)
  - `usePathname` (1 instance)

- **Chakra UI Hooks**: 3
  - `useDisclosure` (6 instances)
  - `useBreakpointValue` (4 instances)
  - `useToast` (5 instances)

- **Context Hooks**: 2
  - `useAuth` (10+ instances)
  - `useTab` (1 instance)

**Total Unique Hooks**: 15  
**Total Hook Instances**: 80+

---

## Hook Dependencies

### Custom Hooks Dependencies

**useAppData**:
- Uses: `useState`, `useCallback`, `useEffect`
- Used by: `UniversalPage`

**useDashboardData**:
- Uses: `useState`, `useCallback`, `useEffect`
- Used by: `Dashboard` page

**usePersistentState**:
- Uses: `useState`, `useRef`, `useEffect`
- Used by: `Dashboard` page

**useAuth**:
- Uses: `useState`, `useEffect`, `useContext`
- Used by: 10+ components/pages

**useTab**:
- Uses: `useState`, `useContext`
- Used by: `Dashboard` page

---

## Best Practices Observed

1. ✅ **Custom hooks** encapsulate reusable logic
2. ✅ **useCallback** prevents unnecessary re-renders
3. ✅ **useEffect** dependencies properly declared
4. ✅ **Context hooks** provide clean API for consuming contexts
5. ✅ **Chakra UI hooks** simplify UI state management
6. ✅ **Next.js hooks** handle routing properly
7. ✅ **SSR safety** checked in usePersistentState (window check)

---

## Notes

- All custom hooks are in `src/hooks/` directory
- Context hooks are exported from their respective context files
- Most components use multiple hooks for different concerns
- `useState` is the most frequently used hook
- `useEffect` is used extensively for side effects and data fetching
- Chakra UI hooks simplify common UI patterns (modals, responsive design, toasts)

