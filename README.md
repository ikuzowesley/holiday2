KDA Student Portal - Wesley
===========================

Local prototype (Node.js + Express + MongoDB)

Requirements
- Node.js (v16+)
- MongoDB running locally or MongoDB Atlas
- (Optional) nodemon for development

Quick start (local)
1. Unzip the folder.
2. In terminal, run:
   cd FullStackSolution_Wesley
   npm install
3. Ensure MongoDB is running locally. Default URI used:
   mongodb://127.0.0.1:27017/kda_portal
   You can set a different URI by creating a .env file:
     MONGO_URI=your_mongo_uri
     JWT_SECRET=your_jwt_secret
4. Start server:
   npm start
5. Open browser: http://localhost:3000

Notes
- Register a user (set role to admin) to enable deletion of students.
- A simple mongo_seed.json is provided for sample documents (passwords are placeholders).
- This is a prototype for the assignment: frontend (vanilla JS), backend (Express), MongoDB.
