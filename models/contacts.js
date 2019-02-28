module.exports = function(sequelize, DataTypes) {
    var Contacts = sequelize.define("Contacts", {
      contactID: {
        type: DataTypes.UUID,
      }
    });
  
    Contacts.associate = function(models) {
      // We're saying that a Chat should belong to an UserProfile
      Contacts.belongsTo(models.UserProfile);
    };
  
    return Contacts;
  };