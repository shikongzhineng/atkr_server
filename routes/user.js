const express = require('express');
const pool = require('../pool.js');

// 创建路由器
var router = express.Router();
// 添加路由
// 用户注册
router.post('/register', (req, res) => {
    var obj = req.body;
    console.log(obj);
    for (let key in obj) {
        if (!obj[key]) {
            res.send({ code: 401, msg: key + ':不能为空' });
            return;
        }
    }
    var {uname ,upwd}= obj;
    if (!uname) {
        res.send({ code: 401, msg: uname + ':不能为空' });
        return;
    }else if (!upwd){
        res.send({ code: 401, msg: upwd + ':不能为空' });
        return;
    };
    {
        let sql1 = 'select uname from user where uname=?';
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
                console.log(result);
                if (result.length > 0) { return };
                var sql = 'insert into user set ?';
                console.log(sql);
                pool.query(sql, [obj], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        pool.query('update user set upwd=md5(?) where upwd=? and uname=?', [obj.upwd, obj.upwd, obj.uname], (err, result) => {
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
            .catch((err) => {
                console.log(err, 'err');
            })
    }
})
// 用户登录
router.get('/login', (req, res) => {
    // console.log(req.session,'user login');
    var { uname, id, phone, upwd } = req.query;
    if (!upwd) {
        res.send({ code: 404, msg: '密码是必须的' });
        return;
    }
    // console.log(upwd);
    var arr = [upwd];
    let sql = 'select uid from user where upwd=md5(?) and ';
    var str = '';
    if (uname) {
        arr.push(uname);
        str += 'uname';
    } else if (phone) {
        arr.push(phone);
        str += 'phone';
    } else if (id) {
        arr.push(id);
        str += 'id';
    }else{
        console.log(str,'str end');
        res.send({ code: 404, msg: '用户名是必须的' });
        return;
    }
    sql = sql + str + '=?'
    console.log(sql);
    console.log(arr);
    pool.query(sql, arr, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // console.log(result);
            req.session.uid = result[0].uid;
            res.send({ code: 1, msg: '登陆成功' });
        } else {
            res.send({ code: 0, msg: `登录失败 ${str}或密码错误`, });
        }
    })
})
// 用户登录
router.post('/login', (req, res) => {
    // console.log(req.session,'user login');
    console.log(req.body);
    var { uname, id, phone, upwd } = req.body;
    if (!upwd) {
        res.send({ code: 404, msg: '密码是必须的' });
        return;
    }
    // console.log(upwd);
    console.log( uname, id, phone, upwd )
    var arr = [upwd];
    let sql = 'select uid from user where upwd=md5(?) and ';
    var str = '';
    if (uname) {
        arr.push(uname);
        str += 'uname';
    } else if (phone) {
        arr.push(phone);
        str += 'phone';
    } else if (id) {
        arr.push(id);
        str += 'id';
    }else{
        console.log(str,'str end');
        res.send({ code: 404, msg: '用户名是必须的' });
        return;
    }
    sql = sql + str + '=?'
    console.log(sql);
    console.log(arr);
    pool.query(sql, arr, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            // console.log(result);
            req.session.uid = result[0].uid;
            res.send({ code: 1, msg: '登陆成功' });
        } else {
            res.send({ code: 0, msg: `登录失败 ${str}或密码错误`, });
        }
    })
})
// 用户详细信息
router.get('/detail', (req, res) => {
    var uid = req.session.uid;
    console.log(uid, 'uid');
    if (!uid) {
        res.send({ code: 401, msg: '您还未登录' });
        return;
    }
    var sql = 'select uname,phone,email,gender from user where uid=?';
    pool.query(sql, [uid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({ code: 1, msg: '查询成功', data: result });
        } else {
            res.send({ code: 0, msg: '查无此人' });
        }
    })
})
// 用户个人信息修改
router.post('/update', (req, res) => {
    var obj = req.body;
    console.log(obj);
    var uid = req.session.uid;
    console.log(uid, 'uid update');
    if (!uid) {
        res.send({ code: 401, msg: '您还未登录' });
        return;
    }
    var sql = 'update xz_user set ';
    var arr = [];
    for (let key in obj) {
        if (!obj[key]) {
            res.send({ code: 401, msg: key + ':不能为空' });
            return;
        }
        sql += key + '=?,';
        arr.push(obj[key]);
    }
    sql = sql.slice(0, -1);
    sql += ' where uid=?';
    arr.push(uid);
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
    var uid = req.session.uid;
    if (!uid) {
        res.send({ code: 404, msg: '你还未登录' });
        return;
    }
    delete req.session.uid;
    res.send({ code: 1, msg: '注销成功' });
});

module.exports = router;