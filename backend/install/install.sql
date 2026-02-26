CREATE DATABASE IF NOT EXISTS test DEFAULT CHARACTER SET utf8mb4;
USE test;

CREATE TABLE IF NOT EXISTS `role` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `menu` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `path` VARCHAR(100) NOT NULL COMMENT '路由地址',
  `pid` INT DEFAULT 0 COMMENT '父级ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '账号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `role_id` INT DEFAULT NULL COMMENT '角色ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始化数据
INSERT INTO `role` (`name`) VALUES ('超级管理员');
INSERT INTO `menu` (`title`, `path`, `pid`) VALUES 
('用户管理', '/user', 0),
('角色管理', '/role', 0),
('菜单管理', '/menu', 0);

-- 管理员账号：admin 密码：admin123
INSERT INTO `user` (`username`, `password`, `role_id`) 
VALUES ('admin', '$2a$10$ZJygGH8M/l/ND3yGdR5bUepeh0tXbJfGGmZJ5H0GdNnH1G8dQaS1i', 1);