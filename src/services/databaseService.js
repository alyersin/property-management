// Database service that can work with JSON files (development) or PostgreSQL (production)
import dataService from './dataService';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

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
      const user = result.rows[0];
      if (!user) return null;
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    const user = dataService.getUserById(id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email) {
    if (this.useDatabase) {
      const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    }
    return dataService.getUserByEmail(email);
  }

  async validateCredentials(email, password) {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
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

  async updateUser(id, updates) {
    if (this.useDatabase) {
      const fields = Object.keys(updates);
      if (fields.length === 0) return this.getUserById(id);

      const updatesCopy = { ...updates };
      if (updatesCopy.password) {
        updatesCopy.password = await bcrypt.hash(updatesCopy.password, 12);
      }

      const setClause = Object.keys(updatesCopy)
        .map((field, index) => `${field} = $${index + 2}`)
        .join(', ');
      const values = [id, ...Object.values(updatesCopy)];

      const result = await this.query(
        `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        values
      );
      const updatedUser = result.rows[0];
      if (!updatedUser) return null;
      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    }
    const updatesCopy = { ...updates };
    if (updatesCopy.password) {
      updatesCopy.password = await bcrypt.hash(updatesCopy.password, 12);
    }
    return dataService.updateUser(id, updatesCopy);
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
      phone: null
    };
  }

  async createUserProfile(userId, profileData) {
    if (this.useDatabase) {
      // Note: emergency_contact and emergency_phone fields removed from database schema
      const result = await this.query(`
        INSERT INTO user_profiles (user_id, phone)
        VALUES ($1, $2)
        RETURNING *
      `, [userId, profileData.phone ?? null]);
      return result.rows[0];
    }
    return { id: Date.now(), user_id: userId, ...profileData };
  }

  async updateUserProfile(userId, updates) {
    if (this.useDatabase) {
      if (!updates || Object.keys(updates).length === 0) {
        const existing = await this.getUserProfile(userId);
        return existing;
      }
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
        SELECT p.*
        FROM properties p
        WHERE p.user_id = $1
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
        INSERT INTO properties (user_id, city, bedrooms, bathrooms, status, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [userId, property.city, property.bedrooms, property.bathrooms, property.status, property.notes]);
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

  // Expense operations with user_id filtering
  async getExpenses(userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for getExpenses');
      }
      const result = await this.query(`
        SELECT e.*
        FROM expenses e
        WHERE e.user_id = $1
        ORDER BY e.date DESC
      `, [userId]);
      return result.rows;
    }
    return dataService.getExpenses();
  }

  async addExpenses(expense, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for addExpenses');
      }
      const result = await this.query(`
        INSERT INTO expenses (user_id, description, amount, date, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [userId, expense.description, expense.amount, expense.date, expense.notes]);
      return result.rows[0];
    }
    return dataService.addExpenses(expense);
  }

  async updateExpenses(id, updates, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for updateExpenses');
      }
      const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 3}`).join(', ');
      const values = [id, userId, ...Object.values(updates)];
      const result = await this.query(`
        UPDATE expenses SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND user_id = $2 RETURNING *
      `, values);
      return result.rows[0];
    }
    return dataService.updateExpenses(id, updates);
  }

  async deleteExpenses(id, userId = null) {
    if (this.useDatabase) {
      if (!userId) {
        throw new Error('userId is required for deleteExpenses');
      }
      const result = await this.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
      return result.rows[0];
    }
    return dataService.deleteExpenses(id);
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

      const currentMonth = new Date().toISOString().slice(0, 7);
      const expensesResult = await this.query(`
        SELECT COALESCE(SUM(amount), 0) as expenses
        FROM expenses 
        WHERE date >= $1 AND date < $2 AND user_id = $3
      `, [`${currentMonth}-01`, `${currentMonth}-32`, userId]);
      
      const stats = {
        totalProperties: parseInt(propertiesResult.rows[0].total),
        occupiedProperties: parseInt(propertiesResult.rows[0].occupied),
        monthlyExpenses: parseFloat(expensesResult.rows[0].expenses || 0),
        occupancyRate: propertiesResult.rows[0].total > 0 
          ? Math.round((parseInt(propertiesResult.rows[0].occupied) / parseInt(propertiesResult.rows[0].total)) * 100)
          : 0,
        availableProperties: propertiesResult.rows[0].total > 0
          ? parseInt(propertiesResult.rows[0].total) - parseInt(propertiesResult.rows[0].occupied)
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
        SELECT id, description as message, created_at, amount
        FROM expenses
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 5
      `, [userId]);
      
      return result.rows.map(row => ({
        id: `expense-${row.id}`,
        type: 'expense',
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
