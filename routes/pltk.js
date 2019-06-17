const express = require('express');
const pool = require('../pool.js');
// 创建路由器
var router = express.Router();
// 添加路由
// 提交机票订单
router.post('/add', (req, res) => {
    var { uid } = req.session;
    if (!uid) {
        res.send({ code: 401, msg: '您还未登录' });
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
    obj.uid=uid;
    var sql = 'INSERT INTO pltk set ?';
    console.log(sql,'\n',[obj]);
    pool.query(sql, [obj], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 1, msg: '订单已提交' });
        } else {
            res.send({ code: 0, msg: '订单提交失败' });
        }
    })
})

// 查询已购机票
router.get('/query', (req, res) => {
    var { uid } = req.session;
    console.log(uid, 'pltk-query uid');
    var data = [];
    if (uid) {
        var sql = 'select id,name,phone,gender,tkn,stime,price,tid,fid from pltk where uid=?';
        pool.query(sql, [uid], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let length = result.length;
                result.forEach((elem, i) => {
                    let obj = elem;
                    var fid = obj.fid;
                    console.log(fid, 'fid pltk-query');
                    delete obj.fid;
                    var sql = 'select saddr,taddr,sap,tap,fln,ytime,ystime,yetime,date from flight where fid=?';
                    // console.log(sql);
                    pool.query(sql, [fid], (err, result) => {
                        if (err) throw err;
                        if (result.length > 0) {
                            let o = Object.assign(obj, result[0]);
                            data.push(o);
                            // console.log(data[data.length - 1],i,'iiiiiii');
                            if (i >= length - 1) {
                                console.log(data);
                                console.log(i, 'iend', length - 1);
                                res.send({ code: 1, msg: '查询成功', data: data });
                            }
                        }else{
                            if (i >= length - 1) {
                                res.send({ code: 0, msg: '查询无果'});
                            }
                        }
                    })
                });
            } else {
                res.send({ code: 0, msg: '查询无果' });
            }
        })
    } else {
        res.send({ code: 404, msg: '用户未登录' });
    }
})
// 修改机票信息
router.post('/update', (req, res) => {
    var obj = req.body;
    var uid = req.session.uid;
    console.log(uid);
    var tkn = obj.tkn;
    var sql = 'UPDATE pltk set ';
    for (let key in obj) {
        if (!obj[key]) {
            res.send({ code: 401, msg: key + ':不能为空' });
            return;
        }
        if (key !== tkn) {
            arr.push(obj[key]);
            sql += key + '=?,';
        }
    }
    sql = sql.slice(0, -1);
    sql += ' where uid=? and tid=?';
    arr.push(uid, tkn);
    console.log(sql, '\n', arr);
    pool.query(sql, arr, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 1, msg: '机票信息修改成功' });
        } else {

        }
    })

});
// 退订机票
router.post('/delete', (req, res) => {
    var uid = req.session.uid;
    var tkn = req.body.tkn;
    if (!uid) {
        res.send({ code: '404', msg: '请登录' });
        return;
    } else if (!tkn) {
        res.send({ code: 404, msg: 'tkn必须' });
    }
    var sql = 'delete from pltk where uid=? and tkn=?';
    var arr = [uid, tkn];
    pool.query(sql, arr, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send({ code: 1, msg: '机票退订 成功' });
        } else {
            res.send({ code: 0, msg: '机票退订失败' });
        }
    })
})

module.exports = router;