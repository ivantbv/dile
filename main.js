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
        
        async function getChatId(adminEmail, userEmail) {
            const response = await fetch('http://127.0.0.1:4000/adminbox/get-chat-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminEmail, userEmail })
            });
        
            if (response.ok) {
                const data = await response.json();
                console.log(data, 'data from getchat id from fetch user?')
                return data.chatId;  // Assuming the server returns an existing or new chatId
            } else {
                console.error('Failed to retrieve chatId');
                return null;
            }
        }

        let archivedChatsOffset = 0;
        const archivedChatsLimit = 10;
        
        async function getArchivedChats(limit = archivedChatsLimit, offset = archivedChatsOffset) {
          try {
            const response = await fetch(`http://127.0.0.1:4000/adminbox/get-archived-chats?limit=${limit}&offset=${offset}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const messages = await response.json();
            console.log(messages, 'messages from get archived chats');
        
            // const groupedChats = {};
            // messages.forEach(message => {
            //   const chatKey = message.chat_id;
            //   if (!groupedChats[chatKey]) {
            //     groupedChats[chatKey] = [];
            //   }
            //   groupedChats[chatKey].push(message);
            // });
        
            // console.log(groupedChats, 'grouped chats from get archived chats');
            return messages;
        
          } catch (error) {
            console.error('Failed to retrieve archived chats', error);
            return {};
          }
        }
        
        async function fetchArchivedChatById(chatId) {
            try {
              const response = await fetch(`http://127.0.0.1:4000/adminbox/get-archived-chat?chatId=${chatId}`);
              if (response.ok) {
                return await response.json();
              }
              throw new Error('Failed to fetch archived chat');
            } catch (error) {
              console.error('Error fetching archived chat:', error);
              return null;
            }
          }          
        
        let selectedChatId = null; //Track current chatid
        // Conditional rendering based on whether the user is an admin or a regular user
        if (isAdmin) {
            shoutboxContainer.innerHTML = `
                <div class="shoutbox">
                    <div class="shoutbox-inner">
                        <div class="shoutbox-headline"></div>
                        <div class="all-chats-container">
                            <dile-tabs id="chats-tabs-navigation" selectorId="selector1" attrforselected="name" selected="userChats">
                                <dile-tab class="tab" name="userChats">Активные Чаты</dile-tab>
                                <dile-tab class="tab" name="archivedChats">Архивированные чаты</dile-tab>
                            </dile-tabs>
                            <dile-pages selectorId="selector1" attrforselected="name">
                                <section name="userChats">
                                    <div class="user-chats-list-container">
                                        <ul id="user-chats-list"></ul>
                                    </div>
                                </section>
                                <section name="archivedChats">
                                    <div class="archived-chats-list-container">
                                        <h3>Архив</h3>
                                        <ul id="archived-chats-list"></ul>
                                    </div>
                                </section>
                            </dile-pages>
                        </div>
                        
                        <div class="admin-chat-view" style="display: none;">
                            <button id="back-to-chats">Назад</button>
                            <div class="shoutbox-messages-container">
                                <button class="archive-chat-btn">Архивировать Чат</button>
                                <div id="comments" class="scrollable"></div>
                            </div>
                            <div class="shoutbox-container-form">
                                <form id="shoutbox-form">
                                    <input type="text" id="username" placeholder="Оператор" required readonly>
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
                </div>
            `;
    
            const userChatsListContainer = document.querySelector('.user-chats-list-container');
            const userChatsList = document.getElementById('user-chats-list');
            const adminChatView = document.querySelector('.admin-chat-view');
            const backToChatsButton = document.getElementById('back-to-chats');
            const archiveChatButton = document.querySelector('.archive-chat-btn');
            const archivedChatsListContainer = document.querySelector('.archived-chats-list-container');
            const archivedChatsList = document.getElementById('archived-chats-list');
            const chatsTabsNavigation = document.querySelector('.shoutbox #chats-tabs-navigation');

            const adminForm = document.getElementById('shoutbox-form');
            const adminMessagesDiv = document.getElementById('comments');
            const adminUsernameInput = document.getElementById('username');
            const adminSubmitButton = document.querySelector('.shoutbox-submit-btn');
            const adminTextarea = document.getElementById('comment');
    
            adminUsernameInput.value = email;
    
            let selectedUser = null;  // Track which user's chat is being viewed
            
            function showAdminChatView() {
                userChatsListContainer.style.display = 'none';
                adminChatView.style.display = 'block';
                chatsTabsNavigation.style.display = 'none'

                archivedChatsListContainer.style.display = 'none';
            }
            
            function hideAdminChatView() {
                userChatsListContainer.style.display = 'block';
                adminChatView.style.display = 'none';
            }

            function appendMessage(message) {
                // const messageDiv = document.createElement('div');
                // messageDiv.classList.add('message');
            
                // const messageContent = `
                //     <p><strong>${message.username || message.admin_email}</strong>: ${message.comment}</p>
                //     <span>${new Date(message.created_at).toLocaleTimeString()}</span>
                // `;
                // messageDiv.innerHTML = messageContent;
                // // Append the new message to the chat window
                // adminMessagesDiv.appendChild(messageDiv);
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                const sender = message.is_admin ? message.admin_email : message.username;
                messageDiv.innerHTML = `
                    <div class="message-content"> 
                        <strong class="message-username">${sender}</strong>
                        <span class="message-comment">${message.comment}</span> <br>
                        <small class="message-date">${new Date(message.created_at).toLocaleString()}</small>
                    </div>
                `;
                if (message.is_admin) {
                    messageDiv.classList.add('user-message');
                }
                adminMessagesDiv.appendChild(messageDiv);
                scrollToBottom(); // Scroll to the bottom after appending
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

            // let adminEmail = await fetchAdmins();
    
            let ws;
    
            async function fetchUserChats() {
                try {
                    const queryString = `?isAdmin=${encodeURIComponent(true)}`;
                    const response = await fetch(endpointShoutBoxComment + queryString);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const messages = await response.json();
                    //const archivedChats = await getArchivedChats();
                    //console.log(archivedChats, 'archived chats after await;')
                    //const archivedChatIds = archivedChats ? archivedChats.map(chat => chat.chat_id) : [];

                    const userChats = {};
                    messages.forEach(message => {
                        // Group by chatId or username
                        const chatKey = message.chat_id;
            
                        if (!userChats[chatKey]) {
                            userChats[chatKey] = [];
                        }
                        userChats[chatKey].push(message);
                    });
            
                      // Sort chats by the latest message timestamp in descending order
                    const sortedChats = Object.entries(userChats).sort((a, b) => {
                        const lastMessageA = a[1][a[1].length - 1];
                        const lastMessageB = b[1][b[1].length - 1];
                        return new Date(lastMessageB.created_at) - new Date(lastMessageA.created_at);
                    });
                    userChatsList.innerHTML = '';
                    //archivedChatsList.innerHTML = '';
                    sortedChats.forEach(([chatId, messages], idx) => {
                        const listItem = document.createElement('li');
                        listItem.setAttribute('data-chatId', chatId);
                        
                        const lastMessage = messages[messages.length - 1];
                        const lastMessageSender = lastMessage.is_admin ? lastMessage.admin_email : lastMessage.username;
                        
                        const selectedUserEmail = lastMessage.is_admin ? lastMessage.admin_email : lastMessage.username;
            
                        listItem.textContent = `${lastMessageSender}: ${lastMessage.comment.substring(0, 30)}`;
                        listItem.addEventListener('click', async (e) => {
                            //selectedUser = selectedUserEmail;
                            selectedChatId = chatId; //await getChatId(email, username);
                            console.log(selectedChatId, ' selected chat iddddddddddddd')
                            loadChat(selectedChatId);
                        });
                        // Append the item to the appropriate list (archived or active)
                        //if (archivedChatIds.includes(chatId)) {
                          //  archivedChatsList.appendChild(listItem);
                        //} else {
                        userChatsList.appendChild(listItem);
                        //}
                    });
            
            
                    if (adminChatView.style.display === 'none') {
                        userChatsListContainer.style.display = 'block';
                        archivedChatsListContainer.style.display = 'block';
                    }
            
                } catch (error) {
                    console.error('Failed to fetch user chats:', error);
                }
            }     
            
            async function loadChat(selectedChatId, isArchived = false) {
                //selectedUser = selectedChatId; // Set the selected user for messaging
                showAdminChatView(); // Display the admin chat view
                adminMessagesDiv.innerHTML = ''; // Clear previous messages
                console.log(isArchived, 'is archived from loadchat')
                try {
                    // Fetch the latest messages for this chat from the server
                    const response = await fetch(`${endpointShoutBoxComment}?chatId=${encodeURIComponent(selectedChatId)}&isArchived=${encodeURIComponent(isArchived)}`);
                    if (!response.ok) throw new Error('Failed to fetch messages');
                    const messages = await response.json();
                    
                    // Display the messages
                    messages.forEach(message => {
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'message';
            
                        const displayedUsername = message.is_admin ? message.admin_email : message.username;
                        messageDiv.innerHTML = `
                            <div class="message-content">
                                <strong class="message-username">${displayedUsername}</strong>
                                <span class="message-comment">${message.comment}</span> <br>
                                <small class="message-date">${new Date(message.created_at).toLocaleString()}</small>
                            </div>
                        `;
                        if (message.is_admin) {
                            messageDiv.classList.add('user-message');
                        }
                        adminMessagesDiv.appendChild(messageDiv);
                    });
            
                    scrollToBottom();
                } catch (error) {
                    console.error('Failed to load chat:', error);
                }
            }


            /////////////////////
            
            // function setupArchivedChatsScrolling() {
            //     archivedChatsListContainer.addEventListener('scroll', async function () {
            //         const { scrollTop, scrollHeight, clientHeight } = archivedChatsListContainer;
            //         if (scrollTop + clientHeight >= scrollHeight - 5) {
            //             archivedChatsOffset += archivedChatsLimit; // Increment the offset
            //             const newArchivedChats = await getArchivedChats();
            //             if (newArchivedChats && newArchivedChats.length > 0) {
            //                 appendArchivedChats(newArchivedChats); // Append the new chats
            //             }
            //         }
            //     });
            // }
            function setupArchivedChatsScrolling() {
                archivedChatsListContainer.addEventListener('scroll', async () => {
                  if (archivedChatsListContainer.scrollTop + archivedChatsListContainer.clientHeight >= archivedChatsListContainer.scrollHeight) {
                    // Increment the offset by the limit
                    archivedChatsOffset += archivedChatsLimit;
                    const newArchivedChats = await getArchivedChats(archivedChatsLimit, archivedChatsOffset);
                    appendArchivedChats(newArchivedChats);
                  }
                });
              }
              
              async function appendArchivedChats(chats) {
                const userChats = {};
                chats.forEach(message => {
                    // Group by chatId or username
                    const chatKey = message.chat_id;
        
                    if (!userChats[chatKey]) {
                        userChats[chatKey] = [];
                    }
                    userChats[chatKey].push(message);
                });

                const sortedChats = Object.entries(userChats).sort((a, b) => {
                  const lastMessageA = a[1][a[1].length - 1];
                  const lastMessageB = b[1][b[1].length - 1];
                  return new Date(lastMessageB.created_at) - new Date(lastMessageA.created_at);
                });
              
                console.log(sortedChats, 'ALL THE SORTED CHATS FROM APPEND ARCHIVED CHATS?');
                sortedChats.forEach(([chatId, messages]) => {
                  // Avoid duplicates in the list
                  if (!document.querySelector(`[data-chatId="${chatId}"]`)) {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-chatId', chatId);
                   
              
                    // Show the last message of this chat
                    const lastMessage = messages[messages.length - 1]; //messages[0];
                    const lastMessageSender = lastMessage.is_admin ? lastMessage.admin_email : lastMessage.username;
                    listItem.textContent = `${lastMessageSender}: ${lastMessage.comment.substring(0, 30)}`;
              
                    // Add click event to load all messages in the chat
                    listItem.addEventListener('click', async () => {
                      selectedChatId = chatId;
                      console.log(selectedChatId, 'selected chat id when clicked')
                      loadChat(selectedChatId, true); // Load full chat when clicked
                    });
              
                    // Append to archived chats list without clearing it
                    archivedChatsList.appendChild(listItem);
                  }
                });
              }
            
            
            function disableChat() {
                adminTextarea.disabled = true;
                adminSubmitButton.disabled = true;
             }
    
            backToChatsButton.addEventListener('click', () => {
                adminChatView.style.display = 'none';
                userChatsListContainer.style.display = 'block';
                archivedChatsListContainer.style.display = 'block';
                chatsTabsNavigation.style.display = 'block';
            });

            archiveChatButton.addEventListener('click', async () => {
                try {
                    const response = await fetch('http://127.0.0.1:4000/adminbox/archive-chat', {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json'
                        },
                        body: JSON.stringify({chatId: selectedChatId})
                    });
                    if (response.ok) {
                        alert('Chat archived');
                        //disableChat();
                    } else {
                        console.error('Failed to archive chat: ', response.statusText);
                    }
                } catch (error) {
                    console.error('Error archiving chat: ', error);
                }
            })
    
            function startWebSocket(wsUrl, email) {
                //ws = new WebSocket(wsUrl);
                const wsUrlWithParams = `${wsUrl}?email=${encodeURIComponent(email)}`;
                ws = new WebSocket(wsUrlWithParams);
                
                ws.onopen = function () {
                    console.log('WebSocket connection opened');
                    fetchUserChats(); // Initial fetch when the WebSocket connection opens
                                // Initialize the first 10 archived chats on load
                    getArchivedChats().then(chats => {
                        appendArchivedChats(chats);
                        setupArchivedChatsScrolling();
                    });
                };
            
                ws.onerror = function (error) {
                    console.log('WebSocket error:', error);
                };
            
                ws.onclose = function () {
                    console.log('WebSocket connection closed. Attempting to reconnect');
                    startWebSocket(wsUrl, email); // Reconnect logic if the connection closes
                };
            
                ws.onmessage = function (event) {
                    const messageData = JSON.parse(event.data);
            
                    if (messageData.type === 'new_message') {
                        console.log(messageData, 'message data when admin received')
                        const username = messageData.data.username;
                        if (!username) {
                            console.error('Received message with no username:', messageData.username);
                            return; // Skip further processing if there's no valid chatId
                        }
                        
                        const lastMessageText = 
                            `${messageData.data.is_admin ? messageData.data.admin_email : messageData.data.username}: ${messageData.data.comment.substring(0, 30)}`;
                        
                        // Check if chat already exists in the userChatsList
                        let existingChatItem = document.querySelector(`li[data-chatId="${messageData.data.chat_id}"]`);
                        if (existingChatItem) {
                            // Update the last message and move the chat to the top
                            existingChatItem.textContent = lastMessageText;
                            userChatsList.removeChild(existingChatItem);  // Remove from current position
                            userChatsList.insertBefore(existingChatItem, userChatsList.firstChild);  // Move to top
                        } else {
                            // If the chat does not exist, create a new chat list item and add it to the top
                            const newListItem = document.createElement('li');
                            newListItem.setAttribute('data-chatId', messageData.data.chat_id);
                            newListItem.textContent = lastMessageText;
                
                            // Add event listener to load chat when clicked
                            newListItem.addEventListener('click', async () => {
                                selectedUser = username;
                                selectedChatId = messageData.data.chat_id //await getChatId(email, username);

                                console.log('Message received:', messageData, selectedUser, ' selected user',
                                selectedChatId);

                                const message = JSON.stringify({
                                    type: 'chat_selected',
                                    chat_id: selectedChatId,
                                    username: selectedUser
                                });
                                ws.send(message); 
                                
                                loadChat(selectedChatId); // Load chat when clicked
                            });
                
                            // Insert the new chat at the top of the list
                            userChatsList.insertBefore(newListItem, userChatsList.firstChild);
                        }
                        console.log('Selected Chat ID (current):', selectedChatId, 'and message data chat_id: ',
                        messageData.data.chat_id);
                        // If the message belongs to the currently selected chat, append it to the chat view
                        if (messageData.data.chat_id === selectedChatId) {
                            appendMessage(messageData.data);
                            scrollToBottom();  // Scroll to the bottom of the chat
                        }
                    }
            
                    if (messageData.type === 'chat_archived') {
                        console.log('Chat archived:', messageData.data);
                        // Handle archived chat updates (e.g., remove chat from active list)
                        fetchUserChats(); // Optionally, re-fetch chats to update the UI

                        const chatId = messageData.data;

                                    // Initialize the first 10 archived chats on load
                        // setTimeout(() => {
                        //     getArchivedChats().then(chats => {
                        //         console.log(chats, 'chats when chat_archived !!!');
                        //         appendArchivedChats(chats);
                        //         setupArchivedChatsScrolling();
                        //     });
                        // }, 500); 

                        //when I archive a chat, then start scrolling in the archived chats tab I can find
                        //that archived chat. But if I archive again a chat, it wont' be in the archived chats
                        //tab. I think this might be happening because of the pagination and that it only
                        //fetches 10 chats, but if my scroll if further (or at the bottom, i.e. the last archived chat)
                        //then this chat wont be fetched in the websocket call of getarchivedchats
                         // Call a function to fetch the entire chat by its ID

                        fetchArchivedChatById(chatId).then(archivedChat => {
                            if (archivedChat) {
                            const lastMessage = archivedChat.messages[archivedChat.messages.length - 1];
                            console.log(lastMessage, 'last message from fetcharchivedchat by id when chat is archiged')
                            const lastMessageText = 
                            `${lastMessage.is_admin ? lastMessage.admin_email : lastMessage.username}: ${lastMessage.comment.substring(0, 30)}`;
                        
                            // Create new list item for archived chat
                            const newListItem = document.createElement('li');
                            newListItem.setAttribute('data-chatId', chatId);
                            newListItem.textContent = lastMessageText;
                            
                            // Add event listener to load the archived chat when clicked
                            newListItem.addEventListener('click', async () => {
                                selectedChatId = chatId;
                                loadChat(selectedChatId, true);  // Load the archived chat
                            });
                            
                            // Append to the archived chats list
                            archivedChatsList.insertBefore(newListItem, archivedChatsList.firstChild);
                            }
                        }).catch(error => {
                            console.error('Error fetching archived chat:', error);
                        });
                        
                    }
                };
                // Optionally remove the 30-second interval
                // setInterval(() => {
                //     if (ws.readyState === WebSocket.OPEN) {
                //         ws.send('ping');
                //     }
                // }, 30000); // Only for keeping the WebSocket connection alive if necessary
            }
            
    
            startWebSocket(wsUrl, email);
            
            //let chatId = null;  // This will store the chat ID for the current conversation
            async function getChatUsername(chatId) {
                const response = await fetch('http://127.0.0.1:4000/adminbox/get-user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    chatId
                },
            });
        
            if (response.ok) {
                const data = await response.json();
                return data.username;  // Assuming the server returns an existing or new chatId
            } else {
                console.error('Failed to retrieve username');
                return null;
            }
            }
            
            
            adminForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const comment = adminTextarea.value;
                
                //const username = selectedUser;  // Use the selected user's username
              
                // if (!username) {
                //     console.error('No user selected for messaging.');
                //     return;
                // }

                if (!selectedChatId) {
                    console.error('No chatid selected for messaging.');
                    return;
                }

                const queryString = `?chatId=${encodeURIComponent(selectedChatId)}`;
                const response = await fetch('http://127.0.0.1:4000/adminbox/get-user' + queryString);
                if (!response.ok) throw new Error('Network response was not ok');
                selectedUser = await response.json();
                console.log('admin email before submitting:', email, 'and selected user -> ', 
                selectedUser, 'and selected chat it: ', selectedChatId);
                
                // const chatId = await getChatId(email, username);
                // console.log(chatId, 'chat id when admin submits?')
                // if (!chatId) {
                //     console.error('Failed to retrieve or create chat_id');
                //     return;
                // }
                //selectedUser = await getChatUsername(selectedChatId)
            
                try {
                    const response = await fetch(endpointShoutBoxComment, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "email": email  // Sending the admin's email as the sender
                        },
                        body: JSON.stringify({ comment, email: email, userEmail: selectedUser, chatId: selectedChatId })  // Use the existing chatId
                    });
            
                    if (response.ok) {
                        const newMessage = await response.json();
                        ws.send(JSON.stringify(newMessage)); // Send message through WebSocket
            
                        // const messageDiv = document.createElement('div');
                        // messageDiv.className = 'message';
                        // messageDiv.innerHTML = `
                        //     <div class="message-content">
                        //         <strong class="message-username">${email}</strong>
                        //         <span class="message-comment">${newMessage.comment}</span> <br>
                        //         <small class="message-date">${new Date(newMessage.created_at).toLocaleString()}</small>
                        //     </div>
                        // `;
                        // adminMessagesDiv.appendChild(messageDiv);
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
                adminMessagesDiv.scrollTop = adminMessagesDiv.scrollHeight;
            }
    
            fetchUserChats();
                        // Initialize the first 10 archived chats on load
            getArchivedChats().then(chats => {
                appendArchivedChats(chats);
                setupArchivedChatsScrolling();
            });

        } else {
            shoutboxContainer.innerHTML = `
                <div class="shoutbox">
                    <div class="shoutbox-inner">
                        <div class="shoutbox-headline">
                            <h2></h2>
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
            `;
    
            const userForm = document.getElementById('shoutbox-form');
            const userMessagesDiv = document.getElementById('comments');
            const userUsernameInput = document.getElementById('username');
            const userSubmitButton = document.querySelector('.shoutbox-submit-btn');
            const userTextarea = document.getElementById('comment');
    
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
            function startWebSocket(wsUrl, email) {
                const wsUrlWithParams = `${wsUrl}?email=${encodeURIComponent(email)}`;
                ws = new WebSocket(wsUrlWithParams);
            
                ws.onopen = function () {
                    console.log('WebSocket connection opened, chatid: ', selectedChatId);

                    fetchUserMessages(); // Initial fetch when the WebSocket connection opens
                };
            
                ws.onerror = function (error) {
                    console.log('WebSocket error:', error);
                };
            
                ws.onclose = function () {
                    console.log('WebSocket connection closed. Attempting to reconnect');
                    startWebSocket(wsUrl, email); // Reconnect logic if the connection closes
                };
            
                ws.onmessage = function (event) {
                    const messageData = JSON.parse(event.data);
                    
                    if (messageData.type === 'first_time_user' && !selectedChatId) {
                        selectedChatId = messageData.chatId
                        fetchUserMessages();
                        console.log('first time user, got assigned with id: ', selectedChatId, messageData.chatId);
                    }

                    if (messageData.type === 'new_chat_id') {
                        // New chat ID received after chat was archived
                        const newChatId = messageData.newChatId;
                        console.log('New chat ID received:', newChatId);
                       

                        setTimeout(function() {
                            console.log('Reconnecting WebSocket with new chat ID:', newChatId);
                            selectedChatId = newChatId;

                            // Clear the chat UI after receiving the new chat ID
                            //clearChat(); 
                            fetchUserMessages();

                            // Reconnect WebSocket with the new chat ID
                            //startWebSocket(wsUrl, email);
                        }, 1000);  // 1 second delay to ensure the WebSocket is properly closed

                        // selectedChatId = messageData.newChatId;
                        // console.log('New chat ID received:', selectedChatId);
                        // ws.close();
                        // ws.onclose = function () {
                        //     console.log('WebSocket connection closed. Attempting to reconnect');
                        //     startWebSocket(wsUrl, email); // Reconnect logic if the connection closes
                        // };

                        //clearChat();  // Clear the chat UI
                        //fetchUserMessages();  // Fetch new messages for the newly assigned chat ID
                      }

                    if (messageData.type === 'chat_selected') {
                        console.log('Admin selected chat:', messageData.chat_id);
                
                        // Automatically assign the selected chat ID on the user side
                        selectedChatId = messageData.chat_id;
                        loadChat(messageData.username);  // Optionally load the chat for the user
                    }

                    if (messageData.type === 'new_message') {
                        if (!selectedChatId) {
                            selectedChatId = messageData.data.chat_id;
                            console.log('Automatically setting selectedChatId:', selectedChatId);
                        }

                        console.log('New message received userside:', messageData.data, 'AND SELECTED CHAT ID: ',
                        selectedChatId);
                        if (messageData.data.chat_id === selectedChatId) {
                            console.log('Appending message to correct chat:', messageData.data);
                            appendMessage(messageData.data);
                            scrollToBottom();
                        } else {
                            console.log('Message does not belong to this chat, ignoring.');
                        }
                        // fetchUserMessages(); 
                    }
            
                    if (messageData.type === 'chat_archived') {
                        console.log('Chat archived (its id):', messageData, 
                        'and the selected chat id before reassigning its value: ',
                        selectedChatId);

                        //selectedChatId = messageData.data;
                        // Handle archived chat updates (e.g., remove chat from active list)
                        fetchUserMessages(); // Optionally, re-fetch chats to update the UI
                        console.log('New chat ID assigned after chat archivation: ', selectedChatId);
                    }
                };
            }
    
            function appendMessage(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                const sender = message.is_admin ? message.admin_email : message.username;
                const userUsernameInput = document.getElementById('username');
                console.log(message.username, 'message username????????????')
                const isUserMessage = message.username === userUsernameInput.value;
                //const isUserMessage = message.username === email;
                // if (isUserMessage) {
                //     messageDiv.classList.add('user-message');  // Add class for user's messages
                // }
                if (!message.admin_email) {
                    messageDiv.classList.add('user-message');
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
                if (!selectedChatId) {
                    console.error('No chatId available for fetching messages');
                    return;
                }
                //let adminEmail = window.currentAdminEmail
                // if (!adminEmail) {
                //     adminEmail = await fetchAdmins();
                //     window.currentAdminEmail = adminEmail;
                // }
                //selectedChatId = await getChatId(adminEmail,email);
                try {
                    console.log(email, selectedChatId, 'EMAIL AND SELECTED CHAT ID IN FETCH USER MESSAGES')
                    const response = await fetch(`${endpointShoutBoxComment}?userEmail=${
                        encodeURIComponent(email)
                    }&chatId=${
                        encodeURIComponent(selectedChatId)
                    }`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const messages = await response.json();
                    console.log(messages, 'messages from fetchuser MESSAGES')
                    userMessagesDiv.innerHTML = '';
                    messages.forEach(message => {
                        //if (message.username === email || message.is_admin) {
                            appendMessage(message);
                       // }
                        
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
                let chatId = null;
                //const chatId = await getChatId(adminEmail, username);
                console.log('selected chat id for usr in submit: ', selectedChatId)
                if (selectedChatId) {
                    console.log('selected chat id is present in user submit form')
                    chatId = selectedChatId
                } else { 
                    chatId = await getChatId(adminEmail, username);
                    console.log('selected chat id is not present in the submit user form!!!111, new chat id?',
                    chatId)
                }
                
                try {
                    const response = await fetch(endpointShoutBoxComment, {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json',
                            "email": username
                        },
                        // body: JSON.stringify({ comment, email: email, userEmail: selectedUser, chatId: chatId })  // Use the existing chatId
                        body: JSON.stringify({ comment, email: username, userEmail: username, chatId: selectedChatId })  // Pass the adminEmail
                    });
                    if (response.ok) {
                        const newMessage = await response.json();
                        // ws.send(JSON.stringify(newMessage));

                        ws.send(JSON.stringify({
                            type: 'new_message',  // Add a type to specify what kind of action this is
                            data: newMessage      // Actual message data
                          }));

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
    
            startWebSocket(wsUrl, email);
            console.log('selected chat id from initial ', selectedChatId);
            //fetchUserMessages();
        }
    }
    
    window.initializeAdminShoutbox = initializeAdminShoutbox;
    
    //shouldnt chat_id be the same for one chat? right now its different for each different message in the same chat
})();