// Data service for handling all application data
// Using inline data to avoid JSON import issues

class DataService {
  constructor() {
    this.data = {
      users: [
        {
          id: 1,
          email: "admin@homeadmin.com",
          password: "password",
          name: "Admin User",
          role: "admin",
          createdAt: "2024-01-01T00:00:00Z",
          lastLogin: "2024-12-15T10:30:00Z"
        },
        {
          id: 2,
          email: "manager@homeadmin.com",
          password: "manager123",
          name: "Property Manager",
          role: "manager",
          createdAt: "2024-01-15T00:00:00Z",
          lastLogin: "2024-12-14T15:45:00Z"
        },
        {
          id: 3,
          email: "demo@homeadmin.com",
          password: "demo123",
          name: "Demo User",
          role: "user",
          createdAt: "2024-02-01T00:00:00Z",
          lastLogin: "2024-12-15T09:15:00Z"
        }
      ],
      properties: [
        {
          id: 1,
          address: "123 Main Street",
          city: "San Francisco",
          state: "CA",
          zip: "94102",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1200,
          rent: 3500,
          status: "Occupied",
          tenant: "John Smith",
          tenantEmail: "john@email.com",
          tenantPhone: "(555) 123-4567",
          leaseEnd: "2024-12-31",
          notes: "Well-maintained property with recent renovations.",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-01T00:00:00Z"
        },
        {
          id: 2,
          address: "456 Oak Avenue",
          city: "San Francisco",
          state: "CA",
          zip: "94103",
          bedrooms: 2,
          bathrooms: 1,
          sqft: 900,
          rent: 2800,
          status: "Available",
          tenant: null,
          tenantEmail: null,
          tenantPhone: null,
          leaseEnd: null,
          notes: "Recently renovated kitchen and bathroom.",
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-12-10T00:00:00Z"
        },
        {
          id: 3,
          address: "789 Pine Road",
          city: "San Francisco",
          state: "CA",
          zip: "94107",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1800,
          rent: 4500,
          status: "Renovating",
          tenant: "Mike Davis",
          tenantEmail: "mike@email.com",
          tenantPhone: "(555) 456-7890",
          leaseEnd: "2024-08-15",
          notes: "Needs new flooring in living room.",
          createdAt: "2024-02-01T00:00:00Z",
          updatedAt: "2024-12-05T00:00:00Z"
        },
        {
          id: 4,
          address: "321 Elm Street",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2200,
          rent: 5500,
          status: "Occupied",
          tenant: "Sarah Johnson",
          tenantEmail: "sarah@email.com",
          tenantPhone: "(555) 789-0123",
          leaseEnd: "2025-06-30",
          notes: "Luxury property with modern amenities.",
          createdAt: "2024-03-01T00:00:00Z",
          updatedAt: "2024-12-12T00:00:00Z"
        }
      ],
      tenants: [
        {
          id: 1,
          name: "John Smith",
          email: "john@email.com",
          phone: "(555) 123-4567",
          propertyId: 1,
          propertyAddress: "123 Main Street",
          leaseStart: "2024-01-01",
          leaseEnd: "2024-12-31",
          rentAmount: 3500,
          status: "Active",
          emergencyContact: "Jane Smith",
          emergencyPhone: "(555) 123-4568",
          notes: "Reliable tenant, always pays on time.",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-12-01T00:00:00Z"
        },
        {
          id: 2,
          name: "Mike Davis",
          email: "mike@email.com",
          phone: "(555) 456-7890",
          propertyId: 3,
          propertyAddress: "789 Pine Road",
          leaseStart: "2024-02-01",
          leaseEnd: "2024-08-15",
          rentAmount: 4500,
          status: "Active",
          emergencyContact: "Lisa Davis",
          emergencyPhone: "(555) 456-7891",
          notes: "Property under renovation, temporary arrangement.",
          createdAt: "2024-02-01T00:00:00Z",
          updatedAt: "2024-12-05T00:00:00Z"
        },
        {
          id: 3,
          name: "Sarah Johnson",
          email: "sarah@email.com",
          phone: "(555) 789-0123",
          propertyId: 4,
          propertyAddress: "321 Elm Street",
          leaseStart: "2024-03-01",
          leaseEnd: "2025-06-30",
          rentAmount: 5500,
          status: "Active",
          emergencyContact: "Tom Johnson",
          emergencyPhone: "(555) 789-0124",
          notes: "Long-term tenant, excellent payment history.",
          createdAt: "2024-03-01T00:00:00Z",
          updatedAt: "2024-12-12T00:00:00Z"
        },
        {
          id: 4,
          name: "Alex Wilson",
          email: "alex@email.com",
          phone: "(555) 321-6547",
          propertyId: null,
          propertyAddress: null,
          leaseStart: null,
          leaseEnd: null,
          rentAmount: null,
          status: "Prospective",
          emergencyContact: "Maria Wilson",
          emergencyPhone: "(555) 321-6548",
          notes: "Looking for 2-bedroom apartment, budget $3000/month.",
          createdAt: "2024-12-01T00:00:00Z",
          updatedAt: "2024-12-01T00:00:00Z"
        }
      ],
      transactions: [
        {
          id: 1,
          type: "Income",
          description: "Rent Payment - John Smith",
          amount: 3500,
          date: "2024-12-01",
          property: "123 Main Street",
          tenant: "John Smith",
          category: "Rent",
          status: "Completed",
          createdAt: "2024-12-01T00:00:00Z"
        },
        {
          id: 2,
          type: "Income",
          description: "Rent Payment - Sarah Johnson",
          amount: 5500,
          date: "2024-12-01",
          property: "321 Elm Street",
          tenant: "Sarah Johnson",
          category: "Rent",
          status: "Completed",
          createdAt: "2024-12-01T00:00:00Z"
        },
        {
          id: 3,
          type: "Expense",
          description: "Property Tax - 123 Main Street",
          amount: -800,
          date: "2024-12-05",
          property: "123 Main Street",
          tenant: null,
          category: "Taxes",
          status: "Completed",
          createdAt: "2024-12-05T00:00:00Z"
        },
        {
          id: 4,
          type: "Expense",
          description: "Repair - AC Unit",
          amount: -500,
          date: "2024-12-15",
          property: "456 Oak Avenue",
          tenant: null,
          category: "Repair",
          status: "Completed",
          createdAt: "2024-12-15T00:00:00Z"
        },
        {
          id: 5,
          type: "Expense",
          description: "Insurance Premium",
          amount: -1200,
          date: "2024-12-10",
          property: "All Properties",
          tenant: null,
          category: "Insurance",
          status: "Completed",
          createdAt: "2024-12-10T00:00:00Z"
        },
        {
          id: 6,
          type: "Income",
          description: "Rent Payment - Mike Davis",
          amount: 4500,
          date: "2024-12-01",
          property: "789 Pine Road",
          tenant: "Mike Davis",
          category: "Rent",
          status: "Completed",
          createdAt: "2024-12-01T00:00:00Z"
        }
      ],
      expenses: [
        {
          id: 1,
          description: "Property Tax - 123 Main Street",
          amount: 800,
          date: "2024-12-05",
          category: "Taxes",
          property: "123 Main Street",
          vendor: "City of San Francisco",
          status: "Paid",
          receipt: "receipt_001.pdf",
          notes: "Quarterly property tax payment",
          createdAt: "2024-12-05T00:00:00Z"
        },
        {
          id: 2,
          description: "Water Bill - 456 Oak Avenue",
          amount: 120,
          date: "2024-12-10",
          category: "Utilities",
          property: "456 Oak Avenue",
          vendor: "San Francisco Water",
          status: "Paid",
          receipt: "receipt_002.pdf",
          notes: "Monthly water bill",
          createdAt: "2024-12-10T00:00:00Z"
        },
        {
          id: 3,
          description: "Repair - AC Unit",
          amount: 500,
          date: "2024-12-15",
          category: "Repair",
          property: "456 Oak Avenue",
          vendor: "Cool Air Services",
          status: "Paid",
          receipt: "receipt_003.pdf",
          notes: "AC unit repair and maintenance",
          createdAt: "2024-12-15T00:00:00Z"
        },
        {
          id: 4,
          description: "Insurance Premium",
          amount: 1200,
          date: "2024-12-10",
          category: "Insurance",
          property: "All Properties",
          vendor: "Property Insurance Co.",
          status: "Paid",
          receipt: "receipt_004.pdf",
          notes: "Annual property insurance premium",
          createdAt: "2024-12-10T00:00:00Z"
        },
        {
          id: 5,
          description: "Cleaning Services",
          amount: 200,
          date: "2024-12-12",
          category: "Cleaning",
          property: "789 Pine Road",
          vendor: "Clean Pro Services",
          status: "Paid",
          receipt: "receipt_005.pdf",
          notes: "Deep cleaning after renovation",
          createdAt: "2024-12-12T00:00:00Z"
        },
        {
          id: 6,
          description: "Landscaping",
          amount: 150,
          date: "2024-12-08",
          category: "Landscaping",
          property: "321 Elm Street",
          vendor: "Green Thumb Landscaping",
          status: "Paid",
          receipt: "receipt_006.pdf",
          notes: "Monthly landscaping maintenance",
          createdAt: "2024-12-08T00:00:00Z"
        }
      ]
    };
  }

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

