# APIMG-frontend

# API Management Frontend

## Overview
This is the frontend for the API Management System, providing a user-friendly interface for managing API keys, monitoring analytics, and configuring API settings. It is built using React and communicates with the backend for authentication and data retrieval.

## Architecture
- **React.js** - Frontend framework
- **React Router** - Handles navigation
- **Axios** - For making API requests
- **Context API** - State management
- **Tailwind CSS** - Styling

## Features
- **User Authentication**: Secure login and registration.
- **Dashboard**: View API analytics and manage API keys.
- **API Key Management**: Generate, view, and delete API keys.
- **Usage Monitoring**: Track API request counts and performance.
- **Dark Mode Support**: UI theme toggle.

## Setup Instructions
Ensure you have **Node.js** and **npm** installed.

### Steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/harshapeshave641/APIMG-frontend.git
   cd APIMG-frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. The frontend should now be running at `http://localhost:5173`.



