const { check } = require('express-validator');

// Validaciones para usuarios
const userValidation = {
  create: [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('username', 'El nombre de usuario debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'Por favor ingrese una contraseña con 6 o más caracteres').isLength({ min: 6 })
  ],
  
  update: [
    check('email', 'Por favor incluya un email válido').optional().isEmail(),
    check('username', 'El nombre de usuario debe tener al menos 3 caracteres').optional().isLength({ min: 3 })
  ]
};

const authValidation = {
  register: [
    check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('username', 'El nombre de usuario debe tener al menos 3 caracteres').isLength({ min: 3 }),
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'Por favor ingrese una contraseña con 6 o más caracteres').isLength({ min: 6 })
  ],
  
  login: [
    check('email', 'Por favor incluya un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists()
  ]
};

// Validaciones para roles
const roleValidation = {
  // Validación para crear rol
  create: [
    check('name', 'El nombre del rol es obligatorio').not().isEmpty(),
    check('name', 'El nombre del rol debe ser uno de: ADMIN, USER, MANAGER, GUEST').isIn(['ADMIN', 'USER', 'MANAGER', 'GUEST']),
    check('description', 'La descripción del rol es obligatoria').not().isEmpty(),
    check('permissions', 'Los permisos deben ser un array').isArray()
  ],
  
  // Validación para actualizar rol
  update: [
    check('description', 'La descripción del rol es obligatoria').not().isEmpty(),
    check('permissions', 'Los permisos deben ser un array').isArray()
  ]
};

module.exports = { userValidation, authValidation, roleValidation };