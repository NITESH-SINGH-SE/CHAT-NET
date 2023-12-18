// const moment = require("moment/moment");

const socket = io();

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const board = document.getElementById('board');

const messageTone = new Audio('/notify.mp3');

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()  // prevents the page from loading
    sendMessage();
})

function sendMessage(){
    if(messageInput.value === '')   return ;   // Return from the function if the message is empty 
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    // console.log(data);
    messageTone.play(); //play the tone when their is chat message
    addMessageToUI(false, data);
})

function addMessageToUI(isOwnMessage, data){
    clearFeedback();
    let text = new Date().toLocaleString();
    const element = `<li class="${isOwnMessage ? "message-right": "message-left"}">
    <p class="message">
        ${data.message}
        <span>${text}</span>
    </p>
</li>`
    messageContainer.innerHTML += element;
    scrollToBottom();
}

// Function to automatically scroll the chat to the buttom
function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

// Function to show who is typing the message
// if focuses in input field
messageInput.addEventListener('focus', (e) =>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`,
    })
})

// if pressing any key
messageInput.addEventListener('keypress', (e) =>{
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing a message`,
    })
})

// If doing nothing
messageInput.addEventListener('blur', (e) =>{
    socket.emit('feedback', {
        feedback: ``,
    })
})


// 
socket.on('feedback', (data) =>{
    clearFeedback();
    const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
</li>`

    messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element);
    })
}

// Determining and displaying the total number of connections.
const clientsTotal = document.getElementById('client-total');   // Finding out the total number of clients.
socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`;
})  // Display the total number of clients.
