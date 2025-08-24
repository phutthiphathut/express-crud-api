# CRUD API with TypeScript, Express, and TypeORM

A comprehensive RESTful API built with TypeScript, Express, and TypeORM with PostgreSQL database support, featuring full CRUD operations with pagination, validation, and error handling.

## 🚀 Features

- **Full CRUD Operations**: Create, Read (with pagination), Update, and Delete
- **TypeScript**: Fully typed for better development experience
- **PostgreSQL Database**: Persistent data storage with TypeORM
- **Data Validation**: Using class-validator for request validation
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Built-in security middlewares (Helmet, CORS)
- **Pagination**: Efficient pagination for data retrieval
- **Database Connection Management**: Proper connection handling with graceful shutdown
- **Environment Configuration**: Configurable via environment variables
- **API Documentation**: Well-documented endpoints with examples

## 📋 API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint     | Description                   | Query Parameters |
| ------ | ------------ | ----------------------------- | ---------------- |
| GET    | `/users`     | Get all users with pagination | `page`, `limit`  |
| GET    | `/users/:id` | Get user by ID                | -                |
| POST   | `/users`     | Create new user               | -                |
| PUT    | `/users/:id` | Update user by ID             | -                |
| DELETE | `/users/:id` | Delete user by ID             | -                |
| GET    | `/health`    | Health check endpoint         | -                |

## 📁 Project Structure

```
src/
├── controller/
│   └── UserController.ts    # CRUD operations logic
├── entity/
│   └── User.ts             # User entity with validations
├── routes/
│   ├── index.ts            # Main routes configuration
│   └── userRoutes.ts       # User-specific routes
├── repository/
│   └── UserRepository.ts   # Database repository layer
├── app.ts                  # Express app configuration
├── data-source.ts          # TypeORM configuration
└── server.ts               # Application entry point
```

## 🗄️ Database Prerequisites

- **PostgreSQL** database server
- Valid database credentials
- Network access to database server

## 🛠️ Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd express-crud-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the example environment file:

   ```bash
   copy .env.example .env
   ```

   Update the `.env` file with your database configuration:

   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # CORS Configuration
   CORS_ORIGIN=*

   # Database Configuration
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=crud_api_db
   DB_SYNCHRONIZE=true
   DB_LOGGING=false
   ```

4. **Set up PostgreSQL Database:**

   Create a PostgreSQL database:

   ```sql
   CREATE DATABASE crud_api_db;
   ```

   Make sure your PostgreSQL server is running and accessible with the credentials specified in your `.env` file.

5. **Run in development mode:**

   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 📝 API Usage Examples

### 1. Get All Users (with pagination)

```bash
GET /api/users?page=1&limit=10
```

**Response:**

```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "age": 30,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "totalPages": 1
}
```

### 2. Get Single User

```bash
GET /api/users/1
```

**Response:**

```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 30,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 3. Create New User

```bash
POST /api/users
Content-Type: application/json

{
  "firstName": "Alice",
  "lastName": "Wilson",
  "email": "alice.wilson@example.com",
  "age": 28
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "data": {
    "id": 4,
    "firstName": "Alice",
    "lastName": "Wilson",
    "email": "alice.wilson@example.com",
    "age": 28,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 4. Update User

```bash
PUT /api/users/1
Content-Type: application/json

{
  "firstName": "John Updated",
  "age": 31
}
```

**Response:**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "firstName": "John Updated",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "age": 31,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete User

```bash
DELETE /api/users/1
```

**Response:**

```json
{
  "message": "User deleted successfully"
}
```

## ✅ Validation Rules

The User entity includes the following validation rules:

- **firstName**: Required, non-empty string
- **lastName**: Required, non-empty string
- **email**: Required, valid email format, unique
- **age**: Required, number between 0 and 150

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or validation errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate email addresses
- **408 Request Timeout**: Request timeout (30 seconds)
- **500 Internal Server Error**: Server errors

**Error Response Format:**

```json
{
  "error": "Error message description",
  "details": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "Please provide a valid email"
      }
    }
  ]
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Request Timeout**: 30-second timeout protection
- **Input Validation**: Server-side validation for all inputs
- **Error Logging**: Comprehensive error logging

## 🌐 Environment Variables

### Server Configuration

| Variable      | Default     | Description          | Required |
| ------------- | ----------- | -------------------- | -------- |
| `PORT`        | 3000        | Server port          | No       |
| `NODE_ENV`    | development | Environment mode     | No       |
| `CORS_ORIGIN` | \*          | CORS allowed origins | No       |

### Database Configuration

| Variable         | Default   | Description               | Required |
| ---------------- | --------- | ------------------------- | -------- |
| `DB_TYPE`        | postgres  | Database type             | Yes      |
| `DB_HOST`        | localhost | Database host             | Yes      |
| `DB_PORT`        | 5432      | Database port             | Yes      |
| `DB_USERNAME`    | -         | Database username         | Yes      |
| `DB_PASSWORD`    | -         | Database password         | Yes      |
| `DB_DATABASE`    | -         | Database name             | Yes      |
| `DB_SYNCHRONIZE` | true      | Auto-sync database schema | No       |
| `DB_LOGGING`     | false     | Enable SQL query logging  | No       |

⚠️ **Important**: Set `DB_SYNCHRONIZE=false` in production environments!

## 🧪 Testing the API

You can test the API using tools like:

- **curl**: Command line HTTP client
- **Postman**: GUI API testing tool
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing platform

### Sample curl commands:

```bash
# Get all users
curl -X GET http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","age":25}'

# Update a user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Updated Name"}'

# Delete a user
curl -X DELETE http://localhost:3000/api/users/1
```

## 📊 Sample Data

The application comes with pre-populated sample data:

1. John Doe (john.doe@example.com)
2. Jane Smith (jane.smith@example.com)
3. Bob Johnson (bob.johnson@example.com)

## 🚀 Production Considerations

For production deployment, consider:

1. **Database**: Replace in-memory storage with a persistent database (PostgreSQL, MySQL, MongoDB)
2. **Authentication**: Add JWT or session-based authentication
3. **Rate Limiting**: Implement API rate limiting
4. **Logging**: Use structured logging (Winston, Pino)
5. **Monitoring**: Add health checks and monitoring
6. **Docker**: Containerize the application
7. **Environment**: Use environment-specific configurations

## 📚 Technologies Used

- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **Express.js**: Web framework
- **TypeORM**: ORM for data modeling
- **class-validator**: Validation library
- **class-transformer**: Object transformation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Happy coding! 🚀**
