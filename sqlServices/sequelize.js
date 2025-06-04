const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('cstore', 'root', 'openway', {
    dialect: 'mysql',       // 这里可以改成任意一种关系型数据库
    host: 'localhost',      // 数据库服务器
    timezone: '+08:00',     // 这里是东八区，默认为0时区
    logging: false,   // 禁用 SQL 查询日志
    pool: {                 // 使用连接池
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: console.log, 
});

// USERS 表
const Users = sequelize.define('Users', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_role: {
        type: DataTypes.STRING(50),
    },
    user_name: {
        type: DataTypes.STRING(50),
    },
    user_email: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    user_password: {
        type: DataTypes.STRING(70),
    },
}, {
    tableName: 'USERS',
    timestamps: false,  // 如果表没有时间戳字段
});

// DICTS 表
const Dicts = sequelize.define('Dicts', {
    dicts_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dicts_name: {
        type: DataTypes.STRING(50),
        unique: true,
    },
}, {
    tableName: 'DICTS',
    timestamps: false,
});

// DICTS_CATEGORY 表
const DictsCategory = sequelize.define('DictsCategory', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dicts_id: {
        type: DataTypes.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    },
    category_name: {
        type: DataTypes.STRING(50),
    },
}, {
    tableName: 'DICTS_CATEGORY',
    timestamps: false,
});

// GOODS 表
const Goods = sequelize.define('Goods', {
    goods_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    goods_name: {
        type: DataTypes.STRING(50),
    },
    goods_image: {
        type: DataTypes.STRING(100),
    },
    file_id: {
        type: DataTypes.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    },
    file_name: {
        type: DataTypes.STRING(100),
    },
    goods_storeqty: {
        type: DataTypes.INTEGER,
    },
    goods_price: {
        type: DataTypes.DECIMAL(16, 2),
    },
    category_id: {
        type: DataTypes.INTEGER,
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    },
    category_name: {
        type: DataTypes.STRING(50),
    },
    description: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'GOODS',
    timestamps: false,
    indexes: [{
        name: 'idx_GOODS_category_id',
        fields: ['category_id']
    }]

});

// ORDERS 表
const Orders = sequelize.define('Orders', {
    order_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    user_name: {
        type: DataTypes.STRING(100),
    },
    user_email: {
        type: DataTypes.STRING(50),
    },
    goods_id: {
        type: DataTypes.INTEGER,
    },
    goods_name: {
        type: DataTypes.STRING(50),
    },
    price: {
        type: DataTypes.DECIMAL(16, 2),
    },
    qty: {
        type: DataTypes.INTEGER,
    },
    amt: {
        type: DataTypes.DECIMAL(16, 2),
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createtime: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'ORDERS',
    timestamps: false,
    indexes: [{
        name: 'idx_ORDERS_user_id',
        fields: ['user_id']
    }, {
        name: 'idx_ORDERS_goods_id',
        fields: ['goods_id']
    }]
});

// FILES 表
const Files = sequelize.define('Files', {
    file_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    file_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    file_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    file_path: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createtime: {
        type: DataTypes.INTEGER,
    },
}, {
    tableName: 'FILES',
    timestamps: false,
});

// 定义模型之间的关联（外键约束）, 虚连接就设置为null
DictsCategory.belongsTo(Dicts, { foreignKey: 'dicts_id' });
Goods.belongsTo(Files, { foreignKey: 'file_id' });
Goods.belongsTo(DictsCategory, { foreignKey: 'category_id', onDelete: 'SET NULL' });//虚
Orders.belongsTo(Users, { foreignKey: 'user_id' });
Orders.belongsTo(Goods, { foreignKey: 'goods_id', onDelete: 'SET NULL' });//虚

//清除所有外键
async function dropAllForeignKeys() {
    const queryInterface = sequelize.getQueryInterface();

    // 查询所有外键
    const [results] = await queryInterface.sequelize.query(`
        SELECT TABLE_NAME, CONSTRAINT_NAME 
        FROM information_schema.TABLE_CONSTRAINTS 
        WHERE CONSTRAINT_TYPE = 'FOREIGN KEY' 
        AND TABLE_SCHEMA = DATABASE();
    `);

    // 循环删除外键
    for (const row of results) {
        const { TABLE_NAME, CONSTRAINT_NAME } = row;
        console.log(`删除外键: ${CONSTRAINT_NAME} 在表: ${TABLE_NAME}`);
        await queryInterface.sequelize.query(`ALTER TABLE \`${TABLE_NAME}\` DROP FOREIGN KEY \`${CONSTRAINT_NAME}\`;`);
    }
}
//清除所有unique键

async function dropAllUniqueKeys() {
    const queryInterface = sequelize.getQueryInterface();

    // 查询所有唯一索引
    const [results] = await queryInterface.sequelize.query(`
        SELECT TABLE_NAME, CONSTRAINT_NAME
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE CONSTRAINT_TYPE = 'UNIQUE'
        AND TABLE_SCHEMA = DATABASE();
    `);

    // 循环删除唯一索引
    for (const row of results) {
        const { TABLE_NAME, CONSTRAINT_NAME } = row;
        console.log(`删除唯一索引: ${CONSTRAINT_NAME} 在表: ${TABLE_NAME}`);
        await queryInterface.sequelize.query(`ALTER TABLE \`${TABLE_NAME}\` DROP INDEX \`${CONSTRAINT_NAME}\`;`);
    }
}
// 同步数据库
async function initDatabase() {
    await dropAllForeignKeys();
    await dropAllUniqueKeys();
    await sequelize.sync({ force: false, alter: true });
    console.log("数据库同步成功");
}
initDatabase().catch(console.error);

module.exports = {
    Users,
    Dicts,
    DictsCategory,
    Goods,
    Orders,
    Files
}