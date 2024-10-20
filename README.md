Namahaom Assignment
Project Description
The Namahaom Assignment is a user and admin management system built with Node.js and Express.js. It allows:

User Management: Users can register, log in, and view their profile.
Admin Management: Admins can create new users, update user details (name, email, and role), and delete users, with restrictions to prevent self-deletion.
Features
User Registration: Secure registration with hashed passwords.
User Login: Authentication using JWT (JSON Web Token).
Profile Viewing: Authenticated users can view their profile information.
Admin User Management: Admins can manage user accounts, including creating, updating, and deleting users.
Role-based Access Control: Only admins can access admin routes.
Robust Logging: Logging is handled with Winston and Morgan for debugging and monitoring.
Technologies Used
Node.js: JavaScript runtime for building server-side applications.
Express.js: Fast and minimalist web framework for Node.js.
MongoDB: NoSQL database for storing user and admin information.
JWT: JSON Web Token for user authentication.
Morgan: HTTP request logger middleware for Node.js.
Winston: Logger for handling application logs.
TypeScript: Strongly typed JavaScript for improved development experience.
Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v14 or higher): Install Node.js
MongoDB: A running instance of MongoDB (locally or through a service like MongoDB Atlas).
Docker (optional)

Clone the Repository:
Install Dependencies: npm install
Environment Variables: Create a .env file in the root of the project and provide the following variables
  MONGODB_STRING=<Your MongoDB Connection String>
  JWT_KEY=<Your JWT Secret Key>
Start the Application: npm start

Run in Docker: 
  docker build -t namahaom-app .
  docker run -p 5002:5002 namahaom-app

Usage
Once the project is running, you can access the following endpoints:

User Management:
POST /api/register: Register a new user.
POST /api/login: Log in a user.
GET /api/profile: View the profile of the authenticated user.
Admin Management:
POST /api/admin/users: Create a new user (admin only).
PUT /api/admin/users/:userId : Update user details (admin only).
DELETE /api/admin/users/:userId : Delete a user (admin only).


