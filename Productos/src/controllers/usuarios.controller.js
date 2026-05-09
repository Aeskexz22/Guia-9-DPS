const UsuarioModel = require('../models/usuario.model');
const response = require('../helpers/response');

const validateFields = (body) => {
    const errors = [];
    if (!body.usuario) errors.push('El campo usuario es obligatorio.');
    if (!body.contrasenia) errors.push('El campo contrasenia es obligatorio.');
    return errors;
};

exports.findAll = (req, res) => {
    UsuarioModel.getAll((err, data) => {
        if (err) {
            return response.error(res, 'Ha ocurrido un error al obtener los usuarios.', 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuarios obtenidos exitosamente.');
    });
};

exports.findOne = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');
    }
    
    UsuarioModel.findById(id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            }
            return response.error(res, `Error al obtener el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuario obtenido exitosamente.');
    });
};

exports.create = (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400, 'DATOS_INVALIDOS');
    }
    
    const errors = validateFields(req.body);
    if (errors.length > 0) {
        return response.error(res, errors.join(' '), 400, 'DATOS_INVALIDOS');
    }
    
    const usuario = new UsuarioModel({
        usuario: req.body.usuario.trim(),
        contrasenia: req.body.contrasenia
    });
    
    UsuarioModel.create(usuario, (err, data) => {
        if (err) {
            return response.error(res, 'Ha ocurrido un error al crear el usuario.', 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuario creado exitosamente.', 201);
    });
};

exports.update = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');
    }
    
    if (!req.body || Object.keys(req.body).length === 0) {
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400, 'DATOS_INVALIDOS');
    }
    
    const errors = validateFields(req.body);
    if (errors.length > 0) {
        return response.error(res, errors.join(' '), 400, 'DATOS_INVALIDOS');
    }
    
    UsuarioModel.updateById(id, new UsuarioModel(req.body), (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            }
            return response.error(res, `Error al actualizar el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuario actualizado exitosamente.');
    });
};

exports.delete = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');
    }
    
    UsuarioModel.remove(id, (err) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            }
            return response.error(res, `Error al eliminar el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return res.status(204).send();
    });
    exports.login = (req, res) => {
    const { usuario, contrasenia } = req.body;
    
    if (!usuario || !contrasenia) {
        return response.error(res, 'Usuario y contraseña son requeridos', 400, 'DATOS_INVALIDOS');
    }
    
    UsuarioModel.login(usuario, contrasenia, (err, data) => {
        if (err) {
            if (err.kind === 'not_found') {
                return response.error(res, 'Credenciales incorrectas', 401, 'NO_AUTORIZADO');
            }
            return response.error(res, 'Error al iniciar sesión', 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Login exitoso');
    });
};
};