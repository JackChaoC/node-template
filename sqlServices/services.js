
const services = {
    // login




    /**
     * 插入一个新的任务到 issue_lists 表中
     * 
     * @param {Object} params - 参数对象
     * @param {string} params.content - 任务内容，必须是字符串
     * @param {string} params.order_date - 任务日期时间，格式为 'YYYY-MM-DD HH:MM:SS'
     * @param {number} params.state - 任务状态，必须是整数
     * @returns {string} 返回 SQL 插入语句
     */
    addList: () => {
        return `INSERT INTO issue_lists(content,order_date,state,file_id) VALUES (?,?,?,?);`
    },
    /**
     * 
     * @param {Boolean} flag - 默认为 false，表示按 order_date 升序，true 表示按 order_date 降序
     * @returns 
    */
    selectList: (flag = false, searchContent) => {
        let sql = searchContent ? `WHERE content REGEXP ?` : '';
        return `SELECT A.*,B.filename,B.filepath 
            FROM issue_lists A 
            LEFT JOIN files B ON A.file_id = B.id  
            ${sql};`
    },
    deleteList: () => {
        return `DELETE FROM issue_lists WHERE id=?;`
    },
    updateList: () => {
        return `UPDATE issue_lists SET state = ? WHERE id = ?;`
    }
}
module.exports = services;