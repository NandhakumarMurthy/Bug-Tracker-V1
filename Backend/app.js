console.log('preparing server!');



const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // 1. Import the connection tool
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 2. Create the "pool" (The bridge to your database)
// Make sure these values match your .env or actual DB settings!
const pool = new Pool({
  user: 'bug_admin',           // Correct
  host: 'localhost',
  database: 'bugtracker_db',   // UPDATED to match your screenshot
  password: 'Wolverine',   // Use your real password
  port: 5432,
});



// 1. GET ROUTE: Send all bugs to the frontend when it loads

app.get('/bugs', async (req, res) => {
  try {
    const allBugs = await pool.query("SELECT * FROM issues ORDER BY id DESC");
    res.json(allBugs.rows); // Sends clean JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Sends error as JSON
  }
});


// 2. POST ROUTE: Receive a new bug from the frontend and save it
app.post('/bugs', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    
    // Insert into the 'issues' table
    const newBug = await pool.query(
      "INSERT INTO issues (title, description, priority, status) VALUES ($1, $2, $3, 'Open') RETURNING *",
      [title, description, priority]
    );
    
    res.json(newBug.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});




app.patch('/bugs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Attempting to close bug ID: ${id}`);

    // MUST use "issues" because that is your table name!
    const result = await pool.query(
      "UPDATE issues SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bug not found" });
    }

    res.json(result.rows[0]); // This sends the JSON React is looking for
  } catch (err) {
    console.error("DATABASE ERROR:", err.message);
    // We send a JSON object even if there is an error to avoid the "SyntaxError"
    res.status(500).json({ error: err.message }); 
  }
});



// DELETE ROUTE: Permanently remove a bug
app.delete('/bugs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remember: your table name is 'issues'
    const deleteOp = await pool.query("DELETE FROM issues WHERE id = $1", [id]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: "Bug not found" });
    }

    res.json({ message: "Bug deleted successfully" });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});



// ... rest of your routes ...

app.listen(5000, () => console.log("Server running on port http://localhost:5000"));





