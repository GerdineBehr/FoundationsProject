<<<<<<< HEAD
# Welcome to 1822 Serverless NERD (Node.js, Express.js, React, DynamoDB)!

Hello I have been changed!

This is the training repository for the Serverless NERD cohort starting on September 9th, 2024. All of the notes, demos, study guides, project guidelines, and other resources will be found here.

## Installation Guide

For training, we will need the following:

- [Git](https://git-scm.com/download)
- [Visual Studio Code](https://code.visualstudio.com)
- [Node LTS](https://nodejs.org/en)
- [Postman](https://www.postman.com)

You will also need to setup a free tier AWS Account, here is a guide on how:

- [AWS Account Setup](https://repost.aws/knowledge-center/create-and-activate-aws-account)

The rest of the technologies will be covered during training.

## Useful Links

- [Git Cheat Sheet](https://i.redd.it/8341g68g1v7y.png)
- [Mozilla JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/javascript)
=======
# FoundationsProject
<<<<<<< HEAD
Ticketing System App 
>>>>>>> b16bfa1 (Initial commit)
=======
Ticketing System App Plan


1. Set Up Your Environment
GitHub Repository:
Create a repository for your project on GitHub.
Clone it to your local machine, initialize the repo, and push your first commit.
Technologies Setup:
Ensure Node.js is installed, and initialize a Node.js project (npm init).
Install necessary dependencies like express, jest, and aws-sdk.

2. Understand the Use Case
Login/Register System: Users (employees and managers) will need to log in or register with a username and password.
Submit Ticket: Employees can submit reimbursement requests, which are initially marked as "Pending."
Ticket Processing: Managers can view and either approve or deny reimbursement tickets.
View Previous Tickets: Employees can view their past reimbursement submissions.

3. Database Design
Use DynamoDB for storing data.
Tables to consider:
Users: Store username, password, and role (employee or manager).
Tickets: Store reimbursement information, including amount, description, status, and employee ID.

4. Plan Routes for the Backend (Express.js)
Auth Routes:
POST /register: Register a new user.
POST /login: Login a user.
Ticket Routes:
POST /tickets: Submit a reimbursement ticket.
GET /tickets: View tickets (either employee-specific or all pending tickets for managers).
PUT /tickets/:id: Managers can approve/deny tickets.
Profile Routes (Extension Feature):
GET /profile: View user account details.
PUT /profile: Update user account details.

5. User Roles & Permissions
Implement role-based access control:
Employees can submit tickets and view their own history.
Managers can view all pending tickets and process them (approve/deny).
Use middleware to restrict routes to specific roles.

6. Ticket Status Workflow
Status Flow:
Tickets start as "Pending."
Managers can change status to "Approved" or "Denied."
Once processed, the status cannot be changed again.

7. Testing (Jest)
Write unit and integration tests for:
User registration and login.
Submitting tickets.
Approving/denying tickets.
Use Postman to manually test your API during development.

8. Stretch Goals
Reimbursement Types: Allow employees to categorize tickets (e.g., Travel, Lodging, Food).
Upload Receipts: Implement image upload for receipts (use AWS S3 for cloud storage).
User Profile: Extend user information (name, profile picture, etc.).

9. Iterate and Refine
Start with the Minimum Viable Product (MVP): focus on login, ticket submission, ticket processing, and viewing past tickets.
Gradually add extension features as time allows.
By following these steps, you will build a well-structured, functional ticketing system with room for future expansion. Let me know when you're ready to dive into specific sections!
>>>>>>> 0510554 (Update README.md)
