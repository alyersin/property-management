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
      INSERT INTO user_profiles (user_id)
      VALUES ($1)
        RETURNING *
    `, [userId]);
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

  // Tenant operations with user_id filtering
  async getTenants(userId) {
    return createGetAll(this.query.bind(this), 'tenants', 'created_at DESC')(userId);
  }

  async getTenantById(id, userId) {
    return createGetById(this.query.bind(this), 'tenants')(id, userId);
  }

  async addTenant(tenant, userId) {
      if (!userId) {
        throw new Error('userId is required for addTenant');
      }
      const result = await this.query(`
      INSERT INTO tenants (user_id, name, email, phone, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [userId, tenant.name, tenant.email, tenant.phone || null, tenant.status || 'Active', tenant.notes || null]);
      return result.rows[0];
    }

  async updateTenant(id, updates, userId) {
    return createUpdate(this.query.bind(this), 'tenants')(id, updates, userId);
  }

  async deleteTenant(id, userId) {
    return createDelete(this.query.bind(this), 'tenants')(id, userId);
  }

  // Property-Tenant relationship operations (Many-to-Many)
  async getPropertyTenants(propertyId, userId) {
      const result = await this.query(`
        SELECT t.*, pt.lease_start, pt.lease_end
        FROM property_tenants pt
        JOIN tenants t ON pt.tenant_id = t.id
        JOIN properties p ON pt.property_id = p.id
        WHERE pt.property_id = $1 AND p.user_id = $2
        ORDER BY pt.created_at DESC
      `, [propertyId, userId]);
      return result.rows;
  }

  async getTenantProperties(tenantId, userId) {
      const result = await this.query(`
        SELECT p.*, pt.lease_start, pt.lease_end
        FROM property_tenants pt
        JOIN properties p ON pt.property_id = p.id
        JOIN tenants t ON pt.tenant_id = t.id
        WHERE pt.tenant_id = $1 AND t.user_id = $2
        ORDER BY pt.created_at DESC
      `, [tenantId, userId]);
      return result.rows;
  }

  async addPropertyTenant(propertyId, tenantId, leaseData, userId) {
      // Verify both property and tenant belong to the user
      const propertyCheck = await this.query(
        'SELECT id FROM properties WHERE id = $1 AND user_id = $2',
        [propertyId, userId]
      );
      const tenantCheck = await this.query(
        'SELECT id FROM tenants WHERE id = $1 AND user_id = $2',
        [tenantId, userId]
      );

      if (propertyCheck.rows.length === 0 || tenantCheck.rows.length === 0) {
        throw new Error('Property or tenant not found or does not belong to user');
      }

      const result = await this.query(`
        INSERT INTO property_tenants (property_id, tenant_id, lease_start, lease_end)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (property_id, tenant_id) DO UPDATE
        SET lease_start = EXCLUDED.lease_start,
            lease_end = EXCLUDED.lease_end
        RETURNING *
      `, [propertyId, tenantId, leaseData.lease_start || null, leaseData.lease_end || null]);
      return result.rows[0];
  }

  async removePropertyTenant(propertyId, tenantId, userId) {
      // Verify both property and tenant belong to the user
      const propertyCheck = await this.query(
        'SELECT id FROM properties WHERE id = $1 AND user_id = $2',
        [propertyId, userId]
      );
      const tenantCheck = await this.query(
        'SELECT id FROM tenants WHERE id = $1 AND user_id = $2',
        [tenantId, userId]
      );

      if (propertyCheck.rows.length === 0 || tenantCheck.rows.length === 0) {
        throw new Error('Property or tenant not found or does not belong to user');
      }

      const result = await this.query(`
        DELETE FROM property_tenants
        WHERE property_id = $1 AND tenant_id = $2
        RETURNING *
      `, [propertyId, tenantId]);
      return result.rows[0];
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
      
      const stats = {
        totalProperties: parseInt(propertiesResult.rows[0].total),
        occupiedProperties: parseInt(propertiesResult.rows[0].occupied),
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
      
      // Get recent properties and tenants
      const propertiesResult = await this.query(`
        SELECT id, city as message, created_at
        FROM properties
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 3
      `, [userId]);
      
      const tenantsResult = await this.query(`
        SELECT id, name as message, created_at
        FROM tenants
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 2
      `, [userId]);
      
      const activities = [
        ...propertiesResult.rows.map(row => ({
          id: `property-${row.id}`,
          type: 'property',
          message: `Property added: ${row.message}`,
          time: this.getTimeAgo(row.created_at),
          created_at: row.created_at
        })),
        ...tenantsResult.rows.map(row => ({
          id: `tenant-${row.id}`,
          type: 'tenant',
          message: `Tenant added: ${row.message}`,
          time: this.getTimeAgo(row.created_at),
          created_at: row.created_at
        }))
      ];
      
      // Sort by creation date (most recent first) and limit to 5
      return activities
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(({ created_at, ...rest }) => rest); // Remove created_at from final result
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
