// Database service for PostgreSQL-backed persistence
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { createGetAll, createGetById, createUpdate, createDelete } from './dbHelpers';

class DatabaseService {
  constructor() {
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
      const result = await this.query('SELECT * FROM users');
      return result.rows;
  }

  async getUserById(id) {
      const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email) {
      const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
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
      const { email, password, name, role = 'user' } = userData;
      const result = await this.query(`
        INSERT INTO users (email, password, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, name, role, created_at
      `, [email, password, name, role]);
      return result.rows[0];
  }

  async updateUser(id, updates) {
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

  // User Profile operations (One-to-One relationship)
  async getUserProfile(userId) {
      const result = await this.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
      return result.rows[0];
  }

  async createUserProfile(userId, profileData) {
      const result = await this.query(`
      INSERT INTO user_profiles (user_id, phone)
      VALUES ($1, $2)
        RETURNING *
    `, [userId, profileData.phone ?? null]);
      return result.rows[0];
  }

  async updateUserProfile(userId, updates) {
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

  // Property operations with user_id filtering
  async getProperties(userId) {
    return createGetAll(this.query.bind(this), 'properties', 'created_at DESC')(userId);
  }

  async getPropertyById(id, userId) {
    return createGetById(this.query.bind(this), 'properties')(id, userId);
  }

  async addProperty(property, userId) {
      if (!userId) {
        throw new Error('userId is required for addProperty');
      }
      const result = await this.query(`
      INSERT INTO properties (user_id, city, bedrooms, bathrooms, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [userId, property.city, property.bedrooms, property.bathrooms, property.status, property.notes]);
      return result.rows[0];
    }

  async updateProperty(id, updates, userId) {
    return createUpdate(this.query.bind(this), 'properties')(id, updates, userId);
  }

  async deleteProperty(id, userId) {
    return createDelete(this.query.bind(this), 'properties')(id, userId);
  }

  // Expense operations with user_id filtering
  async getExpenses(userId) {
    return createGetAll(this.query.bind(this), 'expenses', 'date DESC')(userId);
  }

  async addExpenses(expense, userId) {
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

  async updateExpenses(id, updates, userId) {
    return createUpdate(this.query.bind(this), 'expenses')(id, updates, userId);
  }

  async deleteExpenses(id, userId) {
    return createDelete(this.query.bind(this), 'expenses')(id, userId);
      }

  // Dashboard operations
  async getDashboardStats(userId = null) {
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

  async getRecentActivities(userId = null) {
      if (!userId) {
        throw new Error('userId is required for getRecentActivities');
      }
      
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
