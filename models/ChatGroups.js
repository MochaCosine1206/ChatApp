module.exports = function(sequelize, DataTypes) {
    var ChatGroups = sequelize.define("ChatGroups", {
      UserID: DataTypes.UUID
    });
  
    ChatGroups.associate = function(models) {
      ChatGroups.belongsTo(models.UserProfile);
    };
  
    return ChatGroups;
  };