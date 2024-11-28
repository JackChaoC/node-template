const express = require('express');
const exec = require('../sqlServices/sql.js')
const services = require('../sqlServices/services');
const ListRouter = express.Router();
const { issue } = require('../entity')

/**
 * 查询列表
 * @param flag = Number， null 则降序，flag = 1 则升序
 * @param textContent = String，查询内容
 */
ListRouter.get('/selectList/:flag?/:searchContent?', async (req, res) => {
    try {
        let flag = req.params.flag;
        let searchContent = req.params.searchContent;
        let result = await exec(services.selectList(flag, searchContent), [searchContent])
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
ListRouter.post('/addList', async (req, res) => {
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
/**
 * 删除列表
 * @param id Number 列表id NOT NULL
 */
ListRouter.post('/deleteList', async (req, res) => {
    try {
        const result = await exec(services.deleteList(), [req.body.id]);
        res.send(result);
    } catch (error) {
        console.log('删除列表出错：', error);
        res.status(500).send('删除列表出错');
    }
})
/**
 * 修改列表
 * @param id Number
 * @param state Number
 */
ListRouter.post('/updateList', async (req, res) => {
    try {
        const { state, id } = req.body;
        const result = await exec(services.updateList(), [state, id]);
        res.send(result);
    } catch (error) {
        console.log("删除更新出错", error);
        res.status(500).send('删除更新出错');

    }
})
module.exports = ListRouter;