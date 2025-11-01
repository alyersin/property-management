// Database service that can work with JSON files (development) or PostgreSQL (production)
import dataService from './dataService';
import { Pool } from 'pg';

class DatabaseService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.useDatabase = process.env.USE_DATABASE === 'true';
    
    // Initialize PostgreSQL connection pool if using database
    if (this.useDatabase) {
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/home_admin',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
  }

  // Helper method for database queries
  async query(sql, params = []) {
    if (!this.useDatabase) {
      throw new Error('Database not enabled. Set USE_DATABASE=true');
    }
    
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // User operations
  async getUsers() {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM users');
      return result.rows;
    }
    return dataService.getUsers();
  }

  async getUserById(id) {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0];
    }
    return dataService.getUserById(id);
  }

  async getUserByEmail(email) {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    }
    return dataService.getUserByEmail(email);
  }

  async validateCredentials(email, password) {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
      return result.rows[0];
    }
    return dataService.validateCredentials(email, password);
  }

  async createUser(userData) {
    if (this.useDatabase) {
      const { email, password, name, role = 'user' } = userData;
      const result = await this.query(`
        INSERT INTO users (email, password, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, role, created_at
      `, [email, password, name, role]);
      return result.rows[0];
    }
    return dataService.createUser(userData);
  }

  // User Profile operations (One-to-One relationship)
  async getUserProfile(userId) {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
      return result.rows[0];
    }
    return {
      id: 1,
      user_id: userId,
      bio: 'User profile not available in JSON mode',
      phone: null,
      address: null,
      date_of_birth: null
    };
  }

  async createUserProfile(userId, profileData) {
    if (this.useDatabase) {
      // Note: emergency_contact and emergency_phone fields removed from database schema
      const result = await this.query(`
        INSERT INTO user_profiles (user_id, bio, phone, address, date_of_birth)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [userId, profileData.bio, profileData.phone, profileData.address, 
        profileData.date_of_birth]);
      return result.rows[0];
    }
    return { id: Date.now(), user_id: userId, ...profileData };
  }

  async updateUserProfile(userId, updates) {
    if (this.useDatabase) {
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [userId, ...Object.values(updates)];
      const result = await this.query(`
        UPDATE user_profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 RETURNING *
      `, values);
      return result.rows[0];
    }
    return { user_id: userId, ...updates };
  }

  // Property operations with user_id filtering
  async getProperties(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getProperties');
      }
      const result = await this.query(`
        SELECT p.*, 
          STRING_AGG(DISTINCT CONCAT(t.name, ' (', pt.lease_start, ' - ', pt.lease_end, ')'), '; ') as current_tenants
        FROM properties p
        LEFT JOIN property_tenants pt ON p.id = pt.property_id AND pt.status = 'Active'
        LEFT JOIN tenants t ON pt.tenant_id = t.id
        WHERE p.user_id = $1
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `, [userId]);
      return result.rows;
    }
    return dataService.getProperties();
  }

  async getPropertyById(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getPropertyById');
      }
      const result = await this.query('SELECT * FROM properties WHERE id = $1 AND user_id = $2', [id, userId]);
      return result.rows[0];
    }
    return dataService.getPropertyById(id);
  }

  async addProperty(property, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for addProperty');
      }
      // Note: state, zip, and sqft fields removed from database schema
      const result = await this.query(`
        INSERT INTO properties (user_id, address, city, bedrooms, bathrooms, rent, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [userId, property.address, property.city, 
        property.bedrooms, property.bathrooms, property.rent, 
        property.status, property.notes]);
      return result.rows[0];
    }
    return dataService.addProperty(property);
  }

  async updateProperty(id, updates, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for updateProperty');
      }
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
      const values = [id, userId, ...Object.values(updates)];
      const result = await this.query(`
        UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2 RETURNING *
      `, values);
      return result.rows[0];
    }
    return dataService.updateProperty(id, updates);
  }

  async deleteProperty(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for deleteProperty');
      }
      const result = await this.query('DELETE FROM properties WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
      return result.rows[0];
    }
    return dataService.deleteProperty(id);
  }

  // Tenant operations with user_id filtering
  async getTenants(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getTenants');
      }
      const result = await this.query(`
        SELECT t.*
        FROM tenants t
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
      `, [userId]);
      return result.rows;
    }
    return dataService.getTenants();
  }

  async getTenantById(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getTenantById');
      }
      const result = await this.query('SELECT * FROM tenants WHERE id = $1 AND user_id = $2', [id, userId]);
      return result.rows[0];
    }
    return dataService.getTenantById(id);
  }

  async addTenant(tenant, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for addTenant');
      }
      // Note: emergency_contact and emergency_phone fields removed from database schema
      const result = await this.query(`
        INSERT INTO tenants (user_id, name, email, phone, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [userId, tenant.name, tenant.email, tenant.phone, tenant.status, tenant.notes]);
      return result.rows[0];
    }
    return dataService.addTenant(tenant);
  }

  async updateTenant(id, updates, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for updateTenant');
      }
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
      const values = [id, userId, ...Object.values(updates)];
      const result = await this.query(`
        UPDATE tenants SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2 RETURNING *
      `, values);
      return result.rows[0];
    }
    return dataService.updateTenant(id, updates);
  }

  async deleteTenant(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for deleteTenant');
      }
      const result = await this.query('DELETE FROM tenants WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
      return result.rows[0];
    }
    return dataService.deleteTenant(id);
  }

  // Transaction operations with user_id filtering
  async getTransactions(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getTransactions');
      }
      const result = await this.query(`
        SELECT t.*, p.address as property_address, tn.name as tenant_name
        FROM transactions t
        LEFT JOIN properties p ON t.property_id = p.id
        LEFT JOIN tenants tn ON t.tenant_id = tn.id
        WHERE t.user_id = $1
        ORDER BY t.date DESC
      `, [userId]);
      return result.rows;
    }
    return dataService.getTransactions();
  }

  async addTransaction(transaction, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for addTransaction');
      }
      const result = await this.query(`
        INSERT INTO transactions (user_id, type, description, amount, date, property_id, tenant_id, category, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [userId, transaction.type, transaction.description, transaction.amount, 
        transaction.date, transaction.property_id, transaction.tenant_id, 
        transaction.category, transaction.status]);
      return result.rows[0];
    }
    return dataService.addTransaction(transaction);
  }

  // Expense operations with user_id filtering
  async getExpenses(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getExpenses');
      }
      const result = await this.query(`
        SELECT e.*, p.address as property_address
        FROM expenses e
        LEFT JOIN properties p ON e.property_id = p.id
        WHERE e.user_id = $1
        ORDER BY e.date DESC
      `, [userId]);
      return result.rows;
    }
    return dataService.getExpenses();
  }

  async getExpenseById(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getExpenseById');
      }
      const result = await this.query('SELECT * FROM expenses WHERE id = $1 AND user_id = $2', [id, userId]);
      return result.rows[0];
    }
    return dataService.getExpenseById(id);
  }

  async addExpense(expense, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for addExpense');
      }
      const result = await this.query(`
        INSERT INTO expenses (user_id, description, amount, date, category, property_id, vendor, status, receipt, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [userId, expense.description, expense.amount, expense.date, expense.category,
        expense.property_id, expense.vendor, expense.status, expense.receipt, expense.notes]);
      return result.rows[0];
    }
    return dataService.addExpense(expense);
  }

  async updateExpense(id, updates, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for updateExpense');
      }
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
      const values = [id, userId, ...Object.values(updates)];
      const result = await this.query(`
        UPDATE expenses SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2 RETURNING *
      `, values);
      return result.rows[0];
    }
    return dataService.updateExpense(id, updates);
  }

  async deleteExpense(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for deleteExpense');
      }
      const result = await this.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
      return result.rows[0];
    }
    return dataService.deleteExpense(id);
  }

  // Amenities operations (no user_id filtering needed - shared across all users)
  async getAmenities() {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM amenities ORDER BY category, name');
      return result.rows;
    }
    return [
      { id: 1, name: 'Swimming Pool', description: 'Outdoor swimming pool with deck area', category: 'outdoor' },
      { id: 2, name: 'Fitness Center', description: '24/7 fitness center with modern equipment', category: 'building' },
      { id: 3, name: 'Parking Garage', description: 'Covered parking garage with security', category: 'building' },
      { id: 4, name: 'Balcony', description: 'Private balcony with city views', category: 'unit' },
      { id: 5, name: 'Dishwasher', description: 'Built-in dishwasher in kitchen', category: 'indoor' }
    ];
  }

  // Property-Tenant Many-to-Many operations
  async getPropertyTenants(propertyId, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getPropertyTenants');
      }
      const result = await this.query(`
        SELECT pt.*, t.name, t.email, t.phone
        FROM property_tenants pt
        JOIN tenants t ON pt.tenant_id = t.id
        JOIN properties p ON pt.property_id = p.id
        WHERE pt.property_id = $1 AND p.user_id = $2
        ORDER BY pt.lease_start DESC
      `, [propertyId, userId]);
      return result.rows;
    }
    return [];
  }

  async getTenantProperties(tenantId, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getTenantProperties');
      }
      const result = await this.query(`
        SELECT pt.*, p.address, p.city
        FROM property_tenants pt
        JOIN properties p ON pt.property_id = p.id
        JOIN tenants t ON pt.tenant_id = t.id
        WHERE pt.tenant_id = $1 AND p.user_id = $2
        ORDER BY pt.lease_start DESC
      `, [tenantId, userId]);
      return result.rows;
    }
    return [];
  }

  // Dashboard operations
  async getDashboardStats(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getDashboardStats');
      }
      
      const propertiesResult = await this.query(
        `SELECT COUNT(*) as total, COUNT(CASE WHEN status = 'Occupied' THEN 1 END) as occupied 
         FROM properties WHERE user_id = $1`,
        [userId]
      );
      
      const tenantsResult = await this.query(
        `SELECT COUNT(*) as active FROM tenants WHERE status = 'Active' AND user_id = $1`,
        [userId]
      );
      
      const currentMonth = new Date().toISOString().slice(0, 7);
      const transactionsResult = await this.query(`
        SELECT 
          SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'Expense' THEN ABS(amount) ELSE 0 END) as expenses
        FROM transactions 
        WHERE date >= $1 AND date < $2 AND user_id = $3
      `, [`${currentMonth}-01`, `${currentMonth}-32`, userId]);
      
      const stats = {
        totalProperties: parseInt(propertiesResult.rows[0].total),
        occupiedProperties: parseInt(propertiesResult.rows[0].occupied),
        totalTenants: parseInt(tenantsResult.rows[0].active),
        monthlyIncome: parseFloat(transactionsResult.rows[0].income || 0),
        monthlyExpenses: parseFloat(transactionsResult.rows[0].expenses || 0),
        netIncome: parseFloat(transactionsResult.rows[0].income || 0) - parseFloat(transactionsResult.rows[0].expenses || 0),
        occupancyRate: propertiesResult.rows[0].total > 0 
          ? Math.round((parseInt(propertiesResult.rows[0].occupied) / parseInt(propertiesResult.rows[0].total)) * 100)
          : 0
      };
      return stats;
    }
    return dataService.getDashboardStats();
  }

  async getRecentActivities(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getRecentActivities');
      }
      
      // This is a simplified version - you may want to make it more sophisticated
      const result = await this.query(`
        SELECT 'transaction' as type, description as message, created_at, amount
        FROM transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `, [userId]);
      
      return result.rows.map(row => ({
        id: `transaction-${row.id}`,
        type: 'payment',
        message: row.message,
        time: this.getTimeAgo(row.created_at),
        amount: row.amount
      }));
    }
    return dataService.getRecentActivities();
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
const databaseService = new DatabaseService();
export default databaseService;
