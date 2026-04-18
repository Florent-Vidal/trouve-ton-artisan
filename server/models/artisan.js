module.exports = (sequelize, DataTypes) => {
  const Artisan = sequelize.define("artisan", {
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    email: DataTypes.STRING,
    site_web: DataTypes.STRING,
    note: DataTypes.DECIMAL(2, 1),
    ville: DataTypes.STRING,
    photo: DataTypes.STRING,
    a_propos: DataTypes.TEXT,
    top_artisan: DataTypes.BOOLEAN,
  });
  return Artisan;
};
