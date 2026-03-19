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
