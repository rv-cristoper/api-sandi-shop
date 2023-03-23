const socket = io();

const listMessages = document.getElementById('list-messages');
const inputMessage = document.getElementById('message');

const onSubmitForm = () => {
    const user = document.forms["messageForm"]["email"].value;
    const message = document.forms["messageForm"]["message"].value;
    const payload = {
        user,
        message
    };
    socket.emit('newMessage', payload)
    inputMessage.value = '';
    inputMessage.focus();
}


socket.on('newMessage', (data) => {
    const li = document.createElement('li');
    li.innerHTML = `<p><strong>${data.user}</strong>: ${data.message}</p>`;
    listMessages.appendChild(li);
});