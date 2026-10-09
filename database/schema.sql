CREATE DATABASE IF NOT EXISTS quiz_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quiz_app;

CREATE TABLE IF NOT EXISTS users (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nom_utilisateur  VARCHAR(50)   NOT NULL,
  mot_de_passe     VARCHAR(255)  NOT NULL,           
  prenom           VARCHAR(100)  NULL,
  nom              VARCHAR(100)  NULL,
  role             ENUM('enseignant', 'etudiant') NOT NULL DEFAULT 'etudiant',
  date_creation    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  derniere_connexion DATETIME    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_nom_utilisateur (nom_utilisateur)
) ENGINE=InnoDB;