const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const { getDatabaseConfig } = require('../../config');
const db = {};
const config = getDatabaseConfig();

let sequelize = new Sequelize(
  config.name,
  config.username,
  config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: Object.hasOwnProperty(config, 'logging')
      ? config.logging
      : console.log
  },
);
 
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
 
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
 
db.sequelize = sequelize;
db.Sequelize = Sequelize;
 
module.exports = db;