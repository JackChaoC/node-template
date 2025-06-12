const mysql = require('mysql2');
const config = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: 3306,
    database: 'cstore'
}
const pool = mysql.createPool(config);
// 测试连接是否成功
pool.getConnection((err, connection) => {
    if (err) {
        setTimeout(() => {
            console.error('❌ 数据库连接失败:', err.message);
        }, 1000)
    } else {
        setTimeout(() => {
            console.log('✅ 数据库连接成功');
        }, 1000)
        connection.release();
    }
});
const exec = (sql, value) => {
    return new Promise((resolve, reject) => {
        // 连接数据库
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            }
            connection.query(sql, value ? value : undefined, (err, result) => {
                console.log('sql:', sql);
                console.log('sql param:', value);
                if (err) {
                    //操作失败
                    console.log('err:' + err);
                    reject(err)
                } else {
                    resolve({
                        code: 200,
                        data: result,
                        message: 'sql操作成功'
                    })
                }
                connection.release() // 释放连接
            })


        })
    })
}
module.exports = exec