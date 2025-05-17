const { Entity, User, Role } = require('../models');
const { validationResult } = require('express-validator');

const EntityController = {
  // Crear una nueva entidad
  create: async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, documentNumber, firstName, lastName, businessName, email } = req.body;

      // Verificar si la entidad ya existe por documento
      const entityExists = await Entity.findOne({ 
        where: { documentNumber }
      });
      if (entityExists) {
        return res.status(400).json({ message: 'Ya existe una entidad con este número de documento' });
      }

      // Verificar si ya existe un usuario con ese email
      const userExists = await User.findOne({
        where: { email }
      });
      if (userExists) {
        return res.status(400).json({ message: 'Ya existe un usuario con este email' });
      }

      // Crear nueva entidad
      const entity = await Entity.create({
        type,
        documentNumber,
        firstName,
        lastName,
        businessName,
        active: true
      });

      // Obtener el rol USER
      const userRole = await Role.findOne({ where: { name: 'USER' } });
      if (!userRole) {
        return res.status(500).json({ message: 'Error al asignar rol: Rol USER no encontrado' });
      }

      // Crear usuario asociado
      const user = await User.create({
        username: type === 'NATURAL' ? firstName + lastName : businessName,
        email,
        password: documentNumber, // La contraseña será el DNI o RUC
        active: true
      });

      // Asignar rol al usuario
      await user.setRoles([userRole]);

      res.status(201).json({
        message: 'Entidad y usuario creados exitosamente',
        entity,
        user: {
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Error al crear entidad:', error);
      res.status(500).json({ message: 'Error al crear entidad', error: error.message });
    }
  },

  // Obtener todas las entidades
  getAll: async (req, res) => {
    try {
      const entities = await Entity.findAll({
        include: ['requests'] // Incluir las solicitudes relacionadas
      });
      res.status(200).json(entities);
    } catch (error) {
      console.error('Error al obtener entidades:', error);
      res.status(500).json({ message: 'Error al obtener entidades', error: error.message });
    }
  },

  // Obtener una entidad por ID
  getById: async (req, res) => {
    try {
      const entity = await Entity.findByPk(req.params.id, {
        include: ['requests'] // Incluir las solicitudes relacionadas
      });
      if (!entity) {
        return res.status(404).json({ message: 'Entidad no encontrada' });
      }
      res.status(200).json(entity);
    } catch (error) {
      console.error('Error al obtener entidad:', error);
      res.status(500).json({ message: 'Error al obtener entidad', error: error.message });
    }
  },

  // Actualizar una entidad
  update: async (req, res) => {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, documentNumber, firstName, lastName, businessName, email, active } = req.body;
      
      // Buscar entidad
      let entity = await Entity.findByPk(req.params.id);
      if (!entity) {
        return res.status(404).json({ message: 'Entidad no encontrada' });
      }

      // Verificar si el documento ya existe en otra entidad
      if (documentNumber) {
        const existingEntity = await Entity.findOne({
          where: {
            documentNumber,
            id: { [Op.ne]: req.params.id } // Excluir la entidad actual
          }
        });
        if (existingEntity) {
          return res.status(400).json({ message: 'Ya existe una entidad con este número de documento' });
        }
      }

      // Actualizar datos
      entity.type = type || entity.type;
      entity.documentNumber = documentNumber || entity.documentNumber;
      entity.firstName = firstName || entity.firstName;
      entity.lastName = lastName || entity.lastName;
      entity.businessName = businessName || entity.businessName;
      entity.active = active !== undefined ? active : entity.active;
      
      await entity.save();

      // Si se proporciona email, actualizar el usuario asociado
      if (email) {
        const user = await User.findOne({ where: { email: entity.email } });
        if (user) {
          user.email = email;
          user.username = type === 'NATURAL' ? firstName + lastName : businessName;
          await user.save();
        }
      }

      res.status(200).json({
        message: 'Entidad actualizada exitosamente',
        entity
      });
    } catch (error) {
      console.error('Error al actualizar entidad:', error);
      res.status(500).json({ message: 'Error al actualizar entidad', error: error.message });
    }
  },

  // Eliminar una entidad
  delete: async (req, res) => {
    try {
      const entity = await Entity.findByPk(req.params.id);
      if (!entity) {
        return res.status(404).json({ message: 'Entidad no encontrada' });
      }

      await entity.destroy();
      res.status(200).json({ message: 'Entidad eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar entidad:', error);
      res.status(500).json({ message: 'Error al eliminar entidad', error: error.message });
    }
  }
};

module.exports = { EntityController };