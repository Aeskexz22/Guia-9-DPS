const ProductoModel = require('../models/producto.model');
const response = require('../helpers/response');

const validateFields = (body) => {
    const errors = [];
    if (!body.nombre) errors.push('El campo nombre es obligatorio.');
    if (!body.precioventa) errors.push('El campo precio de venta es obligatorio.');
    if (!body.cantidad && body.cantidad !== 0) errors.push('El campo cantidad es obligatorio.');
    return errors;
};

exports.findAll = (req, res) => {
    ProductoModel.getAll((err, data) => {
        if (err) {
            return response.error(res, 'Ha ocurrido un error al obtener los productos.', 500);
        }
        return response.success(res, data, 'Productos obtenidos exitosamente.');
    });
};

exports.findOne = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400);
    }
    
    ProductoModel.findById(id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Producto con id ${id} no encontrado.`, 404);
            }
            return response.error(res, `Error al obtener el producto con id ${id}.`, 500);
        }
        return response.success(res, data, 'Producto obtenido exitosamente.');
    });
};

exports.create = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400);
    }
    
    const errors = validateFields(req.body);
    if (errors.length > 0) {
        return response.error(res, errors.join(' '), 400);
    }
    
    const producto = new ProductoModel({
        nombre: req.body.nombre.trim(),
        descripcion: req.body.descripcion || null,
        preciocosto: req.body.preciocosto || 0,
        precioventa: req.body.precioventa,
        cantidad: req.body.cantidad,
        fotografia: req.body.fotografia || null
    });
    
    ProductoModel.create(producto, (err, data) => {
        if (err) {
            return response.error(res, 'Ha ocurrido un error al crear el producto.', 500);
        }
        return response.success(res, data, 'Producto creado exitosamente.', 201);
    });
};

exports.update = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400);
    }
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400);
    }
    
    const errors = validateFields(req.body);
    if (errors.length > 0) {
        return response.error(res, errors.join(' '), 400);
    }
    
    ProductoModel.updateById(id, new ProductoModel(req.body), (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Producto con id ${id} no encontrado.`, 404);
            }
            return response.error(res, `Error al actualizar el producto con id ${id}.`, 500);
        }
        return response.success(res, data, 'Producto actualizado exitosamente.');
    });
};

exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400);
    }
    
    ProductoModel.remove(id, (err) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Producto con id ${id} no encontrado.`, 404);
            }
            return response.error(res, `Error al eliminar el producto con id ${id}.`, 500);
        }
        return res.status(204).send();
    });
};