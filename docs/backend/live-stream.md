
## 《用腾讯云1搭建直播服务》

1. #### 进入腾讯云控制台，找到云直播
2. #### 进行域名管理
   - 添加推流域名（可以随便写）CNAME指向： [你的域名].livepush.myqloud.com
   - 添加播放域名（必须备案），CNAME指向： [你的域名].livecdn.liveplay.myqloud.com

3. #### 生成推拉流地址（辅助工具——>地址生成器)

   - 生成推流地址：（选择推流域名，输入StreamName，过期时间，点击生成地址, 生成）

     | 类型        | 推流域名                                 |
     | ----------- | ---------------------------------------- |
     | 过期时间    | 2020-03-21                               |
     | 推流地址    | OBS推流地址 + OBS推流名称                |
     | OBS推流地址 | rtmp://84752.livepush.myqcloud.com/live/ |
     | OBS推流名称 | itying?txSecret=xxxxx&txTime=xxxx        |

   - 生成播放地址：（选择播放域名，输入StreamName，过期时间，点击生成地址）

     | [类型]           | [播放域名]          |
     | ---------------- | ------------------- |
     | 过期时间         | 2020-03-21          |
     | 播放地址（RTMP） | rtmp://xxx          |
     | 播放地址（FLV）  | http://xxx (最常用) |
     | 播放地址（HLS）  | http://xxx          |

4. #### 用OBS进行直播（也可以用RTMP推流摄像机）

   1. 下载OBS （https://obsproject.com/zh-cn）
   2. 设置OBS
      1. 新建场景
      2. 新建来源（视频捕获设备，新建摄像头，选择实际设备）
      3. 设置推流地址（点设置，推流）
      4. 服务器：（填写之前生成的OBS推流地址：rtmp://xxxx）
      5. 流密钥：（填写之前生成的OBS推流名称：itying?text.....）
   3. 开始推流（如果下面有推流的进度显示，即成功）

5. #### 拉流测试

   1. 进入腾讯云控制台，进入流管理，点击在线流，点测试，启动Flash，能看到就成功了。
   2. 如果有配置了播放域名和生成播放地址，可以进入VCL等网络播放器，打开网络串流（RTMP，FLV）

6. #### 网页播放

   - FLV播放（不基于FLASH，可以用于手机端)

     ```html
     <!--FLV-->
     <script src="https://cdn.bootcss.com/flv.js/1.4.0/flv.min.js"></script>
     <video id="videoElement" controls="controls"></video>
     <script>
       if (flvjs.isSupported()) {
         var videoElement = document.getElementById('videoElement');
         var flvPlayer = flvjs.createPlayer({
           type: 'flv',
           url:'flv拉流地址'
         });
         flvPlayer.attachMediaElement(videoElement);
         flvPlayer.load();
         flvPlayer.play();
       }
     </script>
     
     ```

   - RTMP播放（见示例文件，基于FLASH）

     ```html
     <!--RTMP-->
     <head>
         <link href="http://vjs.zencdn.net/5.5.3/video-js.css" rel="stylesheet">
         <!-- If you'd like to support IE8 -->
         <script src="http://vjs.zencdn.net/ie8/1.1.1/videojs-ie8.min.js"></script>
     </head>
     <body>
         <video id="my-video" class="video-js"
         	controls
         	preload="auto"
         	width="640"
         	height="300"
         	poster="http://xxx.jpg"
         	data-setup="{}"
         	>
             <!-- RTMP流 -->
             <source src="rtmp拉流地址" type="rtmp/flv" />
           
             <!-- hls流 (如果RTMP不能播放) -->
             <source src="hls拉流地址" type='application/x-mpegURL'>
           
             <!-- 开启js提醒 -->
             <p class="vjs-no-js">
                 播放视频需要启用 JavaScript，推荐使用支持HTML5的浏览器访问。
             </p>
         </video>
         
         <!-- 直播JS -->
         <script src="http://vjs.zencdn.net/5.5.3/video.js"></script>
     </body>
     
     ```
   
     
   

## 《用Node搭建直播服务器》

1. 安装Node-Media-Server

   ```sh
   npm i node-media-server
   
   # http://www.nodemedia.cn/
   ```

2. 启动服务 app.js

   ```javascript
   const NodeMediaServer = require('node-media-server');
     
     const config = {
       rtmp: {
         port: 1935,
         chunk_size: 60000,
         gop_cache: true,
         ping: 30,
         ping_timeout: 60
       },
       http: {
         port: 8000,
         allow_origin: '*'
       }
     };
     
     var nms = new NodeMediaServer(config)
     nms.run();
   
   ```

   

3. OBS推流设置

   ```sh
   #  URL:   rtmp://localhost/live
   #  stream key: STREAM_NAME(随意)
   ```

4. 拉流测试

   ```sh
   # 安装ffmpeg ffplay
   brew install ffmpeg --with-ffplay
   
   # 测试 RTMP
   ffplay rtmp://localhost/live/STREAM_NAME
   
   # 测试 Http-flv
   ffplay http://localhost/live/STREAM_NAME.flv
   
   ```

   

5. 使用 flv.js 播放 http-flv 流格式/

    ```html
    <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
    <video id="videoElement"></video>
    <script>
      if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: 'ws://localhost:8000/live/STREAM_NAME.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
      }
    </script>
    ```

6. 完整鉴权示例

    ```javascript
    
    // 常用库
    const dayjs = require('dayjs')
    const md5   = require('md5')
    const ip    = require('ip')

    // 配置鉴权参数
    const appName    = 'live'         // 固定
    const streamName = 'stream'       // 流名字，自己改
    const expires    = dayjs().add(1, 'hour').unix(); // 过期时间，自己改，
    const secret     = 'nodemedia2020privatekey' // 密钥，自己改，推荐放在配置文件中

    // 生成鉴权要素
    const stream     = md5(`/${appName}/${streamName}-${expires}-${secret}`)
    const sign       = `${expires}-${stream}`
    const ipAddress  = ip.address();
    const portPlay   = 8000;

    // 生成最终地址
    const hostPublish = `${ipAddress}`
    const hostPlay    = `${ipAddress}:${portPlay}`

    const urlPublish = `rtmp://${hostPublish}/${appName}/${streamName}?sign=${sign}`;
    const urlRtmp    = `rtmp://${hostPlay}/${appName}/${streamName}?sign=${sign}`;
    const urlFlv     = `http://${hostPlay}/${appName}/${streamName}.flv?sign=${sign}`;
    const urlWs      = `ws://${hostPlay}/${appName}/${streamName}.flv?sign=${sign}`;

    const table = [
        {name: 'urlPublish', url: urlPublish},
        {name: 'urlRtmp',    url: urlRtmp},
        {name: 'urlFlv',     url: urlFlv},
        {name: 'urlWs',      url: urlWs},
    ]

    console.table(table)

    const config = {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
    
        // 加密鉴权
        auth: {
            play: true,
            publish: true,
            secret: secret
        },
    
        http: {
            port: 8000,
            allow_origin: '*',
            // 保存目录，注意：windows上不能用 ./，并且路径是双反斜杠 'D:\\xxx\\soft\\ffmpeg.exe'
            mediaroot: './media', 
        },
    
        // 实时转换成MP4并保存
        trans: {
            ffmpeg: '/usr/local/bin/ffmpeg',
            tasks: [{
                app: appName, 
                mp4: true,
                mp4Flags: '[movflags=faststart]',
            }]
        }
    };
    
    var nms = new NodeMediaServer(config)
    nms.run();
    ```

  





