const express = require('express');
const exec = require('../sqlServices/sql.js')
const services = require('../sqlServices/services.js');
const Authorization = express.Router();
/**
 * 1.登录
 * @param flag = Number， null 则降序，flag = 1 则升序
 * @param textContent = String，查询内容
 */
Authorization.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await exec('SELECT * FROM USERS WHERE username=? AND password=?', [username, password])
        if (result.data.length) {
            const id = result.data.id;
            result.data = 1
            res.user = {
                username: username,
                id: id
            }
            req.session.loggedIn = true;
            req.session.cookie.maxAge = 1000 * 60 * 60;
            return res.send(result);
        }
        result.data = 0
        result.message = '用户名或密码错误'
        res.send(result);
    } catch (error) {
        res.send(error)
    }
})
/**
 * @param username String
 * @param password String
 * { data:0 }，账号已存在 || { data:1 }，注册成功
 */
Authorization.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        const existResult = await exec('SELECT * FROM USERS WHERE username=?', [username])
        // 账号是否存在
        if (existResult.data.length > 0) {
            existResult.data = 0
            res.send(existResult)
        } else {
            const result = await exec('INSERT INTO USERS (username,password) VALUES (?,?)', [username, password])
            result.data = 1
            if (result) res.send(result)
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})
Authorization.get('/logout', async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.send('Error logging out.');
            }
            res.send({
                code: 0,
                data: 1,
                message: '登出成功'
            });
        });
    } catch (error) {
        console.log(error);
        res.send(error);

    }
})


module.exports = Authorization;