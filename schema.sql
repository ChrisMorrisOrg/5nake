# Compatible for versions up to and including v1.1.200

DROP TABLE IF EXISTS `plays`;
CREATE TABLE `plays` (
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `difficulty` int(8) DEFAULT NULL,
  `score` int(8) unsigned DEFAULT '0',
  `version` varchar(32) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


# The following alterations are required for v1.1.201 and beyond

ALTER TABLE plays ADD COLUMN snake_weight INT(3) DEFAULT 10;
ALTER TABLE plays ADD COLUMN canvas_width INT(5) DEFAULT 430;
ALTER TABLE plays ADD COLUMN canvas_height INT(5) DEFAULT 310;


# The following alterations are required for v1.1.203 and beyond

ALTER TABLE plays ADD COLUMN screenshot TEXT;