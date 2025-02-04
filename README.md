# Task Tracker

Task Tracker is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users efficiently manage their tasks. This project showcases robust testing practices, modern UI/UX design, and scalable architecture, making it an excellent example of a professional-grade application.

## Features

### Core Features
- **Task Management**: Add, view, edit, delete, and mark tasks as complete.
- **Authentication**:
  - JWT-based user authentication for secure access.
  - Google OAuth for external authentication.
  - Role-based access control for enhanced security.
- **Responsive Design**: Built with TailwindCSS for a mobile-friendly experience.

### Advanced Features
- **State Management**: Redux for efficient state handling.
- **Testing**:
  - Backend: Jest and Supertest for unit and integration testing.
  - Frontend: Jest and React Testing Library for component testing.
  - End-to-End (E2E): Cypress for simulating user flows and ensuring seamless functionality.
- **Scalability**: Modular codebase designed to handle future feature extensions.

## Tech Stack

### Frontend
- **React**: Component-based UI development.
- **Redux**: State management.
- **TailwindCSS**: Modern utility-first CSS framework for responsive design.

### Backend
- **Node.js**: Runtime environment.
- **Express**: Backend framework for building RESTful APIs.
- **MongoDB**: NoSQL database for flexible data storage.
- **Express Validator**: Middleware for validating user input.
- **Rate Limiting**: Protects the API from abuse by limiting the number of requests from a single IP address in a given time window. Implemented using `express-rate-limit` for sensitive endpoints such as login, logout, user and task management.
  - **Login**: Rate limited to 5 requests per 15 minutes.
  - **Logout**: Rate limited to 5 requests per 30 minutes.
  - **refresh**: Rate limited to 10 requests per 15 minutes.
  - **User Management**: Rate limited to 20 requests per hour.
  - **Task Management**: Rate limited to 30 requests per hour.

### Testing Tools
- **Jest**: Unit testing for both backend and frontend.
- **React Testing Library**: Frontend component testing.
- **Supertest**: Integration testing for APIs.
- **Cypress**: End-to-end testing for user workflows.

## Installation and Setup

### Prerequisites
- Node.js and npm installed.
- MongoDB running locally or on a cloud service.

### Steps to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Ramzy842/task-tracker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd task-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   MONGODB_URI=<Your MongoDB URI>
   SECRET=<Your JWT Secret>
   PORT=4000
   ```

5. Start the development servers:
   ```bash
   # In the root directory
   npm run dev
   ```

6. Access the application at `http://localhost:3000`.

## Testing

### Running Tests
- **Backend Tests**:
  ```bash
  cd backend && npm run test
  ```
- **Frontend Tests**:
  ```bash
  cd client && npm run test
  ```
- **End-to-End Tests**:
  ```bash
  npm run cypress
  ```

## Deployment

The application is deployed using modern CI/CD workflows:
- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on AWS.

## API Documentation

The backend API is documented using Swagger. Access the documentation locally at `http://localhost:4000/api-docs`.

### Example Endpoints
- **POST /api/auth/login**: User login.
- **GET /api/tasks**: Retrieve all tasks.
- **PUT /api/tasks/:id**: Update a task.

## Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400)

### Task Management
![Task Management](https://via.placeholder.com/800x400)

## Future Enhancements
- Task collaboration features for multi-user environments.
- Notifications and reminders for upcoming tasks.
- Analytics dashboard for task insights.

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, feel free to reach out:
- **Email**: ramzychahbani@gmail.com
- **GitHub**: [Ramzy842](https://github.com/Ramzy842)

