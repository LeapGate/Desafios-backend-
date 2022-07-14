const fs = require("fs");

const express = require("express");
const app = express();
const routerProductos = express.Router();

class Contenedor {
    constructor(nombreArchivo) {
      this.nombreArchivo = nombreArchivo;
    }
  
    tomarTodo() {
      const respuesta = fs.readFileSync(this.nombreArchivo, "utf-8");
      return (JSON.parse(respuesta));
    }
    
    tomar(id) {
      const datos = this.tomarTodo();
      if(id <= 0 || id > datos.length) {
        return { error: "El producto con el id especificado no ha sido encontrado."}
      }
      return datos[id - 1];
    }
  
    guardar(producto) {
      const datos = this.tomarTodo();
      producto.id = datos.length + 1;
      datos.push(producto);
      fs.writeFileSync(this.nombreArchivo, JSON.stringify(datos));
      return {
        product: producto
      }
    }
  
    actualizar(id, producto) {
      const datos = this.tomarTodo();
      producto.id = id;
      const productoPrevio = datos.splice(id - 1, 1, producto);
      fs.writeFileSync(this.nombreArchivo, JSON.stringify(datos),null, 4);
      return {
        cambiado : productoPrevio,
        nuevo: producto
      }
    }
  
    borrar(id) {
      const datos = this.tomarTodo();
      const productoPrevio = datos.splice(id - 1, 1);
      fs.writeFileSync(this.nombreArchivo, JSON.stringify(datos),null, 4);
      return {
        borrado: productoPrevio
      }
    }
  }

const contenedor1 = new Contenedor("productos.json");

app.use("/api/productos", routerProductos);
routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const exphbs = require("express-handlebars");

/* app.set("views", "./views/handlebars");
app.engine(
    ".hbs",
    exphbs({
     defaultLayout: "main",
     layoutsDir: "./views/handlebars/layouts",
     partialsDir: "./views/handlebars/partials",
     extname: ".hbs",
   })
);
app.set("view engine", ".hbs"); */

/* app.set("view engine", ".pug");
app.set("views", "./views/pug"); */

app.set("view engine", ".ejs");
app.set("views", "./views/ejs");

routerProductos.get("/", (req, res) => {
    const { id } = req.query;
    if(id != undefined) {
        const respuesta = contenedor1.tomar(Number(id))
        res.render("idProducto",{respuesta})
} else{
    const respuesta = contenedor1.tomarTodo();
    res.render("index",{respuesta})
    }
});

routerProductos.get("/:id", (req, res) => {
    const { id } = req.params;
    const respuesta = contenedor1.tomar(Number(id));
    res.render("idProducto", {respuesta});
});

routerProductos.post("/", (req, res) => {
    const { nombre, precio, imagen } = req.body;
    if(nombre === null || precio === null || imagen === null) {
        res.render("agregarProduto", {respuesta: false});
    }else {
        const respuesta = contenedor1.guardar({
            nombre: nombre,
            precio: precio,
            imagen: imagen
          });
        
        res.render("agregarProducto", {respuesta})
    }
});

routerProductos.put("/:id", (req, res) => {
    const producto = req.body;
    const { id } = req.params;
    if(producto.nombre === producto.nombre) {
        res.render("actualizarProducto", {respuesta: false});
    }else{
        const respuesta = contenedor1.actualizar(Number(id),{
          nombre : nombre,
          precio : precio,
          imagen : imagen
        });
      res.render("actualizarProducto", {respuesta});
    }
});

routerProductos.delete("/:id", (req, res) => {
    const { id } = req.params;
    const respuesta = contenedor1.borrar(Number(id));
    res.render("borrarProducto",{respuesta})
})

const port = process.env.PORT || 8080

const server = app.listen(port, () => {
    console.log(`Servidor esta corriendo \n Numero: ${server.address().port}`)
})
server.on("error", error => console.log("error"))