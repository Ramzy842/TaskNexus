# TaskNexus

TaskNexus is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users efficiently manage their tasks. This project showcases robust testing and security practices, modern UI/UX design, scalable architecture, and a strong focus on **Quality Assurance (QA) and automation testing**.

## Features

### Core Features
- **Task Management**: Add, view, edit, delete, and mark tasks as complete.
- **Task Statuses**: (To Do, In Progress, Completed).
- **Due Dates**: To ensure deadline management.
- **Authentication**:
  - JWT-based user authentication for secure access.
  - Google OAuth for external authentication.
- **Responsive Design**: Built with TailwindCSS for a mobile-friendly experience.

### Advanced Features
- **State Management**: Redux for efficient state handling.
- **Testing & Quality Assurance**:
  - **Backend**:
    - **Unit & Integration Testing**: Jest and Supertest for API testing.
  - **Frontend**:
    - **Component Testing**: Jest and React Testing Library.
    - **Visual Regression Testing**: Ensures UI consistency across updates.
  - **End-to-End (E2E) Testing**:
    - **Playwright**: Automates browser testing to simulate real user interactions.
    - **Cross-browser Testing**: Validates compatibility across different browsers.
    - **Headless Mode**: Enables CI/CD pipeline automation.
- **Scalability**: Modular codebase designed for future expansion.
- **File Storage**:
  - **AWS S3**: Used for storing user-uploaded profile images.

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
- **Rate Limiting**: Protects the API from abuse by limiting the number of requests from a single IP address in a given time window. Implemented using `express-rate-limit` for sensitive endpoints such as login, logout, user, and task management.
  - **Login**: Rate limited to 5 requests per 15 minutes.
  - **Logout**: Rate limited to 5 requests per 30 minutes.
  - **Refresh Token**: Rate limited to 10 requests per 15 minutes.
  - **User Management**: Rate limited to 20 requests per hour.
  - **Task Management**: Rate limited to 30 requests per hour.

### File Storage
- **Amazon S3**: Stores profile images for users. Files are uploaded securely and retrieved using signed URLs.

## Testing & Automation

### Testing Tools
- **Jest**: Unit testing for backend and frontend.
- **React Testing Library**: Frontend component testing.
- **Supertest**: Integration testing for APIs.
- **Playwright**: E2E testing framework for automated browser testing.
- **Mocking & Stubbing**:
  - Mock API responses to isolate component behavior.
  - Simulated user actions using Playwright.
  - Database seeding for integration tests.

### Running Tests
#### Backend Tests:
```sh
cd backend && npm run test
```

#### Frontend Tests:
```sh
cd client && npm run test
```

#### End-to-End Tests:
```sh
npm run test:e2e
```

## Installation and Setup

### Prerequisites
- **Node.js and npm** installed.
- **MongoDB** on a cloud service (MongoDB Atlas).
- **AWS S3 Bucket** configured for image storage.

### Steps to Run Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/Ramzy842/TaskNexus.git
   ```
2. Navigate to the project directory:
   ```sh
   cd TaskNexus
   ```
3. Install dependencies:
   ```sh
   npm install
   cd client && npm install
   ```
4. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   MONGODB_URI=<Your MongoDB URI>
   DEVELOPMENT_MONGODB_URI=<Your Development MongoDB URI>
   ACCESS_SECRET=<Your JWT Secret for access token>
   REFRESH_SECRET=<Your JWT Secret for refresh token>
   CLIENT_ID=<Client ID from Google Developer Console>
   CLIENT_SECRET=<Client Secret from Google Developer Console>
   MONGO_USERNAME=<MongoDB database username>
   MONGO_PASSWORD=<MongoDB database password>
   PORT=<Server port>
   AWS_ACCESS_KEY_ID=<Your AWS Access Key>
   AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>
   AWS_REGION=<Your AWS Region>
   S3_BUCKET_NAME=<Your S3 Bucket Name>
   ```
5. Start the development servers:
   ```sh
   # In the root directory
   npm run dev
   ```
6. Access the application at [http://localhost:5173](http://localhost:5173).

## Deployment
The application is deployed using modern CI/CD workflows:

- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on AWS.
- **File Storage & Delivery**: Profile images are stored on **Amazon S3**.
- **CI/CD Pipeline**:
  - **GitHub Actions**: Automates testing and deployment.
  - **Playwright Tests in CI**: Ensures end-to-end functionality before deployment.

## Screenshots
### Dashboard
(Dashboard Screenshot Placeholder)

### Task Management
(Task Management Screenshot Placeholder)

## Contributing
Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```sh
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## Contact
For any questions or feedback, feel free to reach out:

- **Email**: ramzychahbani@gmail.com
- **GitHub**: [Ramzy842](https://github.com/Ramzy842)

