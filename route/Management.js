const path = require('path');
const express = require('express');
const exec = require('../sqlServices/sql.js')
const Management = express.Router();
const { Dicts } = require('../sqlServices/sequelize.js')
const { DictsCategory } = require('../sqlServices/sequelize.js');

//dicts
Management.post('/addDicts', async (req, res) => {
    try {
        // const { dicts_name } = req.body
        const result = await Dicts.create(req.body);
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
// Management.post('/getDicts', async (req, res) => {
//     try {
//         const result = await Dicts.findAll({
//             order: [
//                 ['dicts_id', 'ASC']         // 按 name 升序排序
//             ]
//         });
//         res.send({
//             code: 200,
//             data: result
//         });
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/getDictsDetail', async (req, res) => {
//     try {
//         const result = await Dicts.findByPk(req.body.dicts_id);
//         if (result) {
//             res.send({
//                 code: 200,
//                 data: result
//             });
//         } else {
//             res.send({
//                 code: 0,
//                 message: 'detail not found'
//             });
//         }
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/updateDicts', async (req, res) => {
//     try {
//         const { dicts_id, dicts_name } = req.body

//         const result = await Dicts.update({
//             dicts_name: dicts_name,
//         }, {
//             where: {
//                 dicts_id: dicts_id
//             }
//         });
//         console.log(result);

//         if (result[0] > 0) {
//             res.send({
//                 code: 200,
//                 data: result
//             });
//         } else {
//             res.send({
//                 code: 0,
//                 message: 'update error'
//             });
//         }

//     } catch (error) {
//         if (error.original.errno == 1062) {
//             res.send({
//                 code: 0,
//                 message: '重复值错误'
//             });
//             return
//         }
//         // console.log(error, error.original.errno);
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/deleteDicts', async (req, res) => {
//     try {
//         const result = await Dicts.destroy({
//             where: {
//                 dicts_id: req.body.dicts_id
//             }
//         });
//         res.send({
//             code: 200,
//             data: result
//         });
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })
// //dicts_category
// Management.post('/getCategoryDetail', async (req, res) => {
//     try {
//         const result = await DictsCategory.findByPk(req.body.category_id);
//         res.send({
//             code: 200,
//             data: result
//         });
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/getDictsCategory', async (req, res) => {
//     try {
//         const result = await DictsCategory.findAll({
//             order: [
//                 ['category_id', 'ASC']         // 按 name 升序排序
//             ],
//             where: {
//                 dicts_id: req.body.dicts_id ? req.body.dicts_id : ''
//             }
//         });
//         res.send({
//             code: 200,
//             data: result
//         });
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/addDictsCategory', async (req, res) => {
//     try {
//         const { dicts_id, category_name } = req.body
//         const result = await DictsCategory.create({ dicts_id, category_name });
//         if (result) {
//             res.send({
//                 code: 200
//             });
//         } else {
//             res.send({
//                 code: 0,
//                 message: '添加失败'
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error.original);

//     }
// })
// Management.post('/updateDictsCategory', async (req, res) => {
//     try {
//         const { category_id, category_name } = req.body

//         const result = await Dicts.update({
//             category_name: category_name,
//         }, {
//             where: {
//                 category_id: category_id
//             },
//         });
//         if (result[0] > 0) {
//             res.send({
//                 code: 200,
//                 data: result
//             });
//         } else {
//             res.send({
//                 code: 0,
//                 message: 'update error'
//             });
//         }

//     } catch (error) {
//         if (error.original.errno == 1062) {
//             res.send({
//                 code: 0,
//                 message: '重复值错误'
//             });
//             return
//         }
//         // console.log(error, error.original.errno);
//         res.status(500).send(error.original);
//     }
// })
// Management.post('/deleteCategory', async (req, res) => {
//     try {
//         const result = await DictsCategory.destroy({
//             where: {
//                 category_id: req.body.category_id
//             }
//         });
//         res.send({
//             code: 200,
//             data: result
//         });
//     } catch (error) {
//         res.status(500).send(error.original);
//     }
// })

