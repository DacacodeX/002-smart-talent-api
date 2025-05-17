const { sequelize, Role, User } = require('../models');
require('dotenv').config();

const initDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Conexión a PostgreSQL establecida para inicialización');

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
    await Role.bulkCreate(roles);
    console.log('Roles predeterminados creados exitosamente');

    // Crear usuarios para cada rol
    const usersData = [
      {
        username: 'admin',
        email: 'admin@smarttalent.com',
        password: 'Admin@123',
        firstName: 'Admin',
        lastName: 'System',
        active: true,
        roleName: 'ADMIN'
      },
      {
        username: 'manager',
        email: 'manager@smarttalent.com',
        password: 'Manager@123',
        firstName: 'Manager',
        lastName: 'System',
        active: true,
        roleName: 'MANAGER'
      },
      {
        username: 'user',
        email: 'user@smarttalent.com',
        password: 'User@123',
        firstName: 'User',
        lastName: 'Standard',
        active: true,
        roleName: 'USER'
      },
      {
        username: 'guest',
        email: 'guest@smarttalent.com',
        password: 'Guest@123',
        firstName: 'Guest',
        lastName: 'Visitor',
        active: true,
        roleName: 'GUEST'
      }
    ];

    // Crear usuarios y asignar roles
    for (const userData of usersData) {
      const { roleName, ...userInfo } = userData;
      const user = await User.create(userInfo);
      const role = await Role.findOne({ where: { name: roleName } });
      await user.addRole(role);
      console.log(`Usuario ${roleName} creado exitosamente`);
      console.log(`Email: ${userInfo.email}`);
      console.log(`Contraseña: ${userInfo.password}`);
      console.log('-------------------');
    }

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