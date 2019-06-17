#
SET NAMES UTF8;
#删除数据库atrs,如果存在的话
DROP DATABASE IF EXISTS atrs;
#创建数据库
CREATE DATABASE atrs CHARSET=UTF8;
#使用数据库atrs
USE atrs;
#创建数据表user用户
CREATE TABLE user(
  uid INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(64),
  upwd VARCHAR(128),
  name VARCHAR(32),
  id CHAR(18),
  phone CHAR(11),
  email VARCHAR(32),
  gender TINYINT
);
#创建数据表administrators管理员
CREATE TABLE admint(
  admid INT PRIMARY KEY AUTO_INCREMENT,
  admname VARCHAR(64),
  admpwd VARCHAR(128),
  id CHAR(18),
  phone CHAR(11),
  email VARCHAR(32),
  gender TINYINT
);
#创建数据表pltk机票
CREATE TABLE pltk(
  tid INT PRIMARY KEY AUTO_INCREMENT,
  #票号
  tkn VARCHAR(64),
  #票价
  price DECIMAL(10,2),
  #购票时间
  stime BIGINT,
  #取票时间
  etime BIGINT,
  #订单状态
  ost TINYINT,
  #航班id
  fid INT,
  #舱位类型
  cwtp INT,
  #座位号
  seatn INT,
  #用户id
  uid INT,
  #乘机人身份证号
  id CHAR(18),
  #乘机人真实姓名
  name VARCHAR(32),
  #乘机人电话
  phone CHAR(11),
  #乘机人性别
  gender TINYINT
);

#创建数据表flight航班
CREATE TABLE flight(
  fid INT PRIMARY KEY AUTO_INCREMENT,
  #航班号
  fln VARCHAR(16),
  #出发地
  saddr VARCHAR(32),
  #目的地
  taddr VARCHAR(32),
  #出发地机场
  sap VARCHAR(32),
  #目的地机场
  tap VARCHAR(32),
  #预计飞行总时长
  ytime VARCHAR(8),
  #预计起飞时间
  ystime VARCHAR(8),
  #预计落地时间
  yetime VARCHAR(8),
  #实际起飞时间
  stime VARCHAR(8),
  #实际落地时间
  etime VARCHAR(8),
  #日期
  date BIGINT,
  #开始日期
  sdate BIGINT,
  #截止日期
  cldate BIGINT,
  #班期
  sch VARCHAR(16),
  #出发航站楼
  sat VARCHAR(8),
  #到达航站楼
  tat VARCHAR(8),
  #登机口
  bdg INT,
  #飞机型号
  amid INT,
  arct VARCHAR(16),
  #经济舱价格
  emprice DECIMAL(10,2),
  #商务舱价格
  scprice DECIMAL(10,2),
  #航班状态
  flst INT,
  #航空公司
  acid INT,
  acname VARCHAR(32)
);

#创建数据表aircom航空公司
CREATE TABLE aircom(
  acid INT PRIMARY KEY AUTO_INCREMENT,
  acname VARCHAR(32),
  addr VARCHAR(128),
  phone VARCHAR(16)
);
#创建数据表airmod飞机型号
CREATE TABLE airmod(
  amid INT PRIMARY KEY AUTO_INCREMENT,
  #飞机型号
  arct VARCHAR(16),
  #机型大小
  tps TINYINT,
  #座位数量
  #座位总数
  stc INT,
  #商务舱
  swstc VARCHAR(8),
  #经济舱
  emcstc VARCHAR(8),
  #制造商
  mf VARCHAR(32),
  #隶属的航空公司
  acid INT
);

#创建数据表

#创建数据表

#创建数据表

#创建数据表