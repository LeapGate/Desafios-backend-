const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const routerProductos = require("./src/rutas/rutas");

app.use(express.static("./public"));
app.use("/api/productos", routerProductos);


app.set("view engine", ".ejs");
app.set("views", "./views");


const Contenedor = require("./src/contenedor");
const contenedor1 = new Contenedor("productos.json");

const Chat = require("./src/chat");
const chat1 = new Chat("messages.json");

io.on("connection", socket => {
  const respuesta = contenedor1.tomarTodo();
  console.log("Un cliente se ha conectado");
  socket.emit("mensajes", chat1.traerTodo());
  socket.emit("productos", respuesta)

  socket.on("nuevo-mensaje", data => {
    chat1.guardar(data)
    io.sockets.emit("mensajes", chat1.traerTodo());
    io.sockets.emit("prductos", respuesta);
  });
});


const PORT = process.env.PORT || 8080;

const connectedServer = httpServer.listen(PORT, () => {
  console.log(`Servidor HTTP con Websockets escuchando en el puerto ${connectedServer.address().port}`);
});

connectedServer.on("error", error => console.log(`Error en servidor ${error}`));