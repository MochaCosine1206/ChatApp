module.exports = function(sequelize, DataTypes) {
    var Contacts = sequelize.define("Contacts", {
    });
  
    Contacts.associate = function(models) {
      // Many Contacts can belong to a userProfile but can't be created unless an userProfile is created first
      Contacts.belongsTo(models.UserProfile, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Contacts;
  };