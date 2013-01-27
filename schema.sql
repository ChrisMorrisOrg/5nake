DROP TABLE IF EXISTS `plays`;
CREATE TABLE `plays` (
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `difficulty` int(8) DEFAULT NULL,
  `score` int(8) unsigned DEFAULT '0',
  `version` varchar(32) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
