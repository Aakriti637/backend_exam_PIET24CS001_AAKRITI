# Backend Development Practical Exam

**Name:** AAKRITI  
**Registration Number:** PIET24CS001

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)

## A1: Library Book Management API
Implemented CRUD operations:
- Add Book – POST `/books`
- Get All Books – GET `/books`
- Get Book by ID – GET `/books/:id`
- Update Book – PUT `/books/:id`
- Delete Book – DELETE `/books/:id`

## A2: Student Portal API
Implemented:
- Student Registration
- Password Hashing using bcrypt
- Student Login
- JWT Authentication
- Protected Profile Route
- Admin Authorization

## How to Run
1. Install dependencies using `npm install`.
2. Configure MongoDB URI and JWT secret in `.env`.
3. Run A1 using `node file/A1.js`.
4. Run A2 using `node file/A2.js`.

## Security
Environment variables are stored in `.env` and should not be uploaded publicly.