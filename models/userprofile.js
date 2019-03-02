module.exports = function (sequelize, DataTypes) {
  var UserProfile = sequelize.define("UserProfile", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    avatar_seed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  UserProfile.associate = function (models) {
    // We're saying that a UserProfile should belong to an Author
    UserProfile.belongsToMany(models.Chats, { through: 'ChatUsers' });
    UserProfile.hasMany(models.Contacts, { as: 'contactID' });
    UserProfile.belongsTo(models.User);
  };

  return UserProfile;
};