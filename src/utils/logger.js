// Centralized logging utility
// Provides consistent logging across the application

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // Info logging - for general information
  info(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data || '');
    }
  }

  // Warning logging - for warnings and deprecated usage
  warn(message, data = null) {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  }

  // Error logging - for errors and exceptions
  error(message, error = null) {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || '');
    }
    
    // In production, you might want to send errors to a logging service
    if (this.isProduction && error) {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
      // this.sendToLoggingService(message, error);
    }
  }

  // Debug logging - for debugging information
  debug(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  // Success logging - for successful operations
  success(message, data = null) {
    if (this.isDevelopment) {
      console.log(`[SUCCESS] ${message}`, data || '');
    }
  }

  // API logging - for API calls
  api(method, url, status, duration = null) {
    if (this.isDevelopment) {
      const durationText = duration ? ` (${duration}ms)` : '';
      console.log(`[API] ${method} ${url} - ${status}${durationText}`);
    }
  }

  // Authentication logging - for auth events
  auth(event, user = null) {
    if (this.isDevelopment) {
      console.log(`[AUTH] ${event}`, user ? `User: ${user.email}` : '');
    }
  }

  // Data operation logging - for CRUD operations
  data(operation, type, id = null) {
    if (this.isDevelopment) {
      const idText = id ? ` (ID: ${id})` : '';
      console.log(`[DATA] ${operation} ${type}${idText}`);
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
