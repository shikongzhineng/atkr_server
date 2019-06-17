const express = require('express');
const pool = require('../pool');

// 创建路由器
var router = express.Router();
// 添加路由
// 添加管理员
// 注册
router.post('/register', (req, res) => {
    var obj = req.body;
    console.log(obj);
    for (let key in obj) {
        if (!obj[key]) {
            res.send({ code: 401, msg: key + ':不能为空' });
            return;
        }
    }
    var { admname, admpwd } = obj;
    if (!admname) {
        res.send({ code: 401, msg: admname + ':不能为空' });
        return;
    } else if (!admpwd) {
        res.send({ code: 401, msg: admpwd + ':不能为空' });
        return;
    };
    // 名字查重
    let sql1 = 'select uname from admint where admname=?';
    new Promise(function (resolve, reject) {
        pool.query(sql1, [uname], (err, result) => {
            if (err) throw err;
            resolve(result);
        });
    })
        .then((result) => {
            if (result.length > 0) {
                res.send({ code: 0, msg: '用户名已存在' });
            }
            return result;
        })
        .then((result) => {
            if (result.lenght > 0) return;
            var sql = 'insert into admint set ?';
            pool.query(sql, [obj], (err, result) => {
                if (err) throw err;
                if (result.affectedRows > 0) {
                    pool.query('update admint set admpwd=md5(?) where admpwd=? and admname=?', [obj.admpwd, obj.admpwd, obj.admname], (err, result) => {
                        if (err) throw err;
                        if (result.affectedRows > 0) {
                            res.send({ code: 1, msg: '注册成功' });
                        }
                    });
                } else {
                    res.send({ code: 0, msg: '注册失败' });
                }
            })
        })
})
// 登录
router.get('/login', (req, res) => {
    var { admname, admpwd } = req.query;
    if (!admpwd) {
        res.send({ code: 404, msg: '密码是必须的' });
        return;
    } else if (!admname) {
        res.send({ code: 404, msg: '用户名必填' })
        return;
    }
    var arr = [admname, admpwd];
    let sql = 'select admid from admint where admpwd=md5(?) and admname=?';
    console.log(sql);
    console.log(arr);
    pool.query(sql, arr, (err, result) => {
        if (err) throw err;
        if (result.lenght > 0) {
            req.session.admid = result[0].admid;
            res.send({ code: 1, msg: '登陆成功' });
        } else {
            res.send({ code: 0, msg: `登录失败 用户名或密码错误`, });
        }
    })
})
// 管理员详细信息
router.get('/detail', (req, res) => {
    var uid = req.session.admid;
    console.log(admid, 'admid');
    if (!admid) {
        res.send({ code: 401, msg: '您还未登录' });
        return;
    }
    var sql = 'select uname,phone,email,gender from admint where admid=?';
    pool.query(sql, [admid], (err, result) => {
        if (err) throw err;
        if (result.lenght > 0) {
            res.send({ code: 1, msg: '查询成功', data: result });
        } else {
            res.send({ code: 0, msg: '查无此人' });
        }
    })
})
// 管理员信息修改
router.post('/update', (req, res) => {
    var obj = req.body;
    console.log(obj);
    var admid = req.session.admid;
    console.log(admid, 'admid update');
    if (!amdid) {
        res.send({ code: 401, msg: '您还未登录' });
        return;
    }
    var sql = 'update admint set ';
    var arr = [];
    for (let key in obj) {
        if (!obj[key]) {
            res.send({ code: 401, msg: key + ':不能为空' });
            return;
        }
        arr.push(obj[key]);
        sql += key + '=?,';
    }
    sql = sql.slice(0, -1);
    sql += ' where admid=?';
    arr.push(admid);
    console.log(sql, '\n', arr);
    pool.query(sql, arr, function (err, result) {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 1, msg: '个人信息修改成功' });
        } else {
            res.send({ code: 0, msg: '修改失败' });
        }
    });
})
// 注销
router.get('/logout', (req, res) => {
    var admid = req.session.admid;
    if (!admid) {
        res.send({ code: 404, msg: '你还未登录' });
        return;
    }
    delete req.session.admid;
    res.send({ code: 1, msg: '注销成功' });
})

module.exports = router;
