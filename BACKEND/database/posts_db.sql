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
  `avatar` longblob DEFAULT NULL,
  PRIMARY KEY (`ci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `rol` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `usuario_FKIndex1` (`persona_ci`),
  KEY `IFK_Rel_01` (`persona_ci`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`persona_ci`) REFERENCES `persona` (`ci`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `titulo` varchar(30) DEFAULT NULL,
  `tema` varchar(30) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `imagenes` varchar(100) DEFAULT NULL,
  `fechaPost` date DEFAULT NULL,
  PRIMARY KEY (`id_nota`),
  KEY `notas_FKIndex1` (`usuario_id_usuario`),
  KEY `IFK_Rel_02` (`usuario_id_usuario`),
  CONSTRAINT `notas_ibfk_1` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "notas"
#

INSERT INTO `notas` VALUES (1,1,'titulo1','tema1','descripcion1','imagen1','2023-01-01'),(2,2,'titulo2','tema2','descripcion2','imagen2','2023-02-02'),(3,3,'titulo3','tema3','descripcion3','imagen3','2023-03-03'),(4,4,'titulo4','tema4','descripcion4','imagen4','2023-04-04'),(5,5,'titulo5','tema5','descripcion5','imagen5','2023-05-05'),(6,6,'titulo6','tema6','descripcion6','imagen6','2023-06-06'),(7,7,'titulo7','tema7','descripcion7','imagen7','2023-07-07'),(8,8,'titulo8','tema8','descripcion8','imagen8','2023-08-08'),(9,9,'titulo9','tema9','descripcion9','imagen9','2023-09-09'),(10,10,'titulo10','tema10','descripcion10','imagen10','2023-10-10');

#
# Structure for table "notas_publicadas"
#

DROP TABLE IF EXISTS `notas_publicadas`;
CREATE TABLE `notas_publicadas` (
  `notas_id_nota` int(11) NOT NULL,
  `usuario_id_usuario` int(11) NOT NULL,
  `fechaPub` date DEFAULT NULL,
  `nroLikes` int(11) DEFAULT NULL,
  `nroDislikes` int(11) DEFAULT NULL,
  PRIMARY KEY (`notas_id_nota`,`usuario_id_usuario`),
  KEY `notas_has_usuario_FKIndex1` (`notas_id_nota`),
  KEY `notas_has_usuario_FKIndex2` (`usuario_id_usuario`),
  KEY `IFK_Rel_03` (`notas_id_nota`),
  KEY `IFK_Rel_04` (`usuario_id_usuario`),
  CONSTRAINT `notas_publicadas_ibfk_1` FOREIGN KEY (`notas_id_nota`) REFERENCES `notas` (`id_nota`),
  CONSTRAINT `notas_publicadas_ibfk_2` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "notas_publicadas"
#

INSERT INTO `notas_publicadas` VALUES (1,1,'2023-01-01',20,5),(2,2,'2023-02-02',15,3),(3,3,'2023-03-03',18,2),(4,4,'2023-04-04',25,7),(5,5,'2023-05-05',30,4),(6,6,'2023-06-06',12,1),(7,7,'2023-07-07',28,6),(8,8,'2023-08-08',22,8),(9,9,'2023-09-09',16,2),(10,10,'2023-10-10',21,5);
