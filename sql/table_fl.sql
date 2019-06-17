SET NAMES UTF8;
USE atrs;
#删除数据表flight,如果存在的话
DROP TABLE IF EXISTS flight;
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