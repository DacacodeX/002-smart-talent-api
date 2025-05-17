const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Entity extends Model {
    static associate(models) {
      Entity.hasMany(models.Request, {
        foreignKey: 'entityId',
        as: 'requests'
      });
    }
  }

  Entity.init({
    type: {
      type: DataTypes.ENUM('NATURAL', 'JURIDICA'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El tipo de entidad es requerido'
        },
        isIn: {
          args: [['NATURAL', 'JURIDICA']],
          msg: 'El tipo de entidad debe ser NATURAL o JURIDICA'
        }
      }
    },
    documentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isValidDocument(value) {
          if (this.type === 'NATURAL' && !/^\d{8}$/.test(value)) {
            throw new Error('El DNI debe tener 8 dígitos');
          }
          if (this.type === 'JURIDICA' && !/^\d{11}$/.test(value)) {
            throw new Error('El RUC debe tener 11 dígitos');
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidForNatural() {
          if (this.type === 'NATURAL' && !this.firstName) {
            throw new Error('El nombre es requerido para personas naturales');
          }
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidForNatural() {
          if (this.type === 'NATURAL' && !this.lastName) {
            throw new Error('El apellido es requerido para personas naturales');
          }
        }
      }
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isValidForJuridica() {
          if (this.type === 'JURIDICA' && !this.businessName) {
            throw new Error('La razón social es requerida para personas jurídicas');
          }
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Entity'
  });

  return Entity;
};