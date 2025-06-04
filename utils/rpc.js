const doAutoRPC = (router, RPCconfig) => {
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
        const execCode_1 = `router.post('/get${modelName}', async (req, res) => {
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
        const execCode_2 = `router.post('/add${modelName}', async (req, res) => {
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
        const execCode_3 = `router.post('/update${modelName}', async (req, res) => {
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
        const execCode_4 = `router.post('/delete${modelName}', async (req, res) => {
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

module.exports = {
    doAutoRPC
}