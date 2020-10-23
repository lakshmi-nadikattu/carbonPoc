const Cloudant = require('@cloudant/cloudant')
var cloudant = new Cloudant({ url: "https://361ae551-28b4-491a-a817-8df5cac9e73e-bluemix.cloudantnosqldb.appdomain.cloud", plugins: { iamauth: { iamApiKey: '_ECFjAkEj6px9dBcayM0A8NeXFMwIv-r4jfP8i0A6skp' } } })
//var cloudant = new Cloudant({ url: "https://361ae551-28b4-491a-a817-8df5cac9e73e-bluemix.cloudantnosqldb.appdomain.cloud", plugins: { iamauth: { iamApiKey: 'dXJoxfo7zWA4mPem9wWvAB9kpzNe6pBgrM5bXXFPFQzq' } } });
var configDB = cloudant.db.use("patientregisterdoctorlist");
var pateintDB=cloudant.db.use("patientmodeldatabase")
const getDoctorservice = async () => {
    var res = await configDB.find({
        selector: { _id: { $eq: "doctorlist" } },
        fields: [],
    },
        console.log(res)
    )

    return res.docs
}
const savePatientservice=async(req,res,next)=>
{
    var res=await pateintDB.insert(req,function(err,doc)
    {
        if(err)
        {
            console.log(err)
        }else{
        console.log("document inserted succesfully"+doc)
        }
    })
}
module.exports = { getDoctorservice,savePatientservice };