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
                    // messageDiv.classList.add('message');
                    // const user = document.createElement('strong');
                    // user.textContent = message.username;
                    // messageDiv.appendChild(user);
                    
                    // const text = document.createTextNode(`: ${message.comment}`);
                    // messageDiv.appendChild(text);
                    // const time = document.createElement('small');
                    // time.textContent = new Date(message.created_at).toLocaleString();
                    // messageDiv.appendChild(time);
        
                    // if (isAdmin || message.username === usernameInput.value) {
                    //     const deleteButton = document.createElement('button');
                    //     deleteButton.textContent = 'Delete';
                    //     deleteButton.classList.add('delete');
                    //     deleteButton.setAttribute('data-id', message.id);
                    //     messageDiv.appendChild(deleteButton);
        
                    //     if (isAdmin) {
                    //         const pinButton = document.createElement('button');
                    //         pinButton.textContent = message.is_pinned ? 'Unpin' : 'Pin';
                    //         pinButton.classList.add('pin');
                    //         pinButton.setAttribute('data-id', message.id);
                    //         messageDiv.appendChild(pinButton);
                    //     }
                    // }

                    // if (message.is_pinned) {
                    //     messageDiv.classList.add('pinned');
                    // }
                    // messagesDiv.appendChild(messageDiv);

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
})();

/////////////////////////////////////////////

// document.addEventListener('DOMContentLoaded', function () {
//     // const shoutForm = document.getElementById('shoutbox-form'); // Updated ID
//     // const messagesDiv = document.getElementById('comments'); // Updated ID
//     const isLocalhost = window.location.hostname === 'localhost';
//     const wsUrl = isLocalhost ? 'ws://127.0.0.1:4000' : `wss://${window.location.hostname}/ws`;


//     const shoutboxContainer = document.createElement('div');
//     shoutboxContainer.id = 'shoutbox-container';
//     document.body.appendChild(shoutboxContainer);

//     shoutboxContainer.innerHTML = `
//             <div id="shoutbox" class="shoutbox">
//             <header class="shout-header">
//                 <div class="shout-header-title">
//                 <svg width="30" height="30" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
//                     <g fill="none" fill-rule="evenodd"><path fill="#61ad3b" 
//                     d="M12 6a6 6 0 0 1-6 6 6 6 0 0 1-6-6 6 6 0 0 1 12 0"/>
//                     <path fill="#FFF" 
//                     d="M6.105 8.747a4.3 4.3 0 0 0 .782-.128 2.14 2.14 0 0 0 .976.064l.039-.003c.116 0 .269.068.491.21v-.234a.23.23 0 0 1 .117-.199q.146-.083.269-.187c.324-.274.507-.64.507-1.028q-.001-.196-.06-.377.147-.274.235-.574a1.73 1.73 0 0 1 .289.95c0 .527-.245 1.018-.669 1.377a2 2 0 0 1-.223.166v.548a.233.233 0 0 1-.371.185 6 6 0 0 0-.45-.304 1 1 0 0 0-.138-.07q-.192.029-.39.029a2.5 2.5 0 0 1-1.404-.425m-2.8-1.096c-.669-.567-1.055-1.34-1.055-2.169 0-1.692 1.597-3.045 3.546-3.045S9.343 3.79 9.343 5.482c0 1.693-1.597 3.045-3.547 3.045q-.329 0-.648-.051c-.092.022-.459.24-.988.626a.291.291 0 0 1-.464-.231v-.934a3.4 3.4 0 0 1-.392-.287m1.856.25q.024 0 .049.004.288.049.587.049c1.647 0 2.965-1.117 2.965-2.471s-1.318-2.47-2.965-2.47-2.965 1.117-2.965 2.47c0 .655.308 1.271.852 1.732q.206.174.449.312c.09.051.146.146.146.249v.539c.419-.281.694-.414.883-.414m-.876-1.844a.46.46 0 0 1-.465-.46c0-.254.208-.46.465-.46s.465.206.465.46-.208.46-.465.46m1.512 0a.46.46 0 0 1-.465-.46c0-.254.208-.46.465-.46s.465.206.465.46-.208.46-.465.46m1.512 0a.46.46 0 0 1-.465-.46c0-.254.208-.46.465-.46s.465.206.465.46-.208.46-.465.46"/>
//                     </g>
//                 </svg>
//                 Кри-Чат
//                 </div>  
//             </header>
//             <div id="comments" class="scrollable"></div>
//             <form id="shoutbox-form">
//                 <input type="text" id="username" placeholder="Username">
//                 <textarea id="comment" placeholder="Your comment" required></textarea>
//                 <input type="checkbox" id="isAdmin"> Admin
//                 <button type="submit">Post</button>
//             </form>

