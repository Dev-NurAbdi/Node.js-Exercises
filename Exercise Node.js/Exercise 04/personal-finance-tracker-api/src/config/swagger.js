const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance Tracker API',
      version: '1.0.0',
      description: 'API for managing personal income, expenses, categories and monthly summaries.'
    },
    servers: [{ url: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`, description: 'API server' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      schemas: {
        Transaction: {
          type: 'object', required: ['title', 'amount', 'type', 'category', 'date'],
          properties: {
            title: { type: 'string', example: 'Groceries' },
            amount: { type: 'number', example: 50, description: 'Positive number. type determines income or expense.' },
            type: { type: 'string', enum: ['income', 'expense'] },
            category: { type: 'string', example: 'Food' },
            date: { type: 'string', format: 'date', example: '2025-05-27' }
          }
        },
        Register: { type: 'object', required: ['name', 'email', 'password'], properties: {
          name: { type: 'string', example: 'Nur' }, email: { type: 'string', example: 'nur@example.com' }, password: { type: 'string', example: 'password123' }
        } },
        Login: { type: 'object', required: ['email', 'password'], properties: {
          email: { type: 'string', example: 'nur@example.com' }, password: { type: 'string', example: 'password123' }
        } }
      }
    },
    tags: [
      { name: 'Auth', description: 'Registration, login and user profile' },
      { name: 'Transactions', description: 'Income and expense management' },
      { name: 'Categories', description: 'Predefined categories' },
      { name: 'Upload', description: 'Profile picture upload' },
      { name: 'Admin', description: 'Admin-only statistics' }
    ],
    paths: {
      '/auth/register': { post: { tags: ['Auth'], summary: 'Register a user', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Register' } } } }, responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' }, 409: { description: 'Email already registered' } } } },
      '/auth/login': { post: { tags: ['Auth'], summary: 'Login and receive JWT', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { 200: { description: 'Logged in' }, 401: { description: 'Invalid credentials' } } } },
      '/auth/profile': { get: { tags: ['Auth'], summary: 'Get current user profile', security: [{ bearerAuth: [] }], responses: { 200: { description: 'User profile' }, 401: { description: 'Unauthorized' } } } },
      '/transactions': {
        get: { tags: ['Transactions'], summary: 'List your transactions', security: [{ bearerAuth: [] }], parameters: [
          { in: 'query', name: 'type', schema: { type: 'string', enum: ['income', 'expense'] } },
          { in: 'query', name: 'category', schema: { type: 'string' } },
          { in: 'query', name: 'from', schema: { type: 'string', format: 'date' } },
          { in: 'query', name: 'to', schema: { type: 'string', format: 'date' } },
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } }
        ], responses: { 200: { description: 'Transactions list' }, 401: { description: 'Unauthorized' } } },
        post: { tags: ['Transactions'], summary: 'Create a transaction', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } }, responses: { 201: { description: 'Created' }, 400: { description: 'Validation error' } } }
      },
      '/transactions/monthly-summary': { get: { tags: ['Transactions'], summary: 'Get monthly totals grouped by category', security: [{ bearerAuth: [] }], parameters: [
        { in: 'query', name: 'year', schema: { type: 'integer', example: 2025 } }, { in: 'query', name: 'month', schema: { type: 'integer', minimum: 1, maximum: 12, example: 5 } }
      ], responses: { 200: { description: 'Monthly summary' } } } },
      '/transactions/{id}': {
        put: { tags: ['Transactions'], summary: 'Update a transaction you own', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Transaction' } } } }, responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } } },
        delete: { tags: ['Transactions'], summary: 'Delete a transaction you own', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } } }
      },
      '/categories': { get: { tags: ['Categories'], summary: 'List predefined categories', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Categories' } } } },
      '/upload/profile-picture': { post: { tags: ['Upload'], summary: 'Upload profile picture to Cloudinary', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } }, required: ['image'] } } } }, responses: { 200: { description: 'Uploaded' }, 400: { description: 'Missing or invalid image' } } } },
      '/admin/overview': { get: { tags: ['Admin'], summary: 'Get platform overview (admin only)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Overview statistics' }, 403: { description: 'Admin only' } } } }
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
