const { sequelize, Role, User, DocumentType, ResourceType } = require('../models');
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

    // Crear tipos de documentos predeterminados
    const documentTypes = [
      {
        name: 'Antecedentes Penales',
        isActive: true
      },
      {
        name: 'Antecedentes Nacionales',
        isActive: true
      },
      {
        name: 'Verificación laboral',
        isActive: true
      },
      {
        name: 'Verificación Académica',
        isActive: true
      },
      {
        name: 'Verificación Crediticia',
        isActive: true
      },
      {
        name: 'Verificación Domiciliaria',
        isActive: true
      }
    ];

    // Insertar tipos de documentos
    const createdDocTypes = await DocumentType.bulkCreate(documentTypes);
    console.log('Tipos de documentos creados exitosamente');

    // Crear tipos de recursos
    const resourceTypes = [
      {
        name: 'DOCUMENTO_ORIGINAL',
        description: 'Documento original escaneado',
        isRequired: true,
        maxFileSize: 5000000,
        allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png']
      },
      {
        name: 'FORMULARIO_FIRMADO',
        description: 'Formulario firmado por el solicitante',
        isRequired: true,
        maxFileSize: 5000000,
        allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png']
      },
      {
        name: 'DOCUMENTO_ADICIONAL',
        description: 'Documentación adicional de soporte',
        isRequired: false,
        maxFileSize: 5000000,
        allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png']
      },
      {
        name: 'CERTIFICADO_OFICIAL',
        description: 'Certificado oficial emitido por la entidad',
        isRequired: true,
        maxFileSize: 5000000,
        allowedFileTypes: ['application/pdf']
      }
    ];

    // Insertar tipos de recursos
    const createdResourceTypes = await ResourceType.bulkCreate(resourceTypes);
    console.log('Tipos de recursos creados exitosamente');

    // Asociar tipos de documentos con tipos de recursos
    const documentResourceAssociations = [
      // Antecedentes Penales
      { docType: createdDocTypes[0], resources: [createdResourceTypes[0], createdResourceTypes[1]] },
      // Antecedentes Nacionales
      { docType: createdDocTypes[1], resources: [createdResourceTypes[0], createdResourceTypes[1], createdResourceTypes[2]] },
      // Verificación laboral
      { docType: createdDocTypes[2], resources: [createdResourceTypes[0], createdResourceTypes[3]] },
      // Verificación Académica
      { docType: createdDocTypes[3], resources: [createdResourceTypes[0], createdResourceTypes[3]] },
      // Verificación Crediticia
      { docType: createdDocTypes[4], resources: [createdResourceTypes[0], createdResourceTypes[1]] },
      // Verificación Domiciliaria
      { docType: createdDocTypes[5], resources: [createdResourceTypes[0], createdResourceTypes[2]] }
    ];

    // Crear las asociaciones
    for (const association of documentResourceAssociations) {
      await association.docType.addResourceTypes(association.resources);
    }
    console.log('Asociaciones entre tipos de documentos y recursos creadas exitosamente');
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