let count = 0
const interceptor = function (req, res, next) {
    console.log('全局 session->', req.session);
    console.log('全局 body->', req.body)
    console.log('全局 count->', count += 1)
    console.log('path:', req.path)
    if (req.path.match(/\/authorization/) || req.path.match(/\/upload/)) {
        console.log('放行！！！！！！！！！');
        return next(); // 放行这些路由，不进行中间件处理
    }
    if (req.session.loggedIn) {
        next()
    } else {
        res.send({
            "code": 1, //未登录
            "data": 0,
            "message": "访问成功，但是未登录"
        })
    }

}
module.exports = interceptor;