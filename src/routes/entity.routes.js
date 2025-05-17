const express = require('express');
const router = express.Router();
const { EntityController } = require('../controllers/entity.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const { entityValidation } = require('../middleware/validation.middleware');

// Crear una nueva entidad
router.post('/', [
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    entityValidation.create
  ],
  EntityController.create
);

// Obtener todas las entidades
router.get('/', [
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER'])
  ],
  EntityController.getAll
);

// Obtener una entidad por ID
router.get('/:id', [
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER'])
  ],
  EntityController.getById
);

// Actualizar una entidad
router.put('/:id', [
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER']),
    entityValidation.update
  ],
  EntityController.update
);

// Eliminar una entidad
router.delete('/:id', [
    authMiddleware,
    roleMiddleware(['ADMIN', 'MANAGER'])
  ],
  EntityController.delete
);

module.exports = { entityRoutes: router};