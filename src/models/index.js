const { sequelize } = require('../config/database');

// Importar definiciones de modelos
const UserModel = require('./user.model');
const RoleModel = require('./role.model');
const EntityModel = require('./entity.model');
const RequestModel = require('./request.model');
const PersonModel = require('./person.model');
const DocumentModel = require('./document.model');
const ResourceModel = require('./resource.model');

// Inicializar modelos
const User = UserModel(sequelize);
const Role = RoleModel(sequelize);
const Entity = EntityModel(sequelize);
const Request = RequestModel(sequelize);
const Person = PersonModel(sequelize);
const Document = DocumentModel(sequelize);
const Resource = ResourceModel(sequelize);

// Definir relaciones
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  User,
  Role,
  Entity,
  Request,
  Person,
  Document,
  Resource
};