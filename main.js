import './helpers.js';
import './index.js';
import './index2.js';
import './shoutbox.js';

(async function () {
    async function checkIfAdmin(email) {
        try {
            const response = await fetch('http://127.0.0.1:4000/api/chat-admins');
            if (!response.ok) throw new Error('Failed to fetch admin list');
            const data = await response.json();
            console.log(data, 'data with admins', data.admins.includes(email), 'if it includes admins')
            return data.admins.includes(email);
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    async function fetchAdmins() {
        try {
            const response = await fetch('http://127.0.0.1:4000/api/chat-admins');
            if (!response.ok) throw new Error('Failed to fetch admins');
            const { admins } = await response.json();
            if (admins.length > 0) {
                // Select an admin for the chat (e.g., pick the first one)
                return admins[0];  // You can change this logic if needed
            } else {
                throw new Error('No admins available for this host');
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
            return null;
        }
    }    

    async function initializeShoutbox(config) {
        function loadCSS(url) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
        }
        const {
            wsUrl,
            endpointShoutBoxComment,
            endPointShoutBoxPin,
            customCSS,
            email
        } = config;
        const isAdmin = await checkIfAdmin(email);
        console.log(isAdmin, 'is this an admin?', email)
        if (customCSS) {
            loadCSS(customCSS);
        } else {
            loadCSS('https://')
        }

        const shoutboxContainer = document.createElement('div');
        shoutboxContainer.id = 'shoutbox-container';
        document.body.appendChild(shoutboxContainer);

        shoutboxContainer.innerHTML = `
        <div class="shoutbox">
            <div class="shoutbox-inner">
                <div class="shoutbox-headline">
                <h2></h2>
                </div>

                <!-- Pinned Messages Header -->
                <div class="pinned-messages-header" style="display: none;">
                    <span class="pinned-summary"></span>
                    <button class="view-pinned">View Pinned</button>
                    <button class="back-to-chat" style="display: none;">Back</button>
                </div>
                
                <div class="shoutbox-messages-container">
                    <div id="comments" class="scrollable"></div>
                </div>

                <div class="shoutbox-container-form">
                    <form id="shoutbox-form">
                        <input type="text" id="username" placeholder="Пользователь" required readonly>
                        <textarea rows="5" cols="36" id="comment" placeholder="Ваше сообщение" required></textarea>
                        <button type="submit" class="shoutbox-submit-btn" disabled="">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M7.89221 0.914114L7.24838 1.55794C7.096 1.71032 7.096 1.9574 7.24838 
                                2.10981L12.2929 7.15433H1.19018C0.974678 7.15433 0.799957 7.32905 0.799957 
                                7.54455V8.45506C0.799957 8.67055 0.974678 8.84527 1.19018 
                                8.84527H12.2929L7.24838 13.8898C7.096 14.0422 7.096 14.2893 7.24838 
                                14.4417L7.89221 15.0855C8.04459 15.2379 8.29167 15.2379 8.44408 
                                15.0855L15.2538 8.27575C15.4062 8.12337 15.4062 7.8763 15.2538 
                                7.72388L8.44405 0.914114C8.29167 0.761701 8.04459 0.761701 7.89221 
                                0.914114Z" fill="white">
                                </path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
        `
        function scrollToBottom() {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        const shoutForm = document.getElementById('shoutbox-form');
        const messagesDiv = document.getElementById('comments');
        const usernameInput = document.getElementById('username');
        const submitButton = document.querySelector('.shoutbox-submit-btn');
        const shoutboxTextarea = document.querySelector('.shoutbox #comment')

        shoutboxTextarea.addEventListener('input', (e) => {
            submitButton.disabled = !e.target.value.trim();
        });

        shoutboxTextarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevents the default action (i.e., adding a new line)
                //shoutForm.dispatchEvent(new Event('submit', { cancelable: true }));
                if (!submitButton.disabled) {
                    shoutForm.requestSubmit();  // Submit the form if the button is enabled
                }
            }
        });

        //const email = config.email;
        usernameInput.value = email;
        const isLocalhost = window.location.hostname === 'localhost';
        //const wsUrl = isLocalhost ? 'ws://127.0.0.1:4000' : wss://${window.location.hostname}/ws;
        const fetchHostWs = window.location.host.includes('localhost:8080') ? 
                    'https://reports.k8s.rpabot-prod-1.salt.x5.ru' : '';
        // const endpointShoutBoxComment = ${fetchHostWs}/shoutbox/comments;
        // const endPointShoutBoxPin = ${fetchHostWs}/shoutbox/pin;

        function startWebSocket(wsUrl) {
            let ws = new WebSocket(wsUrl);

            ws.onopen = function () {
                console.log('WebSocket connection opened');
                fetchMessages()
                //reconnectInterval = 100; // Reset the reconnect interval on successful connection
            };

            ws.onerror = function (error) {
                console.log('WebSocket error:', error);
            };

            ws.onclose = function () {
                console.log('WebSocket connection closed. Attempting to reconnect') //in', reconnectInterval / 1000, 'seconds');
                startWebSocket(wsUrl);
                //setTimeout(startWebSocket, reconnectInterval);
                //reconnectInterval = Math.min(reconnectInterval * 2, 30000); // Exponential backoff up to 30 seconds
            };

            ws.onmessage = function (event) {
                if (event.data === 'pong') {
                    console.log('Received pong from server');
                }
                fetchMessages(); // Re-fetch messages to update the list
            };

            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send('ping');
                }
            }, 30000);
            return ws;
        }
        startWebSocket(wsUrl); // Initialize WebSocket connection

        async function fetchMessages(initialLoad = false) {
            try {
                const response = await fetch(endpointShoutBoxComment);
                if (!response.ok) throw new Error('Network response was not ok');
                const messages = await response.json();
                messagesDiv.innerHTML = '';
                let allMessagesHTML = '';
                //const sortedMessages = messages.sort((a, b) => b.created_at - a.created_at);

                messages.forEach(message => {
                    const messageDiv = document.createElement('div');

                    const isUserMessage = message.username === usernameInput.value;
                    const pinButtonText = message.is_pinned ? 'Unpin' : 'Pin';

                    // Construct the HTML for this message
                    const messageHTML = `
                    <div class="message ${message.is_pinned ? 'pinned' : ''} ${isUserMessage ? 'user-message' : ''}">
                        <div class="message-content">
                            <strong class="message-username">${message.username}</strong>
                            <span class="message-comment">${message.comment}</span> <br>
                            <small class="message-date">${new Date(message.created_at).toLocaleString()}</small>
                            ${isAdmin || isUserMessage ? `
                                <button class="delete" data-id="${message.id}">Удалить</button>
                                ${isAdmin ? `<button class="pin" data-id="${message.id}">${pinButtonText}</button>` : ''}
                            ` : ''}
                        </div>
                    </div>
                    `;

                    // Add the HTML of this message to the accumulating string
                    allMessagesHTML += messageHTML;
                });
                messagesDiv.innerHTML = allMessagesHTML;
                if (initialLoad) {
                    scrollToBottom();
                }
                
                // Attach event listeners to delete and pin buttons
                document.querySelectorAll('.delete').forEach(button => {
                    button.addEventListener('click', async function () {
                        const id = this.getAttribute('data-id');
                        const email = usernameInput.value; // Capture the email of the current user
                
                        try {
                            const response = await fetch(`${endpointShoutBoxComment}/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'email': email, // Include email in headers
                                },
                                body: JSON.stringify({ email }) // Also include email in the body
                            });
                
                            if (!response.ok) {
                                const errorText = await response.text();
                                throw new Error(errorText);
                            }
                
                            fetchMessages();
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                        }
                    });
                });

                document.querySelectorAll('.pin').forEach(button => {
                    button.addEventListener('click', async function () {
                        const id = this.getAttribute('data-id');
                        const isPinned = this.textContent === 'Unpin';
                        console.log(isPinned, 'is pinned?');
                        try {
                            await fetch(`${endPointShoutBoxPin}/${id}`, {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json",
                                    "email": email  //Pass the email in headers
                                },
                                body: JSON.stringify({ unpin: isPinned })  // Send `unpin: true` if it's an unpin operation
                            });
                            fetchMessages();
                        } catch (error) {
                            console.error('Error pinning/unpinning message:', error);
                        }
                    });
                });
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        }
        shoutForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = usernameInput.value;
            const comment = document.getElementById('comment').value;
        
            try {
                const response = await fetch(endpointShoutBoxComment, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json',
                        "email": email
                    },
                    body: JSON.stringify({ comment, email })  // Include email here
                });
        
                if (response.ok) {
                    const newMessage = await response.json();
                    ws.send(JSON.stringify(newMessage));
                    fetchMessages(true);
                    //scrollToBottom();
                    //shoutForm.reset();
                    document.getElementById('comment').value = '';
                    submitButton.disabled = true;
                } else {
                    console.error('Failed to post message:', response.statusText);
                }
            } catch (error) {
                console.error('Error posting message:', error);
            }
        });
        fetchMessages(true);
        let ws = startWebSocket(wsUrl);
    }
    window.initializeShoutbox = initializeShoutbox;


    /////////////////////////////////////////////////

    async function initializeAdminShoutbox(config) {
        function loadCSS(url) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
        }
    
        const {
            wsUrl,
            endpointShoutBoxComment,
            customCSS,
            email
        } = config;
    
        const isAdmin = await checkIfAdmin(email);
    
        if (customCSS) {
            loadCSS(customCSS);
        } else {
            loadCSS('https://'); // Add your default CSS here
        }
    
        const shoutboxContainer = document.createElement('div');
        shoutboxContainer.id = 'shoutbox-container';
        document.body.appendChild(shoutboxContainer);
        
        async function getChatId(adminEmail, userEmail, comment) { //to solve chatid problem with generating new id each time!
            const response = await fetch('http://127.0.0.1:4000/adminbox/get-chat-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminEmail, userEmail, comment })
            });
        
            if (response.ok) {
                const data = await response.json();
                return data.chatId;  // Assuming the server returns an existing or new chatId
            } else {
                console.error('Failed to retrieve chatId');
                return null;
            }
        }

        // Conditional rendering based on whether the user is an admin or a regular user
        if (isAdmin) {
            shoutboxContainer.innerHTML = `
                <div class="shoutbox">
                    <div class="shoutbox-inner">
                        <div class="shoutbox-headline">
                        </div>
                        <div class="user-chats-list-container">
                            <h3>User Chats</h3>
                            <ul id="user-chats-list"></ul>
                        </div>
                        <div class="admin-chat-view" style="display: none;">
                            <button id="back-to-chats">Back to All Chats</button>
                            <div class="shoutbox-messages-container">
                                <div id="admin-comments" class="scrollable"></div>
                            </div>
                            <div class="shoutbox-container-form">
                                <form id="admin-shoutbox-form">
                                    <input type="text" id="admin-username" placeholder="Admin" required readonly>
                                    <textarea rows="5" cols="36" id="admin-comment" placeholder="Your message" required></textarea>
                                    <button type="submit" class="shoutbox-submit-btn" disabled="">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M7.89221 0.914114L7.24838 1.55794C7.096 1.71032 7.096 1.9574 7.24838 
                                            2.10981L12.2929 7.15433H1.19018C0.974678 7.15433 0.799957 7.32905 0.799957 
                                            7.54455V8.45506C0.799957 8.67055 0.974678 8.84527 1.19018 
                                            8.84527H12.2929L7.24838 13.8898C7.096 14.0422 7.096 14.2893 7.24838 
                                            14.4417L7.89221 15.0855C8.04459 15.2379 8.29167 15.2379 8.44408 
                                            15.0855L15.2538 8.27575C15.4062 8.12337 15.4062 7.8763 15.2538 
                                            7.72388L8.44405 0.914114C8.29167 0.761701 8.04459 0.761701 7.89221 
                                            0.914114Z" fill="white">
                                            </path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    
            const userChatsListContainer = document.querySelector('.user-chats-list-container');
            const userChatsList = document.getElementById('user-chats-list');
            const adminChatView = document.querySelector('.admin-chat-view');
            const backToChatsButton = document.getElementById('back-to-chats');
    
            const adminForm = document.getElementById('admin-shoutbox-form');
            const adminMessagesDiv = document.getElementById('admin-comments');
            const adminUsernameInput = document.getElementById('admin-username');
            const adminSubmitButton = document.querySelector('.shoutbox-submit-btn');
            const adminTextarea = document.getElementById('admin-comment');
    
            adminUsernameInput.value = email;
    
            let selectedUser = null;  // Track which user's chat is being viewed
            
            function showAdminChatView() {
                userChatsListContainer.style.display = 'none';
                adminChatView.style.display = 'block';
            }
            
            function hideAdminChatView() {
                userChatsListContainer.style.display = 'block';
                adminChatView.style.display = 'none';
            }

            adminTextarea.addEventListener('input', (e) => {
                adminSubmitButton.disabled = !e.target.value.trim();
            });
    
            adminTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!adminSubmitButton.disabled) {
                        adminForm.requestSubmit();
                    }
                }
            });
    
            let ws;
    
            async function fetchUserChats() {
                try {
                    const response = await fetch(endpointShoutBoxComment);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const messages = await response.json();
            
                    const userChats = {};
                    messages.forEach(message => {
                        // Group by chatId or username
                        const chatKey = message.username;
            
                        if (!userChats[chatKey]) {
                            userChats[chatKey] = [];
                        }
                        userChats[chatKey].push(message);
                    });
            
                    console.log(userChats, 'user chatsssssss!!!!!!!!!');
            
                    userChatsList.innerHTML = '';
                    for (const [username, messages] of Object.entries(userChats)) {
                        const listItem = document.createElement('li');
                        listItem.setAttribute('data-chatId', username);
                        
                        // Determine who made the latest comment: admin or user
                        const lastMessage = messages[messages.length - 1];
                        const lastMessageSender = lastMessage.is_admin ? lastMessage.admin_email : lastMessage.username;
                        
                        listItem.textContent = `${lastMessageSender}: ${lastMessage.comment.substring(0, 30)}`;
                        listItem.addEventListener('click', (e) => {
                            console.log(username, 'username value');
                            selectedUser = username;
                            loadChat(username, messages);
                        });
            
                        userChatsList.appendChild(listItem);
                    }
            
                    if (adminChatView.style.display === 'none') {
                        userChatsListContainer.style.display = 'block';
                    }
            
                } catch (error) {
                    console.error('Failed to fetch user chats:', error);
                }
            }     
            
            function loadChat(username, messages) {
                selectedUser = username;  // Set the selected user for messaging
                showAdminChatView();  // Display the admin chat view
                adminMessagesDiv.innerHTML = '';

                messages.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'message';
                    
                    // Check if the message was posted by an admin
                    const displayedUsername = message.is_admin ? message.admin_email : message.username;
                    messageDiv.innerHTML = `
                        <div class="message-content">
                            <strong class="message-username">${displayedUsername}</strong>
                            <span class="message-comment">${message.comment}</span> <br>
                            <small class="message-date">${new Date(message.created_at).toLocaleString()}</small>
                        </div>
                    `;
                    adminMessagesDiv.appendChild(messageDiv);

                    //appendMessage(message);
                });
            
                scrollToBottom();
            }
            
            
    
            backToChatsButton.addEventListener('click', () => {
                adminChatView.style.display = 'none';
                userChatsListContainer.style.display = 'block';
            });
    
            function startWebSocket(wsUrl) {
                ws = new WebSocket(wsUrl);
    
                ws.onopen = function () {
                    console.log('WebSocket connection opened');
                    fetchUserChats();
                };
    
                ws.onerror = function (error) {
                    console.log('WebSocket error:', error);
                };
    
                ws.onclose = function () {
                    console.log('WebSocket connection closed. Attempting to reconnect');
                    startWebSocket(wsUrl);
                };
    
                ws.onmessage = function (event) {
                    if (event.data === 'pong') {
                        console.log('Received pong from server');
                    }
                    fetchUserChats(); // Re-fetch user chats to update the list
                };
    
                setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send('ping');
                    }
                }, 30000);
            }
    
            startWebSocket(wsUrl);
            
            let chatId = null;  // This will store the chat ID for the current conversation
            

            
            
            adminForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const comment = adminTextarea.value;
                
                const username = selectedUser;  // Use the selected user's username
                console.log('admin email before submitting:', email, 'and username -> ', username);
                if (!username) {
                    console.error('No user selected for messaging.');
                    return;
                }

                const chatId = await getChatId(email, username, comment);
                console.log(chatId, 'chat id when admin submits?')
                if (!chatId) {
                    console.error('Failed to retrieve or create chat_id');
                    return;
                }
            
                try {
                    const response = await fetch(endpointShoutBoxComment, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "email": email  // Sending the admin's email as the sender
                        },
                        body: JSON.stringify({ comment, email: email, userEmail: selectedUser, chatId: chatId })  // Use the existing chatId
                    });
            
                    if (response.ok) {
                        const newMessage = await response.json();
                        ws.send(JSON.stringify(newMessage)); // Send message through WebSocket
            
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'message';
                        messageDiv.innerHTML = `
                            <div class="message-content">
                                <strong class="message-username">${email}</strong>
                                <span class="message-comment">${newMessage.comment}</span> <br>
                                <small class="message-date">${new Date(newMessage.created_at).toLocaleString()}</small>
                            </div>
                        `;
                        adminMessagesDiv.appendChild(messageDiv);
                        scrollToBottom();  // Scroll to the bottom of the chat view
            
                        adminTextarea.value = '';
                        adminSubmitButton.disabled = true;
                    } else {
                        console.error('Failed to post message:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error posting message:', error);
                }
            });
    
            function scrollToBottom() {
                adminMessagesDiv.scrollTop = adminMessagesDiv.scrollHeight                ;
            }
    
            fetchUserChats();
        } else {
            shoutboxContainer.innerHTML = `
                <div class="shoutbox">
                    <div class="shoutbox-inner">
                        <div class="shoutbox-headline">
                            <h2>User Shoutbox</h2>
                        </div>
                        <div class="shoutbox-messages-container">
                            <div id="user-comments" class="scrollable"></div>
                        </div>
                        <div class="shoutbox-container-form">
                            <form id="user-shoutbox-form">
                                <input type="text" id="user-username" placeholder="Your name" required readonly>
                                <textarea rows="5" cols="36" id="user-comment" placeholder="Your message" required></textarea>
                                <button type="submit" class="shoutbox-submit-btn" disabled="">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M7.89221 0.914114L7.24838 1.55794C7.096 1.71032 7.096 1.9574 7.24838 
                                        2.10981L12.2929 7.15433H1.19018C0.974678 7.15433 0.799957 7.32905 0.799957 
                                        7.54455V8.45506C0.799957 8.67055 0.974678 8.84527 1.19018 
                                        8.84527H12.2929L7.24838 13.8898C7.096 14.0422 7.096 14.2893 7.24838 
                                        14.4417L7.89221 15.0855C8.04459 15.2379 8.29167 15.2379 8.44408 
                                        15.0855L15.2538 8.27575C15.4062 8.12337 15.4062 7.8763 15.2538 
                                        7.72388L8.44405 0.914114C8.29167 0.761701 8.04459 0.761701 7.89221 
                                        0.914114Z" fill="white">
                                        </path>
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
    
            const userForm = document.getElementById('user-shoutbox-form');
            const userMessagesDiv = document.getElementById('user-comments');
            const userUsernameInput = document.getElementById('user-username');
            const userSubmitButton = document.querySelector('.shoutbox-submit-btn');
            const userTextarea = document.getElementById('user-comment');
    
            userUsernameInput.value = email;
    
            userTextarea.addEventListener('input', (e) => {
                userSubmitButton.disabled = !e.target.value.trim();
            });
    
            userTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!userSubmitButton.disabled) {
                        userForm.requestSubmit();
                    }
                }
            });
    
            let ws;
    
            function startWebSocket(wsUrl) {
                ws = new WebSocket(wsUrl);
    
                ws.onopen = function () {
                    console.log('WebSocket connection opened');
                    fetchUserMessages();
                };
    
                ws.onerror = function (error) {
                    console.log('WebSocket error:', error);
                };
    
                ws.onclose = function () {
                    console.log('WebSocket connection closed. Attempting to reconnect');
                    startWebSocket(wsUrl);
                };
    
                ws.onmessage = function (event) {
                    if (event.data === 'pong') {
                        console.log('Received pong from server');
                    } else {
                        const newMessage = JSON.parse(event.data);
                        if (newMessage.username === email) {  // Only display messages for the current user
                            appendMessage(newMessage);
                        }
                    }
                };
    
                setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send('ping');
                    }
                }, 30000);
            }
    
            function appendMessage(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                const sender = message.is_admin ? message.admin_email : message.username;
                const userUsernameInput = document.getElementById('user-username');
                console.log(message.username, 'message username????????????')
                const isUserMessage = message.username === userUsernameInput.value;
                //const isUserMessage = message.username === email;
                if (isUserMessage) {
                    messageDiv.classList.add('user-message');  // Add class for user's messages
                }
                
                messageDiv.innerHTML = `
                    <div class="message-content">
                        <strong class="message-username">${sender}</strong>
                        <span class="message-comment">${message.comment}</span> <br>
                        <small class="message-date">${new Date(message.created_at).toLocaleString()}</small>
                    </div>
                `;
                userMessagesDiv.appendChild(messageDiv);
                scrollToBottom();
            }
    
            async function fetchUserMessages() {
                try {
                    const response = await fetch(endpointShoutBoxComment);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const messages = await response.json();
    
                    userMessagesDiv.innerHTML = '';
                    messages.forEach(message => {
                        if (message.username === email) {  // Only display messages for the current user
                            appendMessage(message);
                        }
                    });
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            }
    
            userForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const comment = userTextarea.value;
                const username = email;
                console.log(username, 'username of the userform');
                // Prevent duplicate submissions
                userForm.querySelector('button[type="submit"]').disabled = true;
            
                let adminEmail = window.currentAdminEmail;  // Check if we already have the admin's email
            
                // If the admin is not set (new chat), fetch it
                if (!adminEmail) {
                    adminEmail = await fetchAdmins();
                    if (!adminEmail) {
                        console.error('No admin available to assign to the chat');
                        userForm.querySelector('button[type="submit"]').disabled = false;
                        return;  // Exit early if no admin is found
                    }
                    window.currentAdminEmail = adminEmail;  // Cache the admin email for future messages
                }
            
                const chatId = await getChatId(adminEmail, username, comment);
                
                try {
                    const response = await fetch(endpointShoutBoxComment, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "email": username
                        },
                        // body: JSON.stringify({ comment, email: email, userEmail: selectedUser, chatId: chatId })  // Use the existing chatId
                        body: JSON.stringify({ comment, email: username, userEmail: username, chatId })  // Pass the adminEmail
                    });
                    if (response.ok) {
                        const newMessage = await response.json();
                        ws.send(JSON.stringify(newMessage));
                        //appendMessage(newMessage);  // Append message only once
                        userTextarea.value = '';
                        userSubmitButton.disabled = true;
                    } else {
                        console.error('Failed to post message:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error posting message:', error);
                } finally {
                    userForm.querySelector('button[type="submit"]').disabled = false;
                }
            });
            
    
            function scrollToBottom() {
                userMessagesDiv.scrollTop = userMessagesDiv.scrollHeight;
            }
    
            startWebSocket(wsUrl);
            fetchUserMessages();
        }
    }
    
    window.initializeAdminShoutbox = initializeAdminShoutbox;
    
    //shouldnt chat_id be the same for one chat? right now its different for each different message in the same chat
})();