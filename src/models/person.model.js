const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Person extends Model {
    static associate(models) {
      Person.belongsTo(models.Request, {
        foreignKey: 'requestId',
        as: 'request'
      });
      Person.hasMany(models.Document, {
        foreignKey: 'personId',
        as: 'documents'
      });
    }
  }

  Person.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Person'
  });

  return Person;
};