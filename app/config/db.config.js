require('dotenv').config();
module.exports = {
    url: process.env.MONGO_URL,
    HOST: "0.0.0.0",
    PORT: process.env.PORT,
    database: process.env.DATABASE,
    imgBucketUser: "user_photos",
    imgBucketDorm: "dorm_photos",
    imgBucketCertificate: "certificate_photos",
    DB: process.env.DATABASE,
    PASS: process.env.PASS
  };

  //DB HOST: "0.0.0.0", 

  //mongodb+srv://angelonatad22:j2xroMaxp8cSfQEr@dormate.u7iebjw.mongodb.net/