// 表的通用增删改查接口，param:驼峰表名
const doAutoRPC = (RPCconfig) => {
    function doEval(str, modelName, rpcName, self) {
        eval(str)
        console.log(`RPC(${modelName},${self.rpcCount++})->"${rpcName}"`);
    }
    function autoRPC(model, linkModel) {
        if (!model) throw new Error('Model not found')
        this.rpcCount = 1
        const modelName = model.name;
        const linkModelName = linkModel?.name;
        const F_pk = model.primaryKeyField;
        const F_fk = linkModel?.primaryKeyField
        //get 1.[no param,get all],2.[param1:fk,find by fk]
        const execCode_1 = `${moduleName}.post('/get${modelName}', async (req, res) => {
            try {
                let result = {};
                const Body_id = req.body.id;
                const Body_fk = req.body.fk;
                ${linkModel ?
                `       
                        if(Body_fk){
                            result = await ${modelName}.findAll({
                                order: [
                                    ['${F_pk}', 'ASC']         // 按 name 升序排序
                                ],
                                where: {
                                    ${F_fk}: Body_fk
                                }
                            });
                            res.send({
                                code: 200,
                                data: result
                            });
                        }else if(Body_id){
                            result = await ${modelName}.findByPk(Body_id);
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
                        }else{
                            res.send({
                                code: 0,
                                message: 'param lack of id/pk'
                            });
                        }
                                
                    `
                :
                `       
                        if(!Body_id){
                            result = await ${modelName}.findAll({
                                 order: [
                                    ['${F_pk}', 'ASC']
                                ]
                            });
                            res.send({
                                code: 200,
                                data: result
                            });
                        }else{
                            result = await ${modelName}.findByPk(Body_id);
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
                        }
                                
                    `
            }
            } catch (error) {
                res.status(500).send(error.original);
            }
        });`
        doEval(execCode_1, modelName, `/get${modelName}`, this)
        //add
        const execCode_2 = `${moduleName}.post('/add${modelName}', async (req, res) => {
            try {
                let result = {};
                const Body_id = req.body.id;
                const Body_fk = req.body.fk;
                console.log(123123123);
                ${linkModel ?
                `   
                    if(!Body_fk){
                        res.send({
                            code: 0,
                            message: 'no fk'
                        });
                    }
                    debugger;
                    let newResult = {
                        ${F_fk}: Body_fk,
                        ...req.body
                    }
                    delete newResult.pk
                    result = await ${modelName}.create(newResult);
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
                `
                :
                `
                    result = await ${modelName}.create(req.body);
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
                `
            }
            } catch (error) {
                res.status(500).send(error.original);
            }
        });`
        doEval(execCode_2, modelName, `/add${modelName}`, this)
        //update
        const execCode_3 = `${moduleName}.post('/update${modelName}', async (req, res) => {
            try {
                let result = {};
                const Body_id = req.body.id;
                if(!Body_id){
                    res.send({
                        code: 0,
                        message: 'no id'
                    });
                }
                let newResult = {
                    ...req.body
                }
                delete newResult.id
                result = await ${modelName}.update(newResult, {
                    where: {
                        ${F_pk}: Body_id
                    },
                });
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
                res.status(500).send(error.original);
            }
        });`
        doEval(execCode_3, modelName, `/update${modelName}`, this);
        //delete
        const execCode_4 = `${moduleName}.post('/delete${modelName}', async (req, res) => {
            try {
                const Body_id = req.body.id;
                const result = await ${modelName}.destroy({
                    where: {
                        ${F_pk}: Body_id
                    }
                });
                res.send({
                    code: 200,
                    data: result
                });
            } catch (error) {
                res.status(500).send(error.original);
            }
        });`
        doEval(execCode_4, modelName, `/delete${modelName}`, this);
    }
    const moduleName = path.basename(__filename).replace(/\.js$/, '');
    RPCconfig.forEach((i) => {
        if (!i) return
        //处理主表
        const model = i.model
        autoRPC(model)
        //处理子表
        const linkModel = i.link
        autoRPC(linkModel, model)

    })
}
const RPCconfig = [{
    model: Dicts,
    link: DictsCategory
}]
doAutoRPC(RPCconfig)
console.log(Dicts, 123, path.basename(__filename));

module.exports = Management;