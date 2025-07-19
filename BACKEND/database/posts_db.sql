  # Host: localhost  (Version 5.5.5-10.4.11-MariaDB)
  # Date: 2024-01-08 21:09:30 posts_db
  # Generator: MySQL-Front 6.1  (Build 1.26)


  #
  # Structure for table "persona"
  #

  DROP TABLE IF EXISTS `persona`;
  CREATE TABLE `persona` (
    `ci` int(11) NOT NULL,
    `nombres` varchar(30) DEFAULT NULL,
    `paterno` varchar(30) DEFAULT NULL,
    `materno` varchar(30) DEFAULT NULL,
    `telefono` int(11) DEFAULT NULL,
    `correo` varchar(40) DEFAULT NULL,
    `avatar` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`ci`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  #
  # Data for table "persona"
  #

  INSERT INTO `persona` VALUES (1,'Juan','Perez','Gomez',123456789,'juan@example.com',X'61766174617231'),(2,'Maria','Gonzalez','Lopez',987654321,'maria@example.com',X'61766174617232'),(3,'Carlos','Lopez','Fernandez',147258369,'carlos@example.com',X'61766174617233'),(4,'Ana','Martinez','Rodriguez',369258147,'ana@example.com',X'61766174617234'),(5,'Pedro','Sanchez','Perez',321654987,'pedro@example.com',X'61766174617235'),(6,'Laura','Diaz','Garcia',456123789,'laura@example.com',X'61766174617236'),(7,'Diego','Rodriguez','Sanchez',789456123,'diego@example.com',X'61766174617237'),(8,'Sofia','Romero','Lopez',852369147,'sofia@example.com',X'61766174617238'),(9,'Pablo','Hernandez','Gomez',369147258,'pablo@example.com',X'61766174617239'),(10,'Elena','Alvarez','Fernandez',963852741,'elena@example.com',X'6176617461723130');

  #
  # Structure for table "usuario"
  #

  DROP TABLE IF EXISTS `usuario`;
  CREATE TABLE `usuario` (
    `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
    `persona_ci` int(11) NOT NULL,
    `usuario` varchar(15) UNIQUE DEFAULT NULL,
    `pass` varchar(255) DEFAULT NULL,
    `rol` varchar(10) DEFAULT 'user',
    PRIMARY KEY (`id_usuario`),
    KEY `usuario_FKIndex1` (`persona_ci`),
    KEY `IFK_Rel_01` (`persona_ci`),
    CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`persona_ci`) REFERENCES `persona` (`ci`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  ALTER TABLE `usuario`
  MODIFY `rol` varchar(10) DEFAULT 'user';

  ALTER TABLE `persona`
  ADD COLUMN `avatar_id` VARCHAR(255) DEFAULT NULL;

  #
  # Data for table "usuario"
  #

  INSERT INTO `usuario` VALUES (1,1,'usuario1','pass1','usuario'),(2,2,'usuario2','pass2','usuario'),(3,3,'usuario3','pass3','usuario'),(4,4,'usuario4','pass4','usuario'),(5,5,'usuario5','pass5','usuario'),(6,6,'usuario6','pass6','usuario'),(7,7,'usuario7','pass7','usuario'),(8,8,'usuario8','pass8','superusuar'),(9,9,'usuario9','pass9','superusuar'),(10,10,'usuario10','pass10','superusuar');

  #
  # Structure for table "notas"
  #

  DROP TABLE IF EXISTS `notas`;
  CREATE TABLE `notas` (
    `id_nota` int(11) NOT NULL AUTO_INCREMENT,
    `usuario_id_usuario` int(11) NOT NULL,
    `titulo` varchar(50) DEFAULT NULL,
    `descripcion` varchar(100) DEFAULT NULL,
    `fechaPost` date DEFAULT NULL,
    `jsonData` json DEFAULT NULL,
    PRIMARY KEY (`id_nota`),
    KEY `notas_FKIndex1` (`usuario_id_usuario`),
    KEY `IFK_Rel_02` (`usuario_id_usuario`),
    CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  #
  # Data for table "notas"
  #
  -- `imagenes` varchar(255) DEFAULT NULL,
  INSERT INTO `notas` (`id_nota`, `usuario_id_usuario`, `titulo`, `descripcion`, `fechaPost`, `jsonData`) VALUES (1, 1, 'titulo1', 'descripcion1', '2023-01-01', NULL),(2, 2, 'titulo2', 'descripcion2', '2023-02-02', NULL),(3, 3, 'titulo3', 'descripcion3', '2023-03-03', NULL),(4, 4, 'titulo4', 'descripcion4', '2023-04-04', NULL),(5, 5, 'titulo5', 'descripcion5', '2023-05-05', NULL),(6, 6, 'titulo6', 'descripcion6', '2023-06-06', NULL),(7, 7, 'titulo7', 'descripcion7', '2023-07-07', NULL),(8, 8, 'titulo8', 'descripcion8', '2023-08-08', NULL),(9, 9, 'titulo9', 'descripcion9', '2023-09-09', NULL),(10, 10, 'titulo10', 'descripcion10', '2023-10-10', NULL);
  -- INSERT INTO `notas` VALUES (1,1,'titulo1','tema1','descripcion1','imagen1','2023-01-01'),(2,2,'titulo2','tema2','descripcion2','imagen2','2023-02-02'),(3,3,'titulo3','tema3','descripcion3','imagen3','2023-03-03'),(4,4,'titulo4','tema4','descripcion4','imagen4','2023-04-04'),(5,5,'titulo5','tema5','descripcion5','imagen5','2023-05-05'),(6,6,'titulo6','tema6','descripcion6','imagen6','2023-06-06'),(7,7,'titulo7','tema7','descripcion7','imagen7','2023-07-07'),(8,8,'titulo8','tema8','descripcion8','imagen8','2023-08-08'),(9,9,'titulo9','tema9','descripcion9','imagen9','2023-09-09'),(10,10,'titulo10','tema10','descripcion10','imagen10','2023-10-10');

  -- ALTER TABLE `notas`
  -- ADD COLUMN `imagen_id` VARCHAR(255) DEFAULT NULL;

  #
  # Structure for table "notas_publicadas"
  #

  -- DROP TABLE IF EXISTS `notas_publicadas`;
  -- CREATE TABLE `notas_publicadas` (
  --   `notas_id_nota` int(11) NOT NULL,
  --   `usuario_id_usuario` int(11) NOT NULL,
  --   `fechaPub` date DEFAULT NULL,
  --   `nroLikes` int(11) DEFAULT NULL,
  --   `nroDislikes` int(11) DEFAULT NULL,
  --   PRIMARY KEY (`notas_id_nota`,`usuario_id_usuario`),
  --   KEY `notas_has_usuario_FKIndex1` (`notas_id_nota`),
  --   KEY `notas_has_usuario_FKIndex2` (`usuario_id_usuario`),
  --   KEY `IFK_Rel_03` (`notas_id_nota`),
  --   KEY `IFK_Rel_04` (`usuario_id_usuario`),
  --   CONSTRAINT `notas_publicadas_ibfk_1` FOREIGN KEY (`notas_id_nota`) REFERENCES `notas` (`id_nota`),
  --   CONSTRAINT `notas_publicadas_ibfk_2` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
  -- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  DROP TABLE IF EXISTS `notas_publicadas`;
  CREATE TABLE `notas_publicadas` (
    `id_publicacion` int(11) NOT NULL AUTO_INCREMENT,
    `notas_id_nota` int(11) NOT NULL,
    `usuario_id_usuario` int(11) NOT NULL,
    `fechaPub` date DEFAULT NULL,
    PRIMARY KEY (`id_publicacion`),
    UNIQUE KEY `notas_has_usuario_FKIndex1` (`notas_id_nota`),
    CONSTRAINT `notas_publicadas_ibfk_1` FOREIGN KEY (`notas_id_nota`) REFERENCES `notas` (`id_nota`),
    CONSTRAINT `notas_publicadas_ibfk_2` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  #
  # Data for table "notas_publicadas"
  #

  INSERT INTO `notas_publicadas` (`notas_id_nota`, `usuario_id_usuario`, `fechaPub`) VALUES 
  (1,1,'2023-01-01'),
  (2,2,'2023-02-02'),
  (3,3,'2023-03-03'),
  (4,4,'2023-04-04'),
  (5,5,'2023-05-05'),
  (6,6,'2023-06-06'),
  (7,7,'2023-07-07'),
  (8,8,'2023-08-08'),
  (9,9,'2023-09-09'),
  (10,10,'2023-10-10');


  CREATE TABLE `popularidad` (
    `id_publicacion` int(11) NOT NULL,
    `id_usuario` int(11) NOT NULL,
    PRIMARY KEY (`id_publicacion`, `id_usuario`),
    CONSTRAINT `popularidad_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `notas_publicadas` (`id_publicacion`) ON DELETE CASCADE,
    CONSTRAINT `popularidad_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


  CREATE TABLE `comentarios` (
    `id_comentario` int(11) NOT NULL AUTO_INCREMENT,
    `id_publicacion` int(11) NOT NULL,
    `id_usuario` int(11) NOT NULL,
    `comment` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id_comentario`),
    KEY `comentarios_FKIndex1` (`id_publicacion`),
    KEY `comentarios_FKIndex2` (`id_usuario`),
    CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_publicacion`) REFERENCES `notas_publicadas` (`id_publicacion`) ON DELETE CASCADE,
    CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  ALTER TABLE `comentarios`
  ADD COLUMN `fechaPub` DATETIME DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE `refresh_tokens` (
  `token_id` varchar(36) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_refresh_tokens_user` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `usuario` (`usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

  -- Crea la tabla de imágenes asociadas a notas
  -- CREATE TABLE `imagen_nota` (
  --   `id_imagen` varchar(255) NOT NULL,
  --   `id_nota` int(11) NOT NULL,
  --   `url` varchar(255) NOT NULL,
  --   `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  --   PRIMARY KEY (`id_imagen`),
  --   CONSTRAINT `imagen_nota_ibfk_1` FOREIGN KEY (`id_nota`) REFERENCES `notas` (`id_nota`)
  -- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


  -- drop table comentarios ;
  -- drop table popularidad ;
  -- drop table notas_publicadas ;
  -- drop table imagen_nota  ;
  -- drop table notas ;
  -- drop table usuario  ;
  -- drop table persona  ;