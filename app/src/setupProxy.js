const proxy = require('http-proxy-middleware').createProxyMiddleware

console.log(proxy)
module.exports = function(app) {
    const apiProxy = proxy('/graphql', { target: 'http://localhost:5000' })
    const wsProxy = proxy('/graphql', { ws: true, target: 'http://localhost:5000' })
    app.use(apiProxy)
    app.use(wsProxy)
}