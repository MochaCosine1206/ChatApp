module.exports = function(sequelize, DataTypes) {
    var Chats = sequelize.define("Chats", {
      chatID: {
        type: DataTypes.TEXT,
      },
      message: {
        type: DataTypes.TEXT,
      },
        messageTime: {
        type: DataTypes.DATE,
      },
      UserProfileId: {
        type: DataTypes.UUID,
      },
      UserName: {
        type: DataTypes.STRING
      }
    });
  
    Chats.associate = function(models) {
      // We're saying that a Chat should belong to an UserProfile
      Chats.hasMany(models.UserProfile);
    };
  
    return Chats;
  };