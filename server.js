import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import pkg from 'pg';
const { Client } = pkg;
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url'; //new import to add to the x5 adminshoutbox!

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
  'http://127.0.0.1:8080',
  'http://192.168.0.3:8080'
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
      'SELECT * FROM shoutbox WHERE host = $1 ORDER BY created_at ASC', [host] //ORDER BY is_pinned DESC, created_at DESC
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

// app.get('/adminbox/comments', async (req, res) => {
//   const host = req.headers.origin; 
//   const email = req.query.userEmail || ''; 
//   const chatId = req.query.chatId || ''; // Optional chat ID to filter messages
//   console.log(host, '<- host ', email, '<- email ', chatId, '<- chatid!')
//   try {
//     let query = 'SELECT * FROM shoutbox WHERE host = $1';
//     const queryParams = [host];

//     if (email) {
//       query += ' AND username = $2';
//       queryParams.push(email);
//     }

//     if (chatId) {
//       query += ' AND chat_id = $3';
//       queryParams.push(chatId);
//     }
    
//     query += ' ORDER BY created_at ASC';

//     const result = await client.query(query, queryParams);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching comments:', error);
//     res.status(500).send('Error fetching comments');
//   }
// });
app.get('/adminbox/comments', async (req, res) => {
  const host = req.headers.origin;
  const email = req.query.userEmail || '';
  const chatId = req.query.chatId || '';
  const isAdmin = req.query.isAdmin === 'true'; // New parameter to identify admin
  console.log(host, '<- host ', email, '<- email ', chatId, '<- chatid!');
  
  try {
    let query = 'SELECT * FROM shoutbox WHERE host = $1';
    const queryParams = [host];

    // If user request, filter by their email
    if (email && !isAdmin) {
      query += ' AND username = $2';
      queryParams.push(email);
    }

    // If admin request, allow filtering by chatId
    if (chatId) {
      query += isAdmin ? ' AND chat_id = $2' : ' AND chat_id = $3';
      queryParams.push(chatId);
    }
    
    query += ' ORDER BY created_at ASC';
    const result = await client.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

app.post('/adminbox/get-archived-chats', async (req, res) => {
  // Extract host directly from request headers
  const host = req.headers.origin;
  try {
      const result = await client.query(
          'SELECT chat_id, username, comment, created_at, admin_email FROM shoutbox WHERE is_archived = true AND host = $1',
          [host]  // Use the host obtained from the headers
      );
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching archived chats:', error);
      res.status(500).json({ error: 'Failed to fetch archived chats' });
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
  const { unpin } = req.body;
  const is_pinned = !unpin;

  try {
    await client.query('UPDATE shoutbox SET is_pinned = $1 WHERE id = $2', [is_pinned, id]);
    res.status(200).send();
  } catch (error) {
    console.error('Error pinning/unpinning comment:', error);
    res.status(500).send('Error pinning/unpinning comment');
  }
});

app.post('/adminbox/comments', async (req, res) => {
  const { comment, email, userEmail, chatId } = req.body;
  const host = req.headers.origin;
  console.log(comment, 'comment in server', email, 'email in server?', chatId, 'chatid??')
  if (!comment || !email) {
    return res.status(400).send('Email and comment are required');
  }

  const _isAdmin = isAdmin(email, host);
  //const username = _isAdmin && userEmail ? userEmail : email;
  const username = userEmail; //_isAdmin ? email :
  const _chatId = chatId || uuidv4(); // Generate a new chat ID if none is provided

  try {
    const result = await client.query(
      'INSERT INTO shoutbox (username, comment, is_admin, host, chat_id, admin_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, comment, _isAdmin, host, _chatId, _isAdmin ? email : null]
    );

    const newComment = result.rows[0];
    // wss.clients.forEach(client => {
    //   if (client.readyState === client.OPEN) {
    //     client.send(JSON.stringify(newComment));
    //   }
    // });
    broadcastUpdate('new_message', newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

/////
app.post('/adminbox/archive-chat', async (req, res) => {
  const { chatId } = req.body;
  try {
     await client.query('UPDATE shoutbox SET is_archived = true WHERE chat_id = $1', [chatId]);
     broadcastUpdate('chat_archived' ,chatId);
     res.status(200).json({ message: 'Chat archived successfully' });
  } catch (error) {
     console.error('Error archiving chat:', error);
     res.status(500).json({ error: 'Failed to archive chat' });
  }
});
///////

app.post('/adminbox/get-chat-id', async (req, res) => {
  const { adminEmail, userEmail } = req.body;
  const host = req.headers.origin;

  if (!adminEmail || !userEmail) {
      return res.status(400).send('Both adminEmail and userEmail are required.');
  }

  try {
      // Check if a chatId already exists for this conversation
      const result = await client.query(
        'SELECT chat_id FROM shoutbox WHERE (admin_email = $1 OR admin_email IS NULL) AND username = $2 AND host = $3 LIMIT 1',
        [adminEmail, userEmail, host]
      );  

      let chatId;
      console.log(result, 'result from getchatid')
      if (result.rows.length > 0) {
          // Chat ID found, return it
          chatId = result.rows[0].chat_id;
      } else {
          // No chat ID found, generate a new one
          chatId = uuidv4();
          // Insert an initial record to establish the chat with the new chatId
          // await client.query(
          //     'INSERT INTO shoutbox (username, comment, is_admin, host, chat_id, admin_email) VALUES ($1, $2, $3, $4, $5, $6)',
          //     [userEmail, comment, true, host, chatId, adminEmail]
          // );
      }

      // Return the chatId
      res.status(200).json({ chatId });

  } catch (error) {
      console.error('Error retrieving or creating chatId:', error);
      res.status(500).send('Server error while retrieving or creating chatId');
  }
});


// WebSocket server setup
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const wss = new WebSocketServer({ server });

function broadcastUpdate(type, chatMessage) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: type, data: chatMessage }));
    }
  });
}

async function getOrCreateChatId(email, host) {
  try {
      const result = await client.query(
          'SELECT chat_id FROM shoutbox WHERE username = $1 AND host = $2 AND is_archived = false LIMIT 1',
          [email, host]
      );
      console.log(result.rows, 'result rows from getorcreatechatid')
      if (result.rows.length > 0) {
          return result.rows[0].chat_id;  // Return existing chat_id
      } else {
          return uuidv4();  // Create new chat_id if none found
      }
  } catch (error) {
      console.error('Error getting or creating chatId:', error);
      throw new Error('Database error');
  }
}

wss.on('connection', async (ws, req) => {
  // ws.id = uuidv4();  // Assign a unique identifier to each client
  // ws.selectedChatId = null;  // Initially, no selectedChatId until they interact

  // ws.send(JSON.stringify({type: 'first_time_user', chatId: ws.id}))
  // console.log('sent ws.id: ', ws.id, 'to client')
  const protocol = req.headers.host.startsWith('https') ? 'https' : 'http';
  const parsedUrl = new URL(req.url, `${protocol}://${req.headers.host}`); // Use URL class to parse
  const email = parsedUrl.searchParams.get('email');  // Extract email from the query parameters
  const host = req.headers.origin;  // Get the host from request headers

  let retries = 5; // Max number of retries
  const retryInterval = 2000; // Retry every 2 seconds
  const checkEmail = async () => {
    if (!email) {
      console.log('Email not available, retrying...');
      retries--;

      // Retry after a delay if retries remain
      if (retries > 0) {
        setTimeout(checkEmail, retryInterval);
      } else {
        console.log('Max retries reached, closing connection');
        ws.close(); // Close connection if no email after retries
      }
      return;
    }

    console.log('Email received:', email);

    try {
      const chatId = await getOrCreateChatId(email, host);
      ws.selectedChatId = chatId;

      // Send the assigned chatId to the client
      ws.send(JSON.stringify({ type: 'first_time_user', chatId }));
      console.log('Assigned chatId:', chatId, 'to client with email:', email);
    } catch (error) {
      console.error('Error assigning chatId:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to assign chat ID' }));
      ws.close(); // Close the WebSocket in case of an error
    }
  };

  // Start the retry process
  checkEmail();
  ////

  ws.on('message', (message) => {
    if (message === 'ping') {
      ws.send('pong');
    } else {
      console.log('Message received from client:', message);
      //const parsedMessage = JSON.parse(message);
      const { comment, email, host } = message;
      
      // Broadcast message to all clients (adjust logic if necessary)
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ email, comment, host }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

//USER THE LOWER FUNCTION AND REMOVE THE BROADCAST FUNCTION FROM THE OTHER ENDPOINTS (TO PREVENT DUPLICATION)

// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     const parsedMessage = JSON.parse(message);

//     switch (parsedMessage.type) {
//       case 'new_message':
//         // Logic for handling new messages
//         const newMessageData = parsedMessage.data;
        
//         // Broadcast this new message to all clients
//         broadcastUpdate('new_message', newMessageData);
//         break;

//       case 'ping': 
//         // If there's a ping message, send a pong back
//         ws.send('pong');
//         break;

//       // Add other cases for different types of messages if needed
//       case 'chat_archived':
//         const chatId = parsedMessage.data.chatId;
//         broadcastUpdate('chat_archived', chatId);
//         break;

//       // Add more message types as needed
//       default:
//         console.log('Unknown message type received:', parsedMessage.type);
//         break;
//     }
//   });
// });
