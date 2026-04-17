module.exports = (sequelize, DataTypes) => {
  const Artisan = sequelize.define("artisan", {
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    email: DataTypes.STRING,
    photo: DataTypes.STRING,
    site_web: DataTypes.STRING,
    note: DataTypes.TINYINT,
    top_artisan: DataTypes.BOOLEAN,
  });
  return Artisan;
};
