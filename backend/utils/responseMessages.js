const responseMessages = {
    login: {
        invalidEmailOrPass: "Invalid email or password.",
        registeredWithGoogle:
            "This email is registered with Google. Please use 'Log in with Google'.",
    },
    tasks: {
        toRetrieveNotFound: "The task you are trying to retrieve is not found.",
        accessUnauthorized: "You are not authorized to access this task.",
        creationSuccess: "Task created successfully.",
        emptyBody: "Request body cannot be empty when updating a task.",
        toUpdateNotFound: "The task you are trying to update is not found.",
        updateUnauthorized: "You are not authorized to update this task.",
        updateSuccess: "Task updated successfully.",
        toDeleteNotFound: "The task you are trying to delete is not found.",
        deletionUnauthorized: "You are not authorized to delete this task.",
    },
    users: {
        toRetrieveNotFound: "The user you are trying to retrieve is not found.",
        bodyInvalidFields: "Body contains invalid fields",
        toDeleteNotFound: "The user you are trying to delete is not found.",
        deletionSuccess: "User deleted successfully",
        usedEmail: "The email you provided is already in use.",
        passwordOrGoogleRequired: "Either password or googleId is required.",
        successfullRegistration: "Registration completed successfully.",
        updateUnauthorized: "You are not authorized to update user info.",
        toUpdateNotFound: "The user you are trying to update is not found.",
        updateSuccess: "User updated successfully.",
        bodyPayloadLengthError:
            "Body payload error! Make sure only username, name, email and password are provided.",
        deletionUnauthorized: "You are not authorized to update user info.",
        accessUnauthorized: "You are not authorized to access this user info.",
    },
};

module.exports = { responseMessages };
