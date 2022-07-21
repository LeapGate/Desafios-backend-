const fs = require("fs");

module.exports = class Chat {
  constructor(nombreArchivo) {
    this.nombreArchivo = nombreArchivo;
  }

  traerTodo() {
    const respuesta = fs.readFileSync(this.nameFile, "utf-8");
    if(respuesta === "") {
      return [];
    } else {
      return JSON.parse(respuesta);
    }
  }

  guardar(mensaje) {
    const data = this.traerTodo();
    data.push(mensaje);
    fs.writeFileSync(this.nameFile, JSON.stringify(data));
  }
}