  const socket = io();

  const roomId = "<%= room._id %>";
  const user = "<%= user.username %>";

  // join this room
  socket.emit("joinRoom", roomId);

  // send message
  const form = document.getElementById("chatForm");
  const input = document.getElementById("messageInput");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = input.value;
    socket.emit("chatMessage", { roomId, user, text: msg });
    input.value = "";
  });

  // receive message
  socket.on("chatMessage", (data) => {
    const messages = document.getElementById("messages");
    const li = document.createElement("li");
    li.textContent = `${data.user}: ${data.text}`;
    messages.appendChild(li);
  });