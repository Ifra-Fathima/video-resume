const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy-key',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy-secret',
  region: process.env.AWS_REGION || 'us-east-1'
});

const uploadFile = (filePath, fileName) => {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || 'dummy-bucket',
    Key: fileName,
    Body: fileContent,
  };
  return s3.upload(params).promise();
};

module.exports = { uploadFile };
