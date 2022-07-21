const fs = require("fs");


module.exports = class Contenedor {
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