// Database service that can work with JSON files (development) or PostgreSQL (production)
import dataService from './dataService';

class DatabaseService {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.useDatabase = process.env.USE_DATABASE === 'true';
  }

  // User operations
  async getUsers() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL queries
      // const result = await this.query('SELECT * FROM users');
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getUsers();
  }

  async getUserById(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getUserById(id);
  }

  async getUserByEmail(email) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getUserByEmail(email);
  }

  async validateCredentials(email, password) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query with password hashing
      // const result = await this.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.validateCredentials(email, password);
  }

  // Property operations
  async getProperties() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query(`
      //   SELECT p.*, t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone
      //   FROM properties p
      //   LEFT JOIN tenants t ON p.tenant_id = t.id
      // `);
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getProperties();
  }

  async getPropertyById(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query('SELECT * FROM properties WHERE id = $1', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getPropertyById(id);
  }

  async addProperty(property) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL insert
      // const result = await this.query(`
      //   INSERT INTO properties (address, city, state, zip, bedrooms, bathrooms, sqft, rent, status, notes)
      //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      //   RETURNING *
      // `, [property.address, property.city, property.state, property.zip, 
      //     property.bedrooms, property.bathrooms, property.sqft, property.rent, 
      //     property.status, property.notes]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.addProperty(property);
  }

  async updateProperty(id, updates) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL update
      // const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      // const values = [id, ...Object.values(updates)];
      // const result = await this.query(`
      //   UPDATE properties SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      //   WHERE id = $1 RETURNING *
      // `, values);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.updateProperty(id, updates);
  }

  async deleteProperty(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL delete
      // const result = await this.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.deleteProperty(id);
  }

  // Tenant operations
  async getTenants() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query(`
      //   SELECT t.*, p.address as property_address
      //   FROM tenants t
      //   LEFT JOIN properties p ON t.property_id = p.id
      // `);
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getTenants();
  }

  async getTenantById(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query('SELECT * FROM tenants WHERE id = $1', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getTenantById(id);
  }

  async addTenant(tenant) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL insert
      // const result = await this.query(`
      //   INSERT INTO tenants (name, email, phone, property_id, lease_start, lease_end, rent_amount, status, emergency_contact, emergency_phone, notes)
      //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      //   RETURNING *
      // `, [tenant.name, tenant.email, tenant.phone, tenant.property_id, 
      //     tenant.lease_start, tenant.lease_end, tenant.rent_amount, tenant.status,
      //     tenant.emergency_contact, tenant.emergency_phone, tenant.notes]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.addTenant(tenant);
  }

  async updateTenant(id, updates) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL update
      // const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      // const values = [id, ...Object.values(updates)];
      // const result = await this.query(`
      //   UPDATE tenants SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      //   WHERE id = $1 RETURNING *
      // `, values);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.updateTenant(id, updates);
  }

  async deleteTenant(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL delete
      // const result = await this.query('DELETE FROM tenants WHERE id = $1 RETURNING *', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.deleteTenant(id);
  }

  // Financial operations
  async getTransactions() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query(`
      //   SELECT t.*, p.address as property_address, tn.name as tenant_name
      //   FROM transactions t
      //   LEFT JOIN properties p ON t.property_id = p.id
      //   LEFT JOIN tenants tn ON t.tenant_id = tn.id
      //   ORDER BY t.date DESC
      // `);
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getTransactions();
  }

  async addTransaction(transaction) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL insert
      // const result = await this.query(`
      //   INSERT INTO transactions (type, description, amount, date, property_id, tenant_id, category, status)
      //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      //   RETURNING *
      // `, [transaction.type, transaction.description, transaction.amount, 
      //     transaction.date, transaction.property_id, transaction.tenant_id, 
      //     transaction.category, transaction.status]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.addTransaction(transaction);
  }

  // Expense operations
  async getExpenses() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query(`
      //   SELECT e.*, p.address as property_address
      //   FROM expenses e
      //   LEFT JOIN properties p ON e.property_id = p.id
      //   ORDER BY e.date DESC
      // `);
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getExpenses();
  }

  async getExpenseById(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query
      // const result = await this.query('SELECT * FROM expenses WHERE id = $1', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getExpenseById(id);
  }

  async addExpense(expense) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL insert
      // const result = await this.query(`
      //   INSERT INTO expenses (description, amount, date, category, property_id, vendor, status, receipt, notes)
      //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      //   RETURNING *
      // `, [expense.description, expense.amount, expense.date, expense.category,
      //     expense.property_id, expense.vendor, expense.status, expense.receipt, expense.notes]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.addExpense(expense);
  }

  async updateExpense(id, updates) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL update
      // const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
      // const values = [id, ...Object.values(updates)];
      // const result = await this.query(`
      //   UPDATE expenses SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      //   WHERE id = $1 RETURNING *
      // `, values);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.updateExpense(id, updates);
  }

  async deleteExpense(id) {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL delete
      // const result = await this.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
      // return result.rows[0];
      throw new Error('Database integration not yet implemented');
    }
    return dataService.deleteExpense(id);
  }

  // Dashboard operations
  async getDashboardStats() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL queries for dashboard stats
      // const propertiesResult = await this.query('SELECT COUNT(*) as total, COUNT(CASE WHEN status = \'Occupied\' THEN 1 END) as occupied FROM properties');
      // const tenantsResult = await this.query('SELECT COUNT(*) as active FROM tenants WHERE status = \'Active\'');
      // const currentMonth = new Date().toISOString().slice(0, 7);
      // const transactionsResult = await this.query(`
      //   SELECT 
      //     SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
      //     SUM(CASE WHEN type = 'Expense' THEN ABS(amount) ELSE 0 END) as expenses
      //   FROM transactions 
      //   WHERE date >= $1 AND date < $2
      // `, [`${currentMonth}-01`, `${currentMonth}-32`]);
      // 
      // const stats = {
      //   totalProperties: parseInt(propertiesResult.rows[0].total),
      //   occupiedProperties: parseInt(propertiesResult.rows[0].occupied),
      //   totalTenants: parseInt(tenantsResult.rows[0].active),
      //   monthlyIncome: parseFloat(transactionsResult.rows[0].income || 0),
      //   monthlyExpenses: parseFloat(transactionsResult.rows[0].expenses || 0),
      //   netIncome: parseFloat(transactionsResult.rows[0].income || 0) - parseFloat(transactionsResult.rows[0].expenses || 0),
      //   occupancyRate: Math.round((parseInt(propertiesResult.rows[0].occupied) / parseInt(propertiesResult.rows[0].total)) * 100)
      // };
      // return stats;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getDashboardStats();
  }

  async getRecentActivities() {
    if (this.useDatabase) {
      // TODO: Implement PostgreSQL query for recent activities
      // const result = await this.query(`
      //   SELECT 'transaction' as type, description as message, created_at, amount
      //   FROM transactions
      //   ORDER BY created_at DESC
      //   LIMIT 5
      //   UNION ALL
      //   SELECT 'tenant' as type, 'New tenant added: ' || name as message, created_at, NULL as amount
      //   FROM tenants
      //   ORDER BY created_at DESC
      //   LIMIT 3
      //   ORDER BY created_at DESC
      //   LIMIT 4
      // `);
      // return result.rows;
      throw new Error('Database integration not yet implemented');
    }
    return dataService.getRecentActivities();
  }

  // Helper method for database queries (to be implemented)
  async query(sql, params = []) {
    // TODO: Implement PostgreSQL connection and query execution
    // const { Pool } = require('pg');
    // const pool = new Pool({
    //   connectionString: process.env.DATABASE_URL,
    // });
    // const result = await pool.query(sql, params);
    // await pool.end();
    // return result;
    throw new Error('Database connection not implemented');
  }
}

// Create singleton instance
const databaseService = new DatabaseService();
export default databaseService;
