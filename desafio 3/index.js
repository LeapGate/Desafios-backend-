const fs = require("fs");

const express = require("express");
const app = express();
const routerProductos = express.Router();

const port = process.env.PORT || 8080

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


   routerProductos.get("/", (req, res) => {
        const { id } = req.query;
        if(id != undefined) {
        res.json(contenedor1.tomar(Number(id)));
        } else {
        res.json(contenedor1.tomarTodo());
        }
    });

  routerProductos.get("/:id", (req, res) => {
    const { id } = req.params;
    res.json(contenedor1.tomar(Number(id)));
  });

  routerProductos.post("/", (req, res) => {
    const { nombre, precio, imagen } = req.body;
    if(nombre === null || precio === null || imagen === null) {
      res.json({
        error: "campos sin rellenar!"
      });
    } else {
      res.json(contenedor1.guardar({ nombre: nombre, precio: Number(precio), imagen: imagen}));
    }
  });

  routerProductos.put("/:id", (req, res) => {
    const producto = req.body;
    const { id } = req.params;
    if(producto.nombre === producto.nombre) {
        res.json({
          error: "Este producto ya existe!"
        });
    }else{
        res.json(contenedor1.actualizar(Number(id), producto));
    }
  });

  routerProductos.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.json(contenedor1.borrar(Number(id)));
  })


const server = app.listen(port, () => {
    console.log(`Servidor esta corriendo \n Numero: ${server.address().port}`)
})
server.on("error", error => console.log("error"))