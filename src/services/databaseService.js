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
      const { email, password, name } = userData;
      const result = await this.query(`
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3)
        RETURNING id, email, name
      `, [email, password, name]);
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
        `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
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
        UPDATE user_profiles SET ${setClause}
        WHERE user_id = $1 RETURNING *
      `, values);
      return result.rows[0];
  }

  // Property operations with user_id filtering
  async getProperties(userId) {
    const result = await this.query(`
      SELECT 
        p.*,
        COUNT(pt.tenant_id)::int as tenant_count
      FROM properties p
      LEFT JOIN property_tenants pt ON p.id = pt.property_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.id DESC
    `, [userId]);
    return result.rows;
  }

  async getPropertyById(id, userId) {
    return createGetById(this.query.bind(this), 'properties')(id, userId);
  }

  async addProperty(property, userId) {
      if (!userId) {
        throw new Error('userId is required for addProperty');
      }
      // Ensure bedrooms and bathrooms are integers (parseFloat then parseInt to handle "1.0" -> 1)
      const bedrooms = parseInt(parseFloat(property.bedrooms), 10);
      const bathrooms = parseInt(parseFloat(property.bathrooms), 10);
      
      const result = await this.query(`
      INSERT INTO properties (user_id, city, bedrooms, bathrooms, status)
      VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [userId, property.city, bedrooms, bathrooms, property.status]);
      return result.rows[0];
    }

  async updateProperty(id, updates, userId) {
    // Ensure bedrooms and bathrooms are integers if they're being updated
    // Also remove tenant_count as it's a computed field, not a real column
    const processedUpdates = { ...updates };
    delete processedUpdates.tenant_count; // Remove computed field
    
    if ('bedrooms' in processedUpdates) {
      processedUpdates.bedrooms = parseInt(parseFloat(processedUpdates.bedrooms), 10);
    }
    if ('bathrooms' in processedUpdates) {
      processedUpdates.bathrooms = parseInt(parseFloat(processedUpdates.bathrooms), 10);
    }
    return createUpdate(this.query.bind(this), 'properties')(id, processedUpdates, userId);
  }

  async deleteProperty(id, userId) {
    return createDelete(this.query.bind(this), 'properties')(id, userId);
  }

  // Tenant operations with user_id filtering
  async getTenants(userId) {
    const result = await this.query(`
      SELECT 
        t.*,
        COUNT(pt.property_id)::int as property_count
      FROM tenants t
      LEFT JOIN property_tenants pt ON t.id = pt.tenant_id
      WHERE t.user_id = $1
      GROUP BY t.id
      ORDER BY t.id DESC
    `, [userId]);
    return result.rows;
  }

  async getTenantById(id, userId) {
    return createGetById(this.query.bind(this), 'tenants')(id, userId);
  }

  async addTenant(tenant, userId) {
      if (!userId) {
        throw new Error('userId is required for addTenant');
      }
      const result = await this.query(`
      INSERT INTO tenants (user_id, name, email, status)
      VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [userId, tenant.name, tenant.email, tenant.status || 'Active']);
      return result.rows[0];
    }

  async updateTenant(id, updates, userId) {
    // Remove property_count as it's a computed field, not a real column
    const processedUpdates = { ...updates };
    delete processedUpdates.property_count; // Remove computed field
    
    return createUpdate(this.query.bind(this), 'tenants')(id, processedUpdates, userId);
  }

  async deleteTenant(id, userId) {
    return createDelete(this.query.bind(this), 'tenants')(id, userId);
  }

  // Property-Tenant relationship operations (Many-to-Many)
  async getPropertyTenants(propertyId, userId) {
      const result = await this.query(`
        SELECT t.*, pt.start_date, pt.end_date
        FROM property_tenants pt
        JOIN tenants t ON pt.tenant_id = t.id
        JOIN properties p ON pt.property_id = p.id
        WHERE pt.property_id = $1 AND p.user_id = $2
        ORDER BY pt.property_id DESC
      `, [propertyId, userId]);
      return result.rows;
  }

  async getTenantProperties(tenantId, userId) {
      const result = await this.query(`
        SELECT p.*, pt.start_date, pt.end_date
        FROM property_tenants pt
        JOIN properties p ON pt.property_id = p.id
        JOIN tenants t ON pt.tenant_id = t.id
        WHERE pt.tenant_id = $1 AND t.user_id = $2
        ORDER BY pt.property_id DESC
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
        INSERT INTO property_tenants (property_id, tenant_id, start_date, end_date)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (property_id, tenant_id) DO UPDATE
        SET start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date
        RETURNING *
      `, [propertyId, tenantId, leaseData.start_date || null, leaseData.end_date || null]);
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
      
      // Get recent properties and tenants (ordered by ID, most recent first)
      const propertiesResult = await this.query(`
        SELECT id, city as message
        FROM properties
        WHERE user_id = $1
        ORDER BY id DESC
        LIMIT 3
      `, [userId]);
      
      const tenantsResult = await this.query(`
        SELECT id, name as message
        FROM tenants
        WHERE user_id = $1
        ORDER BY id DESC
        LIMIT 2
      `, [userId]);
      
      const activities = [
        ...propertiesResult.rows.map(row => ({
          id: `property-${row.id}`,
          type: 'property',
          message: `Property added: ${row.message}`
        })),
        ...tenantsResult.rows.map(row => ({
          id: `tenant-${row.id}`,
          type: 'tenant',
          message: `Tenant added: ${row.message}`
        }))
      ];
      
      // Sort by ID (most recent first) and limit to 5
      return activities
        .sort((a, b) => {
          const idA = parseInt(a.id.split('-')[1]);
          const idB = parseInt(b.id.split('-')[1]);
          return idB - idA;
        })
        .slice(0, 5);
  }

}

// Create singleton instance
const databaseService = new DatabaseService();
export default databaseService;
