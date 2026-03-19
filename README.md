Bug Tracker V1

A full-stack Bug Tracking application built to manage and streamline software issue reporting. This project features a modern React frontend, a robust Node.js/Express API, and a persistent PostgreSQL database.


Features

Create Issues: Quickly log new bugs with title, description, and priority levels.
Priority Badging: Visual color-coding for High, Medium, and Low priority tasks.
The "Closed" Tray: A dedicated slide-up tray to archive resolved issues without cluttering the main view.
Permanent Deletion: Clean up the database by permanently removing archived bugs.
Responsive UI: Built with Tailwind CSS for a clean, professional look.


Tech Stack

Frontend: Next.js (React), Tailwind CSS, Lucide React (Icons)
Backend: Node.js, Express.js, PG (node-postgres)
Database: PostgreSQL
Environment: Linux (Linux Mint)


Setup & Installation

1. Database Setup (PostgreSQL)
Create your database and table using the following SQL commands:

(sql)

CREATE DATABASE bugtracker_db;

CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20),
    status VARCHAR(20) DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Backend Configuration

    Navigate to the /backend folder.

    Run npm install.

    Create a .env file and add your credentials:
    Code snippet

    DB_USER=bug_admin
    DB_HOST=localhost
    DB_NAME=bugtracker_db
    DB_PASSWORD=your_password
    DB_PORT=5432

    Start the server: npm start (or nodemon app.js).

3. Frontend Configuration

    Navigate to the /frontend folder.

    Run npm install.

    Start the development server: npm run dev.

    Open http://localhost:3000 in your browser.
   

📈 Future Improvements (V2)

    User Authentication (Login/Signup).

    Search & Filter functionality.

   Image uploads for bug screenshots.

   Dark Mode support.

📄 License

   This project is licensed under the MIT License - see the LICENSE file for details.

Built with ❤️ by Nandhakumar
