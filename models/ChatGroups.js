module.exports = function(sequelize, DataTypes) {
    var ChatGroups = sequelize.define("ChatGroups", {
      ContactId: DataTypes.UUID
    });
  
    ChatGroups.associate = function(models) {
      // Many Contacts can belong to a userProfile but can't be created unless an userProfile is created first
      ChatGroups.belongsTo(models.UserProfile);
    };
  
    return ChatGroups;
  };