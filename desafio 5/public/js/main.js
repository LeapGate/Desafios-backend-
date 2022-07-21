const socket = io.connect();

socket.on("mensajes", data => {
  const html = data.map(element => {
    return (`
      <p>
        <strong>${element.author}</strong> <span>[${element.date}]</span> : <br/> <i>${element.text}</i>
      </p>
    `);
  }).join(" ")
  document.getElementById("chat").innerHTML = html;
});

function agregarMensaje() {
  const today = new Date();
  const now = today.toLocaleString();
  const mensaje = {
    author: document.getElementById("usermail").value,
    date: now,
    text: document.getElementById("text").value
  };
  socket.emit("nuevo-mensaje", mensaje);
  return false;
}

function renderProducts({respuesta: respuesta}) {
  const tBody = document.getElementById("tBody");
  
  tBody.innerHTML = ejs.render(
    `
    <% for(let i = 0; i < response.length; i++) { %>
      <tr>
        <td><%= response[i].nombre %></td>
        <td>$ <%= response[i].precio %></td>
        <td><%= response[i].cantidad %></td>
        <td>
          <img src=<%= response[i].imagen %> alt=<%= response[i].nombre %> width="100px">
        </td>
      </tr>
    <% } %>
    `, {respuesta: respuesta}
  );
}

socket.on("products", response => {
  renderProducts({response});
});