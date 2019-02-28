module.exports = function(sequelize, DataTypes) {
    var UserProfile = sequelize.define("UserProfile", {
      userID: {
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      userName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1]
          }
      },
      avatar_seed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about_me: {
        type: DataTypes.TEXT,
      }
    });
  
    UserProfile.associate = function(models) {
      // We're saying that a UserProfile should belong to an Author
      UserProfile.belongsToMany(models.Chats,{through: 'ChatUsers'});
      UserProfile.hasMany(models.Contacts,{as: 'contactID'});
    };
  
    return UserProfile;
  };