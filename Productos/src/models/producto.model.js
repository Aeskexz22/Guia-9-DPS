const sql = require('../config/database');

const Producto = function(producto) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.preciocosto = producto.preciocosto;
    this.precioventa = producto.precioventa;
    this.cantidad = producto.cantidad;
    this.fotografia = producto.fotografia;
};

Producto.getAll = (result) => {
    sql.query("SELECT * FROM productos", (err, results) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, results);
    });
};

Producto.findById = (id, result) => {
    sql.query("SELECT * FROM productos WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result({ kind: "not_found" }, null);
    });
};

Producto.create = (newProducto, result) => {
    sql.query("INSERT INTO productos SET ?", newProducto, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        newProducto.id = res.insertId;
        result(null, { ...newProducto });
    });
};

Producto.updateById = (id, producto, result) => {
    sql.query(
        "UPDATE productos SET nombre = ?, descripcion = ?, preciocosto = ?, precioventa = ?, cantidad = ?, fotografia = ? WHERE id = ?",
        [producto.nombre, producto.descripcion, producto.preciocosto, producto.precioventa, producto.cantidad, producto.fotografia, id],
        (err, res) => {
            if (err) {
                result(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, { id, ...producto });
        }
    );
};

Producto.remove = (id, result) => {
    sql.query("DELETE FROM productos WHERE id = ?", [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

module.exports = Producto;