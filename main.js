import './helpers.js';
import './index.js';
import './index2.js';
import './shoutbox.js';

// const shoutContainer = document.createElement('div');
// shoutContainer.classList.add('shoutbox');
// shoutContainer.innerHTML = `

// `


document.addEventListener('DOMContentLoaded', function () {
    // document.body.appendChild(shoutContainer);
    // console.log(shoutContainer, 'shout container')
    const shoutForm = document.getElementById('shoutbox-form'); // Updated ID
    const messagesDiv = document.getElementById('comments'); // Updated ID

    console.log('shoutForm:', shoutForm); // Log to check if shoutForm is found
    console.log('messagesDiv:', messagesDiv); // Log to check if messagesDiv is found

    // Fetch and display messages
    async function fetchMessages() {
        try {
            const response = await fetch('http://127.0.0.1:4000/shoutbox/comments');
            if (!response.ok) throw new Error('Network response was not ok');
            const messages = await response.json();
            messagesDiv.innerHTML = '';
            messages.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.innerHTML = `<strong>${message.username}</strong>: ${message.comment} <br> <small>${new Date(message.created_at).toLocaleString()}</small>`;
                messagesDiv.appendChild(messageDiv);
            });
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }

    // Post a new message
    shoutForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const comment = document.getElementById('comment').value;

        try {
            const response = await fetch('http://127.0.0.1:4000/shoutbox/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, comment })
            });

            if (response.ok) {
                fetchMessages();
                shoutForm.reset();
            } else {
                console.error('Failed to post message:', response.statusText);
            }
        } catch (error) {
            console.error('Error posting message:', error);
        }
    });

    fetchMessages();
});
