import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

const whitelist = [
  //'https://reports.k8s.rpabot-prod-1.salt.x5.ru',
  'http://127.0.0.1:5500',
  'http://192.168.0.14:4000',
  'http://192.168.43.43:4000',
  'localhost',
  'http://127.0.0.1:4000',
  'http://127.0.0.1:8080'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log('origin ', origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// PostgreSQL client setup
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'ses513',
    port: 5432,
  });
  client.connect();
  
  // Endpoint to get all comments
  app.get('/shoutbox/comments', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM shoutbox ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).send('Error fetching comments');
    }
  });
  
  // Endpoint to add a new comment
  app.post('/shoutbox/comments', async (req, res) => {
    const { username, comment } = req.body;
    if (!username || !comment) {
      return res.status(400).send('Username and comment are required');
    }
    try {
      const result = await client.query(
        'INSERT INTO shoutbox (username, comment) VALUES ($1, $2) RETURNING *',
        [username, comment]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Error adding comment');
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });