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

-- un quiz appartient au prof
CREATE TABLE IF NOT EXISTS quiz (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  enseignant_id  INT UNSIGNED  NOT NULL,
  titre          VARCHAR(150)  NOT NULL,
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