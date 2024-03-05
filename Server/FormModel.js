const { Sequelize, DataTypes } = require('sequelize');

// Sequelize connection for the form database
const sequelize = new Sequelize('signup', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: '5432',
});

sequelize.options.logging = console.log;

// Define the Form model
const Form = sequelize.define('Form', {
  formTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  formParameters: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  reviewType: { // Adding the reviewType field to the model
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Form database synced');
  })
  .catch((error) => {
    console.error('Error syncing form database:', error);
  });

module.exports = {
  Form,
};
