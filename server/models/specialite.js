module.exports = (sequelize, DataTypes) => {
  const Specialite = sequelize.define("specialite", {
    nom: DataTypes.STRING,
  });
  return Specialite;
};
