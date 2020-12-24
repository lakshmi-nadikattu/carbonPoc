const express = require('express');
var https = require('https');
const fs = require("fs");
const path = require("path");
const myCOS = require('ibm-cos-sdk');
const router = express.Router()

var config = {
   endpoint: "https://s3.us-south.cloud-object-storage.appdomain.cloud",
   apiKeyId: "o-hR42L64hJPU53KTBxb_CKcjaciaBp_zBRdpofejt6X",
   ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
   serviceInstanceId: "crn:v1:bluemix:public:cloud-object-storage:global:a/c4673677263d4170911ca5d3d4b6582f:dcaa0bc9-f92e-48fd-81e3-4c10b283e4a6::"

};
var cos = new myCOS.S3(config);
var fileUploadedResult;

//This is the new method for save the  data in cloudant

router.post('/postRecord', function (req, res) {
   console.log("json", req.body)
   var options = {
      host: "esipackage.dal1a.ciocloud.nonprod.intranet.ibm.com",
      path: '/api/v1/createMPProfile',
      method: 'POST',
      headers: {
         "Content-Type": "application/json",
         "X-Requested-With": "XMLHttpRequest"
      },
   }
   var callback = function (response) {
      var data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
         data += chunk;
      });
      response.on('end', () => {
         res.end(data);
      });
   }
   var request = https.request(options, callback);
   request.write(JSON.stringify(req.body));
   request.on('error', function (err) {
      console.log('Error - error in calling post API: ' + err);
      throw err;
   });
   request.end();
});

//users for admin form service

router.post('/createNewUser', function (req, res) {
   console.log("json", req.body)
   var options = {
      host: "esipackage.dal1a.ciocloud.nonprod.intranet.ibm.com",
      path: '/api/v1/user/createUser',
      method: 'POST',
      headers: {
         "Content-Type": "application/json",
         "X-Requested-With": "XMLHttpRequest"
      },
   }
   var callback = function (response) {
      var data = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
         data += chunk;
      });
      response.on('end', () => {
         res.end(data);
      });
   }
   var request = https.request(options, callback);
   request.write(JSON.stringify(req.body));
   request.on('error', function (err) {
      console.log('Error - error in calling post API: ' + err);
      throw err;
   });
   request.end();
});

router.post('/fileUPloadCloud', function (req, res) {
   const distFolderPath = process.cwd() + '/app/routes/Attachments';
   var attachmentsplit = req.body;
   fileUploadedResult = [];
   for (let i = 0; i < attachmentsplit.length; i++) {
      const filePath = path.join(distFolderPath, attachmentsplit[i]);
      console.log(filePath);
      var curTime = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
      var curDate = new Date().getDate() + ":" + new Date().getMonth()+ ":" + new Date().getFullYear()
      attachmentsplit[i] = attachmentsplit[i] + "_" + curDate + ":" + curTime;
      if (fs.existsSync(filePath)) {
         let fileSize = fs.statSync(filePath).size;
         if (fileSize < 5000000) {
            fs.readFile(filePath, (error, fileContent) => {
               if (error) { console.log(error) }
               else {
                  cos.putObject({
                     Bucket: 'esi-packagingapp-rewrite',
                     Key: attachmentsplit[i],
                     Body: fileContent
                  }, (res) => {
                     console.log(`Successfully uploaded '${attachmentsplit[i]}'!`);

                  })
               }
            })
            fileUploadedResult.push(attachmentsplit[i])
         }
      }
   }
   res.send(fileUploadedResult)
})
module.exports = router;