module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define("categorie", {
    nom: DataTypes.STRING,
  });
  return Categorie;
};
