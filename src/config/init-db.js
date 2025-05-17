const { sequelize, Role, User } = require('../models');
require('dotenv').config();

// Función para inicializar la base de datos con roles predeterminados
const initDatabase = async () => {
  try {
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: true });
    console.log('Conexión a PostgreSQL establecida para inicialización');

    // Verificar si ya existen roles
    // const count = await Role.count();
    
    // Si ya existen roles, no hacer nada
    // if (count > 0) {
    //   console.log('La base de datos ya está inicializada con roles');
    //   return;
    // }

    // Crear roles predeterminados
    const roles = [
      {
        name: 'ADMIN',
        description: 'Administrador con acceso completo al sistema',
        permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE']
      },
      {
        name: 'MANAGER',
        description: 'Gerente con acceso a gestión y reportes',
        permissions: ['CREATE', 'READ', 'UPDATE']
      },
      {
        name: 'USER',
        description: 'Usuario estándar del sistema',
        permissions: ['READ']
      },
      {
        name: 'GUEST',
        description: 'Usuario invitado con acceso limitado',
        permissions: ['READ']
      }
    ];

    // Insertar roles en la base de datos
    const createdRoles = await Role.bulkCreate(roles);
    
    console.log('Roles predeterminados creados exitosamente');

    // Crear usuario administrador por defecto
    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@smarttalent.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'System',
      active: true  // Cambiado de isActive a active para coincidir con el modelo
    });

    // Asignar rol de administrador al usuario
    await adminUser.addRole(adminRole);
    
    console.log('Usuario administrador creado exitosamente');
    console.log('Email: admin@smarttalent.com');
    console.log('Contraseña: Admin@123');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar la inicialización si este archivo se ejecuta directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };