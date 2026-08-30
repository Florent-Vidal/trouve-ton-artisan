-- ============================================================
-- Migration : ajout de la colonne code_postal à la table artisan
--
-- Le modèle Sequelize déclarait code_postal alors que le script de
-- création initial ne le créait pas : Sequelize générait donc un
-- SELECT sur une colonne inexistante, ce qui faisait échouer toutes
-- les lectures d'artisans avec une erreur « Unknown column ».
--
-- À exécuter sur une base déjà créée. Les nouvelles installations
-- passent directement par 01_create_database.sql, désormais corrigé.
-- ============================================================

USE trouve_ton_artisan;

ALTER TABLE artisan
    ADD COLUMN code_postal VARCHAR(10) NULL AFTER ville;
