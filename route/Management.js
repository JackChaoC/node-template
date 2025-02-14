const express = require('express');
const exec = require('../sqlServices/sql.js')
const Management = express.Router();
const { Dicts } = require('../sqlServices/sequelize.js')
const { DictsCategory } = require('../sqlServices/sequelize.js');

//dicts
Management.post('/addDicts', async (req, res) => {
    try {
        const { dicts_name } = req.body
        const result = await Dicts.create({ dicts_name: dicts_name });
        if (result) {
            res.send({
                code: 200
            });
        } else {
            res.send({
                code: 0,
                message: '添加失败'
            });
        }
    } catch (error) {
        res.status(500).send(error.original);
    }
})
Management.get('/getDicts', async (req, res) => {
    try {
        const result = await Dicts.findAll({
            order: [
                ['dicts_id', 'ASC']         // 按 name 升序排序
            ]
        });
        res.send({
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).send(error.original);
    }
})
Management.post('/getDictsDetail', async (req, res) => {
    try {
        const result = await Dicts.findByPk(req.body.dicts_id);
        if (result) {
            res.send({
                code: 200,
                data: result
            });
        } else {
            res.send({
                code: 0,
                message: 'detail not found'
            });
        }
    } catch (error) {
        res.status(500).send(error.original);
    }
})
Management.post('/updateDicts', async (req, res) => {
    try {
        const { dicts_id, dicts_name } = req.body

        const result = await Dicts.update({
            dicts_name: dicts_name,
        }, {
            where: {
                dicts_id: dicts_id
            }
        });
        console.log(result);

        if (result[0] > 0) {
            res.send({
                code: 200,
                data: result
            });
        } else {
            res.send({
                code: 0,
                message: 'update error'
            });
        }

    } catch (error) {
        if (error.original.errno == 1062) {
            res.send({
                code: 0,
                message: '重复值错误'
            });
            return
        }
        // console.log(error, error.original.errno);
        res.status(500).send(error.original);
    }
})
Management.post('/deleteDicts', async (req, res) => {
    try {
        const result = await Dicts.destroy({
            where: {
                dicts_id: req.body.dicts_id
            }
        });
        res.send({
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).send(error.original);
    }
})
//dicts_category
Management.post('/getCategoryDetail', async (req, res) => {
    try {
        const result = await DictsCategory.findByPk(req.body.category_id);
        res.send({
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).send(error.original);
    }
})
Management.post('/getDictsCategory', async (req, res) => {
    console.log(1231312312);
    
    try {
        const result = await DictsCategory.findAll({
            order: [
                ['category_id', 'ASC']         // 按 name 升序排序
            ],
            where: {
                dicts_id: req.body.dicts_id ? req.body.dicts_id : ''
            }
        });
        res.send({
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).send(error.original);
    }
})

Management.post('/addDictsCategory', async (req, res) => {
    try {
        const { dicts_id, category_name } = req.body
        const result = await DictsCategory.create({ dicts_id, category_name });
        if (result) {
            res.send({
                code: 200
            });
        } else {
            res.send({
                code: 0,
                message: '添加失败'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.original);

    }
})
Management.post('/updateDictsCategory', async (req, res) => {
    try {
        const { dicts_id, category_name } = req.body
        const result = await DictsCategory.create({ dicts_id, category_name });
        if (result) {
            res.send({
                code: 200
            });

        } else {
            res.send({
                code: 0,
                message: '添加失败'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.original);

    }
})
Management.post('/deleteCategory', async (req, res) => {
    try {
        const result = await DictsCategory.destroy({
            where: {
                category_id: req.body.category_id
            }
        });
        res.send({
            code: 200,
            data: result
        });
    } catch (error) {
        res.status(500).send(error.original);
    }
})


module.exports = Management;