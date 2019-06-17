const express = require('express');
const pool = require('../pool.js');
//创建路由器
var router = express.Router();

//添加路由

// 管理员
// 航班添加
router.post('/add', (req, res) => {
  var {admid}=req.session.admid;
  if (!admid){
    res.send({code:0,msg:'请登录'});
    return;
  }
  var obj = req.body;
  console.log(obj);
  for (let key in obj) {
      if (!obj[key]) {
          res.send({ code: 401, msg: key + ':不能为空' });
          return;
      }
  }
  var sql = 'insert into flight set ?';
  pool.query(sql, [obj], (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) {
          res.send({ code: 1, msg: '注册成功' });
      } else {
          res.send({ code: 0, msg: '注册失败' });
      }
  })
})
// 航班信息修改

// 用户
//航班选择
router.get('/select', (req, res) => {
  console.log(req.query);
  var { saddr, taddr, date } = req.query;
  if (saddr && taddr && date) {
    // console.log(typeof date);
    date = new Date(date);
    // console.log(date.getTime());
    date = date.getTime();
    var sql = 'select fid,fln,arct,ytime,ystime,yetime,saddr,taddr,sap,tap,emprice,scprice from flight where saddr=? and taddr=? and date=?';
    var arr=[saddr, taddr, date];
    console.log(sql);
    console.log(arr);
    pool.query(sql, arr, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length > 0) {
        res.send({ code: 1, msg: '查询成功', data: result });
      } else {
        res.send({ code: 0, msg: '查询无果' })
      }
    })
  }else{
    res.send({code:404,msg:'查询条件不正确'});
  }
});
//航班状态查询
router.get('/status', (req, res) => {
  console.log(req.query);
  var { saddr, taddr, date, fln } = req.query;
  var sql = 'select fln,flst,ystime,stime,yetime,etime,sap,tap from flight ';
  var arr = null;
  if (fln) {
    sql += 'where ?=fln';
    arr = [fln];
  } else if (saddr && taddr && date) {
    sql += 'where ?=saddr and ?=taddr and ?=date';
     date = new Date(date);
     date = date.getTime();
    arr = [saddr, taddr, date];
  } else {
    res.send({ code: 404, msg: '查询条件不正确' });
  }
  console.log(sql);
  console.log(arr);
  pool.query(sql, arr, (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.length > 0) {
      res.send({ code: 1, msg: '查询成功', data: result });
    } else {
      res.send({ code: 0, msg: '查询无果' })
    }
  })
});

module.exports = router;