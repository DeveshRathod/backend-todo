# Web Application Setup and Usage

## Installation and Setup

To get started with the web application, follow the steps below:

### 1. Backend Setup

1. In the root directory of the project, install the necessary dependencies:

   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Start the Vite React application:
   ```bash
   npm run dev
   ```

### 3. Database Setup

Make sure you have a MySQL database ready. Set up the connection details in the `.env` file with your database credentials.

## Roles in the Web Application

### Normal User

- A normal user can see the banner displayed on the application.
- However, they **cannot toggle the banner's visibility**. To do that, the user must log in first.

### Admin User

- An admin user has access to the dashboard.
- The admin can update the banner information, including title, description, link, and visibility status.

Ensure you have the appropriate roles set up in your database for correct access control within the application.
