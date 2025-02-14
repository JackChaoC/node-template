const express = require('express');
const exec = require('../sqlServices/sql.js')
const Test = express.Router();

/**
 * 查询列表
 * @param flag = Number， null 则降序，flag = 1 则升序
 * @param textContent = String，查询内容
 */
Test.get('/getUser', async (req, res) => {
    try {
        const sql = `SELECT * FROM USERS`
        let result = await exec(sql)
        res.send(result);
    } catch (error) {
        console.log('查询列表出错：', error);
        res.status(500).send('查询列表出错');
    }
})
Test.get('/getDicts', async (req, res) => {
    try {
        const sql = `SELECT * FROM Dicts`
        let result = await exec(sql)
        res.send(result);
    } catch (error) {
        console.log('查询列表出错：', error);
        res.status(500).send('查询列表出错');
    }
})
/**
 * 添加列表
 * @param content String 任务内容 NOT NULL
 */
Test.post('/addDicts', async (req, res) => {
    try {
        console.log(req.body);

        let issueEntity = new issue(...Object.values(req.body))
        const result = await exec(services.addList(), Object.values(issueEntity));
        res.send(result);

    } catch (error) {
        console.log('添加列表出错：', error);
        res.status(500).send('添加列表出错');
    }
})

module.exports = Test;