CREATE DATABASE IF NOT EXISTS quiz_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE quiz_app;

CREATE TABLE IF NOT EXISTS users (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nom_utilisateur  VARCHAR(50)   NOT NULL,
  mot_de_passe     VARCHAR(255)  NOT NULL,
  date_modification_mdp DATETIME NULL,
  prenom           VARCHAR(100)  NULL,
  nom              VARCHAR(100)  NULL,
  email            VARCHAR(255)  NULL,
  role             ENUM('enseignant', 'etudiant') NOT NULL DEFAULT 'etudiant',
  date_creation    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  derniere_connexion DATETIME    NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_nom_utilisateur (nom_utilisateur),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

DROP TRIGGER IF EXISTS trg_users_date_modification_mdp;
CREATE TRIGGER trg_users_date_modification_mdp BEFORE UPDATE ON users FOR EACH ROW
SET NEW.date_modification_mdp = IF(NEW.mot_de_passe <> OLD.mot_de_passe, NOW(), OLD.date_modification_mdp);

-- un quiz appartient au prof
-- Sprint 3 : un nouveau quiz est en brouillon (caché aux étudiants)
-- Base déjà créée ? Exécuter une fois dans phpMyAdmin (onglet SQL) :
--   ALTER TABLE quiz ADD COLUMN statut ENUM('brouillon', 'publie') NOT NULL DEFAULT 'brouillon' AFTER description;
CREATE TABLE IF NOT EXISTS quiz (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  enseignant_id  INT UNSIGNED  NOT NULL,
  titre          VARCHAR(150)  NOT NULL,
  statut         ENUM('brouillon', 'publie') NOT NULL DEFAULT 'brouillon',
  description    TEXT          NULL,
  date_creation  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_quiz_enseignant FOREIGN KEY (enseignant_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- une question appartient à un quiz (QCM ou Vrai/Faux)
CREATE TABLE IF NOT EXISTS questions (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  quiz_id        INT UNSIGNED  NOT NULL,
  enonce         TEXT          NOT NULL,
  type           ENUM('qcm', 'vrai_faux') NOT NULL,
  date_creation  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quiz (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- une réponse possible appartient à une question (max 5, une seule correcte)
CREATE TABLE IF NOT EXISTS reponses (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  question_id    INT UNSIGNED  NOT NULL,
  texte          VARCHAR(255)  NOT NULL,
  est_correcte   BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  CONSTRAINT fk_reponses_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- un jeton pour réinitialiser le mot de passe par courriel (valide 30 min, usage unique)
 CREATE TABLE IF NOT EXISTS password_resets (
   id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
   user_id        INT UNSIGNED  NOT NULL,
   token_hash     CHAR(64)      NOT NULL,
   expire_le      DATETIME      NOT NULL,
   utilise        BOOLEAN       NOT NULL DEFAULT FALSE,
   date_creation  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id),
   UNIQUE KEY uq_reset_token (token_hash),
   CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
 ) ENGINE=InnoDB;

-- côté étudiant
-- Table des soumissions des étudiants
CREATE TABLE soumissions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT UNSIGNED NOT NULL,
    quiz_id INT UNSIGNED NOT NULL,
    date_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (etudiant_id) REFERENCES users(id),
    FOREIGN KEY (quiz_id) REFERENCES quiz(id)
);

-- Table des réponses soumises par les étudiants
CREATE TABLE reponses_etudiants (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    soumission_id INT UNSIGNED NOT NULL,
    question_id INT UNSIGNED NOT NULL,
    reponse_id INT UNSIGNED NOT NULL,

    FOREIGN KEY (soumission_id) REFERENCES soumissions(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (reponse_id) REFERENCES reponses(id)
);
