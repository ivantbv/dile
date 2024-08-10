import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import pkg from 'pg';
const { Client } = pkg;
import { WebSocketServer } from 'ws';

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
  'http://localhost:8080/',
  'http://localhost',
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
// app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));


const chatAdmins = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'chat_admins.json'), 'utf-8'));
console.log(chatAdmins, 'chat admins');
function isAdmin(email, host) {
  const admins = chatAdmins[host] || [];
  console.log(admins, ': admins ', email, ': email, and if it includes ', admins.includes(email))
  return admins.includes(email);
}

async function authorizeUserForComment(req, res, next) {
  const { id } = req.params;
  const email = req.body.email || req.headers.email; // Get email from body or headers
  const host = req.headers.origin;

  try {
      const result = await client.query('SELECT * FROM shoutbox WHERE id = $1', [id]);
      const comment = result.rows[0];

      if (!comment) {
          return res.status(404).send('Comment not found');
      }

      const _isAdmin = isAdmin(email, host);
      const isOwner = comment.username === email;
      console.log(_isAdmin, '<-- is admin and is owner ---> ', isOwner, ' comment.username->>', 
      comment.username, ' and email ->>> ', email, 'хост:', host);

      if (_isAdmin || isOwner) {
          req.isAdmin = _isAdmin;  // Pass the admin status to the next middleware
          next();
      } else {
          res.status(403).send('Forbidden: You do not have permission to perform this action');
      }
  } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).send('Error authorizing user');
  }
}

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
// app.get('/shoutbox/comments', async (req, res) => {
//   try {
//     const result = await client.query('SELECT * FROM shoutbox ORDER BY created_at DESC');
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).send('Error fetching comments');
//   }
// });

app.get('/api/chat-admins', (req, res) => {
  const host = req.headers.origin; //Get the host from the request headers
  const admins = chatAdmins[host] || [];
  console.log(host, 'host', 'and admins: ', admins)
  res.json({ admins });
});

app.get('/shoutbox/comments', async (req, res) => {
  const host = req.headers.origin; // Assuming the host is sent in the headers
  try {
    const result = await client.query(
      'SELECT * FROM shoutbox WHERE host = $1 ORDER BY is_pinned DESC, created_at DESC', [host]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

// Endpoint to add a new comment
// app.post('/shoutbox/comments', async (req, res) => {
//   const { username, comment, isAdmin } = req.body;
//   const host = req.headers.origin; // Assuming the host is sent in the headers
//   if (!username || !comment) {
//     return res.status(400).send('Username and comment are required');
//   }
//   try {
//     const result = await client.query(
//       'INSERT INTO shoutbox (username, comment, is_admin, host) VALUES ($1, $2, $3, $4) RETURNING *',
//       [username, comment, isAdmin, host]
//     );

//     // Broadcast new comment to all WebSocket clients
//     const newComment = result.rows[0];
//     wss.clients.forEach(client => {
//       if (client.readyState === client.OPEN) {
//         console.log('Sending new comment to client:', newComment);
//         client.send(JSON.stringify(newComment));
//       }
//     });

//     res.json(newComment);
//   } catch (error) {
//     console.error('Error adding comment:', error);
//     res.status(500).send('Error adding comment');
//   }
// });

app.post('/shoutbox/comments', async (req, res) => {
  const { comment, email } = req.body;
  const host = req.headers.origin;

  if (!comment || !email) {
      return res.status(400).send('Username, email, and comment are required');
  }
  console.log(email, host, ' email and host from post comment!')
  let _isAdmin = isAdmin(email, host);
  try {
      const result = await client.query(
          'INSERT INTO shoutbox (username, comment, is_admin, host) VALUES ($1, $2, $3, $4) RETURNING *',
          [email, comment, _isAdmin, host]
      );

      const newComment = result.rows[0];
      wss.clients.forEach(client => {
          if (client.readyState === client.OPEN) {
              client.send(JSON.stringify(newComment));
          }
      });
      res.status(201).json(newComment);
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).send('Error adding comment');
  }
});

//Delete Message Endpoint:
app.delete('/shoutbox/comments/:id', authorizeUserForComment, async (req, res) => {
  const { id } = req.params;
  try {
    await client.query('DELETE FROM shoutbox WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Error deleting comment');
  }
});

//Pin Message Endpoint:
app.post('/shoutbox/pin/:id', authorizeUserForComment, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).send('Forbidden: Only admins can pin or unpin messages');
  }
  const { id } = req.params;
  const { unpin } = req.body;  // Check if the request is to unpin
  const is_pinned = !unpin;
  //const _isAdmin = isAdmin(email, host);
  //   if (!_isAdmin) {
  //   return res.status(403).send('Forbidden: Only admins can pin or unpin messages');
  // }
  console.log(is_pinned, 'is pinned? ');
  try {
    await client.query('UPDATE shoutbox SET is_pinned = $1 WHERE id = $2', [is_pinned, id]);
    res.status(200).send();
  } catch (error) {
    console.error('Error pinning/unpinning comment:', error);
    res.status(500).send('Error pinning/unpinning comment');
  }
});

// WebSocket server setup
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//   console.log('New client connected');
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // const parsedMessage = JSON.parse(message);
    // if (parsedMessage.type === 'ping') {
    //   ws.send(JSON.stringify({ type: 'pong' }));
    // } else 
    if (message === 'ping') {
      ws.send('pong');
    }
  });

  ws.on('close', () => {
    //console.log('Client disconnected');
  });
});