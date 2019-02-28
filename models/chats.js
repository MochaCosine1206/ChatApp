module.exports = function(sequelize, DataTypes) {
    var Chats = sequelize.define("Chats", {
      chatID: {
        type: DataTypes.UUID,
      },
      message: {
        type: DataTypes.TEXT,
      },
        messageTime: {
        type: DataTypes.DATE,
      }
    });
  
    Chats.associate = function(models) {
      // We're saying that a Chat should belong to an UserProfile
      Chats.hasMany(models.UserProfile);
    };
  
    return Chats;
  };