// Data service for handling all application data
// Using environment variables for user credentials
// NOTE: This service now returns empty arrays since we're using PostgreSQL

class DataService {
  constructor() {
    this.storageKey = 'homeAdminData';
    this.data = {
      users: [], // SECURITY: No user data in client-side code
      properties: [],
      expenses: []
    };
  }

  // localStorage persistence methods
  saveToStorage() {
    try {
      const dataToSave = {
        properties: this.data.properties,
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
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    // Note: users array is not persisted to localStorage for security
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      this.data.users[index] = {
        ...this.data.users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      const { password, ...userWithoutPassword } = this.data.users[index];
      return userWithoutPassword;
    }
    return null;
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

  // Expense operations
  getExpenses() {
    return this.data.expenses;
  }

  getExpenseById(id) {
    return this.data.expenses.find(expense => expense.id === parseInt(id));
  }

  addExpenses(expense) {
    const newExpense = {
      ...expense,
      id: Math.max(...this.data.expenses.map(r => r.id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.expenses.push(newExpense);
    this.saveToStorage();
    return newExpense;
  }

  updateExpenses(id, updates) {
    const index = this.data.expenses.findIndex(r => r.id === parseInt(id));
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

  deleteExpenses(id) {
    const index = this.data.expenses.findIndex(r => r.id === parseInt(id));
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
    const expenses = this.getExpenses();
    
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => p.status === 'Occupied').length;
    
    const monthlyIncome = properties
      .filter(p => p.status === 'Occupied')
      .reduce((sum, p) => sum + Number(p.rent || 0), 0);
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expenses
      .filter(expense => expense.date && expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    
    const netIncome = monthlyIncome - monthlyExpenses;
    
    return {
      totalProperties,
      occupiedProperties,
      monthlyIncome,
      monthlyExpenses,
      netIncome,
      occupancyRate: totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0
    };
  }

  // Recent activities
  getRecentActivities() {
    return [...this.data.expenses]
      .sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date))
      .slice(0, 5)
      .map((expense) => ({
        id: `expense-${expense.id}`,
        type: 'expense',
        message: expense.description,
        time: this.getTimeAgo(expense.updatedAt || expense.date),
        amount: expense.amount
      }));
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
