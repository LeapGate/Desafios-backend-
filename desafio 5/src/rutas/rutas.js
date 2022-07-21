const express = require("express");
const routerProductos = express.Router();


const Contenedor = require("../contenedor");
const contenedor1 = new Contenedor("productos.json");

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true }));


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

module.exports = routerProductos