/**
 * Generic CRUD helpers for database operations
 */

/**
 * Validates userId is provided
 */
export const requireUserId = (userId, operation) => {
  if (!userId) {
    throw new Error(`userId is required for ${operation}`);
  }
};

/**
 * Generic GET operation for user-scoped resources
 */
export const createGetAll = (queryFn, tableName, orderBy = 'id DESC') => {
  return async (userId) => {
    requireUserId(userId, `get${tableName}`);
    const result = await queryFn(`
      SELECT * FROM ${tableName}
      WHERE user_id = $1
      ORDER BY ${orderBy}
    `, [userId]);
    return result.rows;
  };
};

/**
 * Generic GET by ID operation for user-scoped resources
 */
export const createGetById = (queryFn, tableName) => {
  return async (id, userId) => {
    requireUserId(userId, `get${tableName}ById`);
    const result = await queryFn(
      `SELECT * FROM ${tableName} WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  };
};

/**
 * Generic UPDATE operation for user-scoped resources
 */
export const createUpdate = (queryFn, tableName) => {
  return async (id, updates, userId) => {
    requireUserId(userId, `update${tableName}`);
    
    if (Object.keys(updates).length === 0) {
      throw new Error('No updates provided');
    }

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(', ');
    const values = [id, userId, ...Object.values(updates)];

    const result = await queryFn(`
      UPDATE ${tableName} SET ${setClause}
      WHERE id = $1 AND user_id = $2 RETURNING *
    `, values);
    
    return result.rows[0];
  };
};

/**
 * Generic DELETE operation for user-scoped resources
 */
export const createDelete = (queryFn, tableName) => {
  return async (id, userId) => {
    requireUserId(userId, `delete${tableName}`);
    const result = await queryFn(
      `DELETE FROM ${tableName} WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0];
  };
};

