require('dotenv').config({path:__dirname+'/./../../.env'})
module.exports = {
    url: process.env.MONGO_URL_PROD,
    dev_url: process.env.MONGO_URL_DEV,
    HOST: "0.0.0.0",
    PORT: process.env.PORT,
    database: process.env.DATABASE,
    imgBucketUser: "user_photos",
    imgBucketDorm: "dorm_photos",
    imgBucketCertificate: "certificate_photos",
    DB: process.env.DATABASE,
    PASS: process.env.PASS
  };
