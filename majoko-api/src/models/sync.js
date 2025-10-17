const { sequelize } = require('./index');

module.exports = async function sync() {
  try {
    await sequelize.sync({ alter: true }); // alter:true for dev convenience
    console.log('✅ All models synchronized');
  } catch (err) {
    console.error('Error syncing models', err);
  }
};
