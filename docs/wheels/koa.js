
const http = require('http')
const EventEmitter = require('events')
const Stream = require('stream')

// 常用状态码
const statuses = {
    "200": "OK",
    "201": "Created",
    "202": "Accepted",
    "300": "Multiple Choices",
    "301": "Moved Permanently",
    "302": "Found",
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
}


// 自定义 request 对象
const request = {
    response: null,
    req: null,
    res: null,
    ctx: null,
    app: null,
}

// 自定义 response 对象
const response = {
    request: null,
    req: null,
    res: null,
    ctx: null,
    app: null,
}

// 自定义 context 对象
const context = {
    request: null,
    response: null,
    req: null,
    res: null,
    app: null,

    // 中间件运行的错误，会在这里统一处理
    onerror(err) {
        this.app.emit('error', err, this)

        const res = this.res;
        if ('ENOENT' == err.code) {
            err.status = 404;
        }
        if ('number' != typeof err.status || !statuses[err.status]) {
            err.status = 500;
        }

        const code = statuses[err.status];
        const msg = err.expose ? err.message : code;
        this.status = err.status;
        res.end(msg);
    }
}

class Koa extends EventEmitter {

    // 声明成员变量
    constructor(){
        super()
        this.middleware = []
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.ctx = this.context;
    }

    // 生成回调函数，进行监听
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args);
    }

    // 加入中间件
    use(fn){
        this.middleware.push(fn)
        return this;
    }

    // 生成回调函数
    callback() {
        // 生成中间件组合
        const fn = this.compose(this.middleware)

        // 建立错误处理
        this.on('error', this.onerror);

        // 生成回调函数
        // 在每次请求中，都建立一个新ctx
        // 并用来中间件组合来处理
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }

        return handleRequest;
    }

    // 组合中间件
    compose(middleware){
        return function(context, next) {
            return dispatch(0)
            function dispatch(i) {
                let fn = middleware[i]
                if (i === middleware.length) fn = next;
                if (!fn) return Promise.reslove()
                try {
                    return Promise.resolve((fn(context, () => dispatch(i+1))))
                }catch(err) {
                    return Promise.reject(err)
                }
            }
        }
    }

    // 请求处理函数
    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;
        const onerror = err => ctx.onerror(err)
        const handleResponse = () => this.respond(ctx)
        fnMiddleware(ctx).then(handleResponse).catch(onerror)
    }

    // 初始化上下文对象
    createContext(req, res){
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request)
        const response = context.response = Object.create(this.response)
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;
        context.state = {};
        return context;
    }

    // 错误处理函数
    onerror(err) {
        if ( !(err instanceof Error) ) {
            throw new TypeError('non-error thrown: ' + err)
        }
        // 404 不处理
        if (404 === err.status ||  err.expose ) return;

        // 静默模式也不处理
        if ( this.silent ) return;

        // 打印错误到控制台
        const msg = err.stack || err.toString();
        console.error()
        console.error(msg.replace(/^/gm, ' '))
        console.error();
    }

    // 最终结果响应函数
    respond(ctx){
        const res = ctx.res;
        const code = ctx.status;
        let body = ctx.body;

        if ('HEAD' === ctx.method) {
            return res.end();
        }

        if (null == body) {
            body = String(code)
            return res.end(body)
        }

        if (Buffer.isBuffer(body)) return res.end(body);
        if ('string' === typeof body) return res.end(body);
        if (body instanceof Stream) return body.pipe(res);

        body = JSON.stringify(body)

        res.end(body)
    }

}

const app = new Koa()

const delayGet = function(value, ms=0) {
    return new Promise((reslove, reject) => {
        setTimeout(() => reslove(value), ms)
    })
}


app.use(async ( ctx, next ) => {
    console.log('fn 1')
    ctx.body = 'hello'
    await next()
    console.count('hello')
    ctx.body += ' ok'
})

app.use( async (ctx) => {
    let word = await delayGet(' 22', 1000)
    throw(new Error('nono'))
    ctx.body += word
})


app.listen(8090)
