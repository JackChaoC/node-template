const express = require('express');
const cors = require('cors')
const path = require('path');
const app = express();

const interceptor = require('./interceptor/index.js');

// 使用 cors 中间件
const corsConfig = {
    credentials: true, // 允许发送凭证(cookie)
    optionsSuccessStatus: 200
}
app.use(cors(corsConfig));

app.use(express.json()); // 解析 JSON 格式的请求主体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码格式的请求主体



// 开放静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 拦截器
app.use(interceptor);

const Test = require('./route/Test');
const Management = require('./route/Management');
const Authorization = require('./route/Authorization');
const Upload = require('./route/Upload.js');
app.use('/test', Test);
app.use('/management', Management);
app.use('/authorization', Authorization);
app.use('/upload', Upload);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});