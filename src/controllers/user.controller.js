const { User, Role } = require('../models'); // Importar modelos y sequelize
const { Op } = require('sequelize'); // Importar Op de sequelize
const { validationResult } = require('express-validator');

const UserController = {
  // Crear un nuevo usuario
  create: async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, firstName, lastName, roles } = req.body;

      // Verificar si el usuario ya existe usando Sequelize
      const userExists = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { username: username }]
        }
      });
      if (userExists) {
        return res.status(400).json({ message: 'El usuario o correo electrónico ya está registrado' });
      }

      // Obtener roles o asignar rol por defecto (USER)
      let userRoles = [];
      if (roles && roles.length > 0) {
        // Buscar roles por nombre
        const foundRoles = await Role.findAll({
          where: {
            name: {
              [Op.in]: roles
            }
          }
        });
        userRoles = foundRoles; // Sequelize devuelve objetos modelo completos
      } else {
        // Buscar rol por defecto
        const defaultRole = await Role.findOne({ where: { name: 'USER' } });
        if (defaultRole) {
          userRoles = [defaultRole]; // Sequelize devuelve objetos modelo completos
        }
      }

      // Crear nuevo usuario
      const user = await User.create({
        username,
        email,
        password, // La encriptación de contraseña debe manejarse en el modelo User si no está ya
        firstName,
        lastName,
        // Las asociaciones se manejan después de crear el usuario
      });

      // Establecer roles para el usuario
      if (userRoles.length > 0) {
        await user.setRoles(userRoles); // Método de asociación many-to-many
      }

      // Recargar el usuario con los roles asociados para la respuesta
      const userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          attributes: ['name', 'description'],
          through: { attributes: [] } // Excluir la tabla intermedia UserRoles
        }]
      });


      res.status(201).json({
        message: 'Usuario creado exitosamente',
        user: {
          id: userWithRoles.id,
          username: userWithRoles.username,
          email: userWithRoles.email,
          firstName: userWithRoles.firstName,
          lastName: userWithRoles.lastName,
          roles: userWithRoles.Roles.map(role => role.name) // Mapear a solo nombres de rol
        }
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
  },

  // Obtener todos los usuarios
  getAll: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Excluir la contraseña
        include: [{
          model: Role,
          attributes: ['name', 'description'],
          through: { attributes: [] } // Excluir la tabla intermedia UserRoles
        }]
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
  },

  // Obtener un usuario por ID
  getById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }, // Excluir la contraseña
        include: [{
          model: Role,
          attributes: ['name', 'description'],
          through: { attributes: [] } // Excluir la tabla intermedia UserRoles
        }]
      });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
    }
  },

  // Actualizar un usuario
  update: async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, roles } = req.body;

      // Buscar usuario
      let user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Actualizar roles si se proporcionan
      if (roles && roles.length > 0) {
        const userRoles = await Role.findAll({
          where: {
            name: {
              [Op.in]: roles
            }
          }
        });
        await user.setRoles(userRoles); // Método de asociación many-to-many
      }

      // Actualizar datos
      user.firstName = firstName !== undefined ? firstName : user.firstName;
      user.lastName = lastName !== undefined ? lastName : user.lastName;
      // Sequelize maneja updatedAt automáticamente si timestamps es true

      await user.save();

      // Recargar el usuario con los roles asociados para la respuesta
      const userWithRoles = await User.findByPk(user.id, {
        include: [{
          model: Role,
          attributes: ['name', 'description'],
          through: { attributes: [] } // Excluir la tabla intermedia UserRoles
        }]
      });

      res.status(200).json({
        message: 'Usuario actualizado exitosamente',
        user: {
          id: userWithRoles.id,
          username: userWithRoles.username,
          email: userWithRoles.email,
          firstName: userWithRoles.firstName,
          lastName: userWithRoles.lastName,
          roles: userWithRoles.Roles.map(role => role.name) // Mapear a solo nombres de rol
        }
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  },

  // Eliminar un usuario
  delete: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      await user.destroy(); // Usar el método destroy de la instancia del modelo
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
  }
};

module.exports = { UserController };