//         </div>
//     `;

//     const shoutForm = document.getElementById('shoutbox-form');
//     const messagesDiv = document.getElementById('comments');


//  function initializeWebSocket(wsUrl) {
//         let ws = new WebSocket(wsUrl);

//         ws.onopen = function() {
//             console.log('WebSocket connection opened');
//         };

//         ws.onerror = function(error) {
//             console.log('WebSocket error:', error);
//         };

//         ws.onclose = function() {
//             console.log('WebSocket connection closed');
//             setTimeout(() => initializeWebSocket(wsUrl), 5000);
//         };

//         ws.onmessage = function(event) {
//             fetchMessages();
//         };

//         return ws;
//     }

    

//     console.log('shoutForm:', shoutForm); // Log to check if shoutForm is found
//     console.log('messagesDiv:', messagesDiv); // Log to check if messagesDiv is found

//     // Fetch and display messages
//     async function fetchMessages() {
//         try {
//             const response = await fetch('http://127.0.0.1:4000/shoutbox/comments');
//             if (!response.ok) throw new Error('Network response was not ok');
//             const messages = await response.json();
//             messagesDiv.innerHTML = '';
//             messages.forEach(message => {
//                 const messageDiv = document.createElement('div');
//                 messageDiv.classList.add('message');
//                 messageDiv.textContent = `${message.username}: ${message.comment} (${new Date(message.created_at).toLocaleString()})`;
//                 //messageDiv.innerHTML = `<strong>${message.username}</strong>: ${message.comment} <br> <small>${new Date(message.created_at).toLocaleString()}</small>`;
//                 if (message.is_admin) {
//                     const deleteButton = document.createElement('button');
//                     deleteButton.textContent = 'Delete';
//                     deleteButton.classList.add('delete');
//                     deleteButton.setAttribute('data-id', message.id);
//                     messageDiv.appendChild(deleteButton);

//                     const pinButton = document.createElement('button');
//                     pinButton.textContent = 'Pin';
//                     pinButton.classList.add('pin');
//                     pinButton.setAttribute('data-id', message.id);
//                     messageDiv.appendChild(pinButton);
//                 }
//                 if (message.is_pinned) {
//                     messageDiv.classList.add('pinned');
//                 }
//                 messagesDiv.appendChild(messageDiv);
//             });

//             document.querySelectorAll('.delete').forEach(button => {
//                 button.addEventListener('click', async function () {
//                     const id = this.getAttribute('data-id');
//                     await fetch(`http://127.0.0.1:4000/shoutbox/comments/${id}`, {
//                         method: 'DELETE'
//                     });
//                     fetchMessages();
//                 });
//             });


//             document.querySelectorAll('.pin').forEach(button => {
//                 button.addEventListener('click', async function () {
//                     const id = this.getAttribute('data-id');
//                     await fetch(`http://127.0.0.1:4000/shoutbox/pin/${id}`, {
//                         method: 'POST'
//                     });
//                     fetchMessages();
//                 });
//             });


//         } catch (error) {
//             console.error('Failed to fetch messages:', error);
//         }
//     }

//     // ws.onmessage = function (event) {
//     //     const message = JSON.parse(event.data);
//     //     const messageDiv = document.createElement('div');
//     //     messageDiv.classList.add('message');
//     //     messageDiv.innerHTML = `<strong>${message.username}</strong>: ${message.comment} <br> <small>${new Date(message.created_at).toLocaleString()}</small>`;
//     //     messagesDiv.insertBefore(messageDiv, messagesDiv.firstChild);
//     // };
//     // ws.onmessage = function (event) {
//     //     const message = JSON.parse(event.data);
//     //     fetchMessages(); // Re-fetch messages to update the list
//     // };

//     // Post a new message
//     shoutForm.addEventListener('submit', async function (e) {
//         e.preventDefault();
//         const username = document.getElementById('username').value;
//         const comment = document.getElementById('comment').value;
//         const isAdmin = document.getElementById('isAdmin').checked;
//         try {
//             const response = await fetch('http://127.0.0.1:4000/shoutbox/comments', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ username, comment, isAdmin })
//             });

//             if (response.ok) {
//                 fetchMessages();
//                 shoutForm.reset();
//             } else {
//                 console.error('Failed to post message:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error posting message:', error);
//         }
//     });
//     let ws = initializeWebSocket(wsUrl);
//     fetchMessages();
// });
