const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Person extends Model {
    static associate(models) {
    }
  }

  Person.init({
    names: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      validate: {
        notEmpty: true,
        len: [8, 12] 
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^\+?[1-9]\d{1,14}$/ // Validación para formato internacional de teléfono
      }
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