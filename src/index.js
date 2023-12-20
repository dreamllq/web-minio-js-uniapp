export const Minio = require("minio");

let MinioConfig = null;

export function initMinio(config) {
  if (!config) {
    throw new Error("Minio的配置不能为空");
  }
  console.log("initMinio");
  MinioConfig = config;
}

export function presignedPutObject(a,b,c) {
  if (!MinioConfig) {
    throw new Error("请先初始化Minio");
  }
  // console.log("MinioJs.presignedPutObject:" + bucketName + "," + fileName);
  // let buf = Buffer.from(file); //Buffer
  // var Minio = require("minio");
  var minioClient = new Minio.Client(MinioConfig);
  return minioClient.presignedPutObject(a,b,c);
}

export function presignedGetObject(a, b, c) {
  if (!MinioConfig) {
    throw new Error("请先初始化Minio");
  }
  // var Minio = require("minio");
  var minioClient = new Minio.Client(MinioConfig);
  return minioClient.presignedGetObject(a, b, c);
}


export function presignedUrl(httpMethod, bucketName, objectName,expiry){
  if (!MinioConfig) {
    throw new Error("请先初始化Minio");
  }
  // var Minio = require("minio");
  var minioClient = new Minio.Client(MinioConfig);
  return minioClient.presignedUrl(httpMethod, bucketName, objectName,expiry);
}

export async function presignedPostPolicy(bucketName, objectName,expiry){
  if (!MinioConfig) {
    throw new Error("请先初始化Minio");
  }

  var minioClient = new Minio.Client(MinioConfig);
  var policy = minioClient.newPostPolicy()

  policy.setBucket(bucketName)

  policy.setKey(objectName)

  var expires = new Date
  expires.setSeconds(expiry)
  policy.setExpires(expires)

  return await minioClient.presignedPostPolicy(policy)
}

export async function listObjects(bucketName, prefix, recursive){
  return new Promise((resolve, reject)=>{
    if (!MinioConfig) {
      throw new Error("请先初始化Minio");
    }
  
    var minioClient = new Minio.Client(MinioConfig);
    var data = [];
    var stream = minioClient.listObjects(bucketName, prefix, recursive);
    stream.on('data', function(obj) {
      data.push(obj); 
    });
    stream.on('end', function () {
      resolve(data);
    });
    stream.on('error', function(err) {
      reject(err); 
    });
  })
}