// Data service for handling all application data
// Using environment variables for user credentials
// NOTE: This service now returns empty arrays since we're using PostgreSQL

class DataService {
  constructor() {
    this.storageKey = 'homeAdminData';
    this.data = {
      users: [], // SECURITY: No user data in client-side code
      properties: [],
      tenants: [],
      transactions: [],
      expenses: []
    };
  }

  // localStorage persistence methods
  saveToStorage() {
    try {
      const dataToSave = {
        properties: this.data.properties,
        tenants: this.data.tenants,
        transactions: this.data.transactions,
        expenses: this.data.expenses,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save data to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsedData = JSON.parse(saved);
        this.data.properties = parsedData.properties || this.data.properties;
        this.data.tenants = parsedData.tenants || this.data.tenants;
        this.data.transactions = parsedData.transactions || this.data.transactions;
        this.data.expenses = parsedData.expenses || this.data.expenses;
      }
    } catch (error) {
      console.warn('Failed to load data from localStorage:', error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  // Initialize data from localStorage
  initialize() {
    this.loadFromStorage();
  }

  // SECURITY: No user credentials in client-side code
  // Authentication is now handled via API routes only

  // User operations
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(user => user.id === parseInt(id));
  }

  getUserByEmail(email) {
    return this.data.users.find(user => user.email === email);
  }

  // SECURITY: Credential validation moved to API routes
  // This method is deprecated and should not be used
  validateCredentials(email, password) {
    // Method deprecated - use API routes for authentication
    return null;
  }

  createUser(userData) {
    // Note: User creation should be handled via database when USE_DATABASE=true
    // This is a fallback for development/testing only
    const newUser = {
      id: Math.max(...this.data.users.map(u => u.id || 0), 0) + 1,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'user',
      password: userData.password, // Note: In production, password should be hashed
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    // Note: users array is not persisted to localStorage for security
    return newUser;
  }

  // Property operations
  getProperties() {
    return this.data.properties;
  }

  getPropertyById(id) {
    return this.data.properties.find(property => property.id === parseInt(id));
  }

  addProperty(property) {
    const newProperty = {
      ...property,
      id: Math.max(...this.data.properties.map(p => p.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.properties.push(newProperty);
    this.saveToStorage();
    return newProperty;
  }

  updateProperty(id, updates) {
    const index = this.data.properties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.data.properties[index] = {
        ...this.data.properties[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.data.properties[index];
    }
    return null;
  }

  deleteProperty(id) {
    const index = this.data.properties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.properties.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
    }
    return null;
  }

  // Tenant operations
  getTenants() {
    return this.data.tenants;
  }

  getTenantById(id) {
    return this.data.tenants.find(tenant => tenant.id === parseInt(id));
  }

  addTenant(tenant) {
    const newTenant = {
      ...tenant,
      id: Math.max(...this.data.tenants.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.tenants.push(newTenant);
    this.saveToStorage();
    return newTenant;
  }

  updateTenant(id, updates) {
    const index = this.data.tenants.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      this.data.tenants[index] = {
        ...this.data.tenants[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.data.tenants[index];
    }
    return null;
  }

  deleteTenant(id) {
    const index = this.data.tenants.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.tenants.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
    }
    return null;
  }

  // Financial operations
  getTransactions() {
    return this.data.transactions;
  }

  getTransactionById(id) {
    return this.data.transactions.find(transaction => transaction.id === parseInt(id));
  }

  addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: Math.max(...this.data.transactions.map(t => t.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.data.transactions.push(newTransaction);
    this.saveToStorage();
    return newTransaction;
  }

  // Expense operations
  getExpenses() {
    return this.data.expenses;
  }

  getExpenseById(id) {
    return this.data.expenses.find(expense => expense.id === parseInt(id));
  }

  addExpense(expense) {
    const newExpense = {
      ...expense,
      id: Math.max(...this.data.expenses.map(e => e.id), 0) + 1,
      createdAt: new Date().toISOString()
    };
    this.data.expenses.push(newExpense);
    this.saveToStorage();
    return newExpense;
  }

  updateExpense(id, updates) {
    const index = this.data.expenses.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      this.data.expenses[index] = {
        ...this.data.expenses[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveToStorage();
      return this.data.expenses[index];
    }
    return null;
  }

  deleteExpense(id) {
    const index = this.data.expenses.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      const deleted = this.data.expenses.splice(index, 1)[0];
      this.saveToStorage();
      return deleted;
    }
    return null;
  }

  // Dashboard statistics
  getDashboardStats() {
    const properties = this.getProperties();
    const tenants = this.getTenants();
    const transactions = this.getTransactions();
    
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => p.status === 'Occupied').length;
    const totalTenants = tenants.filter(t => t.status === 'Active').length;
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );
    
    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpenses = Math.abs(monthlyTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0));
    
    const netIncome = monthlyIncome - monthlyExpenses;
    
    return {
      totalProperties,
      occupiedProperties,
      totalTenants,
      monthlyIncome,
      monthlyExpenses,
      netIncome,
      occupancyRate: totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0
    };
  }

  // Recent activities
  getRecentActivities() {
    return [];
  }

  getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
}

// Create singleton instance
const dataService = new DataService();
export default dataService;
