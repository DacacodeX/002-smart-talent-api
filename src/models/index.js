const { sequelize } = require('../config/database');

// Importar definiciones de modelos
const UserModel = require('./user.model');
const RoleModel = require('./role.model');

// Inicializar modelos
const User = UserModel(sequelize);
const Role = RoleModel(sequelize);

// Definir relaciones
User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

// Exportar modelos y sequelize
module.exports = {
  sequelize,
  User,
  Role
};