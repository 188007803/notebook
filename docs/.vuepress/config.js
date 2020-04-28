
module.exports = {

    base: '/notebook/',

    themeConfig: {
        repo: 'https://github.com/188007803/notebook',
        // repoLabel: 'GitHub',

        logo: 'vuepress-blog-logo.png',
        lastUpdated: '更新时间',
        smoothScroll: true,
        plugins: [
            '@vuepress/back-to-top'
        ],
        nav: [
            {
                text: '前端',
                items: [
                    {
                        text: 'VueElementAdmin调整',
                        link: '/frontend/vue-element-admin'
                    }
                ]
            },
            {
                text: '后端',
                items: [
                    { text: '直播服务搭建笔记', link: '/backend/live-stream' },
                    { text: 'RabbitMQ消息队列', link: '/backend/rabbit-mq' },
                    { text: 'Docker笔记',    link: '/backend/docker' },
                ]
            },
            {
                text: '算法',
                items: [
                    { text: '常用算法',  link: '/algorithm/common' },
                    { text: '二叉树相关', link: '/algorithm/tree' },
                ]
            }
        ],
        sidebar: [
            {
                title: '前端',
                children: [
                    '/frontend/vue-element-admin',
                    '/frontend/npm'
                ]
            },
            {
                title: '后端',
                children: [
                    '/backend/live-stream',
                    '/backend/rabbit-mq',
                    '/backend/docker',
                ]
            },
            {
                title: '算法',
                children: [
                    '/algorithm/common',
                    '/algorithm/tree',
                ]
            },
            {
                title: '设计模式',
                children: [
                    '/pattern/common',
                ]
            },
            {
                title: '英语',
                children: [
                    '/english/grammer/超能英语',
                    '/english/grammer/极简英语',
                ]
            }
        ]
    }
}