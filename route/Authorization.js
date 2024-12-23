const express = require('express');
const exec = require('../sqlServices/sql.js')
const Authorization = express.Router();
const bcrypt = require('bcrypt');
/**
 * 1.登录
 * @param {user_emial : String} 
 * @param {user_password : String}
 * @return {Number} 200|20001
 */
Authorization.post('/login', async (req, res) => {
    try {
        let { user_email, user_password } = req.body
        // console.log(await bcrypt.hash(user_password, 10));
        const result = await exec('SELECT * FROM USERS WHERE user_email=?', [user_email])
        console.log(111111, result);
        if (result.data.length > 0) {
            console.log('????????');

            const { user_id, user_email, user_password: storedPasswordHash } = result.data[0];
            const a = await bcrypt.hash(user_password, 10);
            console.log(user_password, storedPasswordHash, a);

            const isPasswordCorrect = await bcrypt.compare(user_password, storedPasswordHash)
            // const isPasswordCorrect = true
            console.log(2222222, isPasswordCorrect);

            if (isPasswordCorrect) {
                result.data.code = 200
                res.user = {
                    user_email: user_email,
                    user_id: user_id
                }
                req.session.loggedIn = true;
                req.session.cookie.maxAge = 1000 * 60 * 60;
                return res.send(result);
            } else {
                res.send({
                    code: 0,
                    data: null,
                    message: '密码错误'
                });
            }
        } else {
            console.log('3333');
            res.send({
                code: 0,
                data: null,
                message: '用户不存在'
            });
        }
    } catch (error) {
        res.send(error)
    }
})
/**
 * @param {user_email : String}
 * @param {user_password : String}
 * { data:0 }，账号已存在 || { data:1 }，注册成功
 */
Authorization.post('/register', async (req, res) => {
    try {
        const { user_email, user_password } = req.body
        const existResult = await exec('SELECT * FROM USERS WHERE user_email=?', [user_email])
        // 账号是否存在
        if (existResult.data.length > 0) {
            existResult.data = 0
            res.send({
                code: 0,
                data: 0,
                message: '账号已存在'
            })
        } else {
            const storedPasswordHash = await bcrypt.hash(user_password, 10);
            const result = await exec('INSERT INTO USERS (user_email,user_password) VALUES (?,?)', [user_email, storedPasswordHash])
            res.send(result)
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