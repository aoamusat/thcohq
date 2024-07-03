## Social Media API
This is a RESTful API for a basic social media platform. The API facilitates user interactions and data management within the platform, including user registration, post creation, following users, liking and commenting on posts, and real-time notifications for mentions, likes, and comments.

## Features
- User Management
    - User registration and account creation.
    - User authentication using JWT.
- Posts and Feed
    - Users can create posts with text and optional image/video attachments.
    - Users can follow other users.
    - Users can see posts from people they follow in their personalized feed.
    - Pagination for retrieving large amounts of data efficiently.
- Likes and Comments
    - Users can like and comment on posts created by others.
    - Users can see the number of likes and comments on a post.
- Notifications
  - Real-time notifications for mentions, likes, and comments using Pusher.
## Technical Specifications
- Backend Framework: Express.js
- Database: MongoDB with Mongoose as the ODM
- Real-time Notifications: Pusher
- Authentication: JWT
- Language: TypeScript
## Setup Instructions
### Prerequisites
- Node.js (>= 14.x)
MongoDB
- Pusher account (for real-time notifications)
### Installation
1. Clone the repository:

```bash
git clone https://gitlab.com/your-repository-url.git
cd your-repository-url
```
2. Install dependencies:

```bash
npm install
```
3. Create a .env file in the root directory and add the following environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```
4. Start the server:

```bash
npm run dev # for local development

npm run start # for production
```
## API Documentation
For detailed API endpoints and their functionalities, please refer to the Postman collection provided in the repository.

## Error Handling
The API returns appropriate HTTP status codes and error messages for different scenarios, such as:

- 400 Bad Request: Invalid input data.
- 401 Unauthorized: Missing or invalid authentication token.
- 404 Not Found: Requested resource not found.
- 500 Internal Server Error: Server-side error.

## Libraries and Tools Used
- Express.js: Web framework for Node.js.
- Mongoose: ODM for MongoDB.
- Pusher: Service for real-time notifications.
- jsonwebtoken: Library for JWT authentication.
- bcryptjs: Library for hashing passwords.
- multer: Middleware for handling multipart/form-data, used for file uploads.
- dotenv: Module for loading environment variables from a .env file.

## Real-time Notifications
Real-time notifications are implemented using Pusher. Users receive notifications for mentions, likes, and comments without persisting the notification data in the database. The server emits notifications directly to the intended user through WebSockets.