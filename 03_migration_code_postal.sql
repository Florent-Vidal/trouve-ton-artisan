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

-- Le fichier est encodé en UTF-8 : sans cette instruction, un client MySQL
-- configuré en latin1 (cas par défaut sur plusieurs distributions) réencode
-- les accents à l'insertion et « Bâtiment » est stocké « BÃ¢timent ».
SET NAMES utf8mb4;

USE trouve_ton_artisan;

ALTER TABLE artisan
    ADD COLUMN code_postal VARCHAR(10) NULL AFTER ville;
