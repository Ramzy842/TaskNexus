// User Authentication Tests
// Nonexistent user → should return 401 with "Invalid email or password."
// Google-registered user (googleId exists) → should return 400 with "This email is registered with Google..."
// Incorrect password → should return 401 with "Invalid email or password."
// Correct credentials → should return 200 with a valid JWT and user data.

// Error Handling
// If User.findOne() throws an error → should pass the error to next(err).