  validateCredentials(email, password) {
    const user = this.getUserByEmail(email);
    return user && user.password === password ? user : null;
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
      id: Math.max(...this.data.properties.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.properties.push(newProperty);
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
      return this.data.properties[index];
    }
    return null;
  }

  deleteProperty(id) {
    const index = this.data.properties.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      return this.data.properties.splice(index, 1)[0];
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
      id: Math.max(...this.data.tenants.map(t => t.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.tenants.push(newTenant);
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
      return this.data.tenants[index];
    }
    return null;
  }

  deleteTenant(id) {
    const index = this.data.tenants.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      return this.data.tenants.splice(index, 1)[0];
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
      id: Math.max(...this.data.transactions.map(t => t.id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.data.transactions.push(newTransaction);
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
      id: Math.max(...this.data.expenses.map(e => e.id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.data.expenses.push(newExpense);
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
      return this.data.expenses[index];
    }
    return null;
  }

  deleteExpense(id) {
    const index = this.data.expenses.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      return this.data.expenses.splice(index, 1)[0];
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
      occupancyRate: Math.round((occupiedProperties / totalProperties) * 100)
    };
  }

  // Recent activities
  getRecentActivities() {
    const activities = [];
    
    // Add recent transactions
    const recentTransactions = this.data.transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
    
    recentTransactions.forEach(transaction => {
      if (transaction.type === 'Income') {
        activities.push({
          id: `transaction-${transaction.id}`,
          type: 'payment',
          message: `Rent payment received from ${transaction.tenant}`,
          time: this.getTimeAgo(transaction.createdAt),
          amount: transaction.amount
        });
      } else {
        activities.push({
          id: `transaction-${transaction.id}`,
          type: 'expense',
          message: `${transaction.description}: $${Math.abs(transaction.amount)}`,
          time: this.getTimeAgo(transaction.createdAt)
        });
      }
    });
    
    // Add recent tenant additions
    const recentTenants = this.data.tenants
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    recentTenants.forEach(tenant => {
      activities.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        message: `New tenant added: ${tenant.name}`,
        time: this.getTimeAgo(tenant.createdAt)
      });
    });
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 4);
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