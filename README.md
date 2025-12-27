# EventHub - Event Listing Platform

EventHub is a full-stack web application for discovering, creating, and managing events. It provides a user-friendly interface for browsing events, a seamless registration process, and powerful tools for event organizers.

## Live

https://eventhub-30yk.onrender.com

## Features

- **User Authentication:** Secure user registration and login with JWT authentication.
- **Event Management:** Create, update, and delete events.
- **Event Discovery:** Browse and search for events with filters.
- **Event Details:** View detailed information about each event.
- **User Dashboard:** Manage your created events and view your registered events.

## Tech Stack

**Client:**

- React
- React Router
- Zustand
- Axios
- Tailwind CSS

**Server:**

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eventhub.git
   ```
2. **Install server dependencies:**
    ```bash
    cd eventhub/server
    npm install
    ```
3. **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```
4. **Set up environment variables:**
   - Create a `.env` file in the `server` directory.
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

## Usage

1. **Start the server:**
    ```bash
    cd server
    npm run dev
    ```
2. **Start the client:**
    ```bash
    cd client
    npm start
    ```
The application will be available at `http://localhost:3000`.

## Deployment on Render

This project is configured for deployment on Render.

1.  Create a new "Blueprint" service on Render.
2.  Connect your GitHub repository.
3.  Render will automatically detect the `render.yaml` file and configure the services.
4.  You will need to set the `MONGO_URI` environment variable in the server service settings.

The `render.yaml` file configures two services:

*   `eventhub-server`: The Node.js backend server.
*   `eventhub-client`: The React frontend client.

It also sets up a free-tier PostgreSQL database.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event by ID
- `POST /api/events` - Create a new event (protected)
- `PUT /api/events/:id` - Update an event (protected)
- `DELETE /api/events/:id` - Delete an event (protected)

### Users
- `GET /api/users/me` - Get the current user's profile (protected)
- `GET /api/users/:id/events` - Get all events created by a user (protected)

## License

This project is licensed under the ISC License.
