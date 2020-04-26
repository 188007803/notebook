# RabbitMQ


## 参考
[掘金：消息队列助你成为高薪的 Node.js 工程师](https://juejin.im/post/5dd8cd7ae51d4523501f7331)

[掘金：消息队列之 RabbitMQ](https://juejin.im/post/5a67f7836fb9a01cb74e8931)


## 安装和启动
```shell
# 安装
brew install rabbitmq
# 进入安装目录
cd /usr/local/Cellar/rabbitmq/3.8.2
# 启动
sbin/rabbitmq-server

# 浏览器输入 http://localhost:15672/#/ 默认用户名密码 guest
# 5672： 通信默认端口号
# 15672：管理控制台默认端口号
# 25672：集群通信端口号

```

## 常用命令

| 命令 | 例子 |
| ---- | ---- |
| 查看 rabbitmq 安装位置 | whereis rabbitmq |
| 启动应用 | rabbitmqctl start_app |
| 查看erlang安装位置 | whereis erlang |
| 启动应用 | rabbitmqctl start_app |
| 关闭应用 | rabbitmqctl stop_app |
| 节点状态 | rabbitmqctl status |
| 添加用户 | rabbitmqctl add_user username password |
| 列出所有用户 | rabbitmqctl list_users |
| 删除用户 | rabbitmqctl delete_user username |
| 创建虚拟主机 | rabbitmqctl add_vhost vhostpath |
| 列出所有虚拟主机 | rabbitmqctl list_vhosts |
| 查看所有队列 | rabbitmqctl list_queues |
| 清除队列里消息 | rabbitmqctl -p vhostpath purge_queue blue |


## 几个概念

- 生产者 ：生产消息的
- 消费者 ：接收消息的
- 通道 channel：建立连接后，会获取一个 channel 通道
- exchange ：交换机，消息需要先发送到 exchange 交换机，也可以说是第一步存储消息的地方(交换机会有很多类型，后面会详细说)。
- 消息队列 : 到达消费者前一刻存储消息的地方,exchange 交换机会把消息传递到此
- ack回执：收到消息后确认消息已经消费的应答

## 例子

生产者（product.js)

```javascript
// product.js

const amqp = require('amqplib');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function product(params) {
    // 1.创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');

    // 2. 获取通道
    const channel = await connection.createChannel();

    // 3. 声明参数
    const msg = 'hello koala';

    // 默认交换机 
    // const exchangeName = ''
    // const routingKey = 'helloKoalaQueue';

    // fanout 广播交换机 
    const exchangeName = 'fanout_koala_exchange'
    const routingKey = '';
    await channel.assertExchange(exchangeName, 'fanout',  {durable: true})

    for (let i = 0; i < 100; i++) {
        // 4. 发送消息
        await sleep(100)
        await channel.publish(exchangeName, routingKey, Buffer.from(`${msg} 第${i}条消息`));
        console.log(`Product: ${msg} 第${i}条消息`)
    }

    // 5. 关闭通道
    await channel.close();
    // 6. 关闭连接
    await connection.close();
}
product();

```

消费者(consumer.js)

```javascript
const amqp = require('amqplib');
const sleep = (ms) => new Promise( resolve => setTimeout(resolve, ms) )

async function consumer(queueName) {
    // 1. 创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');

    // 2. 获取通道
    const channel = await connection.createChannel();

    // 3. 声明参数

    // 默认交换机
    // queueName = 'helloKoalaQueue';
    // await channel.assertQueue(queueName);


    // faout 交换机
    queueName = queueName || 'helloKoalaQueue';
    const exchangeName = 'fanout_koala_exchange';
    const routingKey = '';
    await channel.assertExchange(exchangeName, 'fanout', {durable: true})
    await channel.assertQueue(queueName);
    await channel.bindQueue(queueName, exchangeName, routingKey);


    // 5. 消费
    await channel.consume(queueName, async msg => {
        await sleep(2000)
        console.log('Consumer：', queueName, msg.content.toString());
        channel.ack(msg);
    }, {noAck: false});
}

const queueName = process.argv[2] || ''
consumer(queueName)
```