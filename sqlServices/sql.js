const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'openway',
    port: 3306,
    database: 'test'
}
const pool = mysql.createPool(config);
const exec = (sql, value) => {
    return new Promise((resolve, reject) => {
        // 连接数据库
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            console.log('sql param:', value);
            connection.query(sql, value ? value : undefined, (err, result) => {
                if (err) {
                    //操作失败
                    reject(err)
                } else {
                    resolve({
                        code: 0,
                        data: result,
                        message: '操作成功'
                    })
                }
                connection.release() // 释放连接
            })


        })
    })
}
module.exports = exec