## MinioJS
Minio的官方客户端使用时必须依赖node.js, 无法在vite项目中使用, 此项目把minio的使用打包为纯js,可以在浏览器中直接调用minio的客户端

## 源码地址
https://gitee.com/zheyiw/minio-js-m

## npm包地址 
https://www.npmjs.com/package/minio-js

## 安装
yarn add minio-js

## 在vue3(vite)中使用
~~~
<template>
  <div id="nav">
    <p>vite中import使用miniojs上传文件</p>
    <input ref="input" type="file" @change="handleFiles" />
  </div>
</template>
<script lang="ts">
import { initMinio, putObject } from 'minio-js'

export default {
  methods: {
    handleFiles(event: any) {
      var f = event.target.files[0]
      let reader = new FileReader()
      reader.readAsArrayBuffer(f)
      reader.onload = function (e: any) {
        let res = e.target.result //ArrayBuffer
        //先初始化
        initMinio({
          endPoint: '192.168.2.98',
          port: 9002,
          useSSL: false,
          accessKey: 'admin',
          secretKey: '12345678',
        })
        //再上传
        putObject('act', res, f.name, function (err, data) {
          if (err) console.log(err)
          else {
             console.log('上传完成')
          }
        })
      }
    },
  },
}
</script>
~~~

## 使用说明
- 在控制端可以设置bucket为public, 就可以拼接出资源的永久访问连接: http://ip:port/bucketname/filename
- 文件名一定要重命名好, 上传了相同的文件名会覆盖之前的文件

## 直接使用Minio
如果上面封装的方法不满足, 可以直接使用Minio
~~~
import { Minio } from 'minio-js'

var minioClient = new Minio.Client(MinioConfig);
......
~~~  


## 在html中使用
以js的方法使用, 直接引用MinioJs.js文件(文件很大, 按需引入)
~~~
<html>
  <head>
    <title>MinioJs</title>
  </head>
  <body>
    <div id="root">MinioJs</div>
    <script type="text/javascript" src="./MinioJs.js"></script>
    <script
      type="text/javascript"
      src="http://code.jquery.com/jquery-1.10.2.min.js"
    ></script>
    <div id="nav">
      <p>Minio文件上传：</p>
      <form id="form"><input type="file" name="file" id="file" /><br /></form>
    </div>
    <script type="text/javascript">
      $(function () {
        form.reset(); //清除浏览器记录的上次记录
        var file;
        $(form).on("change", "#file", function (e) {
          console.log(this.value); //文件路径
          console.log(this.files[0].name); //文件名

          //把文件以ArrayBuffer的形式读取后给Minio上传
          var f = this.files[0];
          let reader = new FileReader();
          reader.readAsArrayBuffer(f);
          reader.onload = function (e) {
            let res = e.target.result; //ArrayBuffer
            //先初始化
            MinioJs.initMinio({
              endPoint: "192.168.2.98",
              port: 9002,
              useSSL: false,
              accessKey: "admin",
              secretKey: "12345678",
            });
            //再上传
            MinioJs.putObject("bucket1", res, f.name, function (err, data) {
              if (err) console.log(err)
              else {
                console.log('上传完成')
              }
            });
          };
        });
      });
    </script>
  </body>
</html>
~~~

## 在Vue项目中以直接引入MinioJs.js的方式使用
把MinioJs.js放在public目录下面,在index.html中引入
~~~
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite App</title>
  <script type="text/javascript" src="config.js"></script>
  <script type="text/javascript" src="MinioJs.js"></script>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>

</html>
~~~
使用
~~~
<template>
  <div id="nav">
    <p>MinioJs上传文件：</p>
    <input ref="input" type="file" @change="handleFiles" />
  </div>
</template>
<script lang="ts">
declare const MinioJs: any //定义

export default {
  methods: {
    handleFiles(event: any) {
      var f = event.target.files[0]
      let reader = new FileReader()
      reader.readAsArrayBuffer(f)
      reader.onload = function (e: any) {
        let res = e.target.result //ArrayBuffer
        //先初始化
        MinioJs.initMinio({
          endPoint: '192.168.2.98',
          port: 9002,
          useSSL: false,
          accessKey: 'admin',
          secretKey: '12345678',
        })
        //再上传
        MinioJs.putObject("bucket1", res, f.name, function (err, data) {
          if (err) console.log(err)
          else {
            console.log('上传完成')
          }
        });
      }
    },
  },
}
</script>
~~~

## 待办
研究上传进度回调