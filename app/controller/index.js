const {
    getDoctorservice, savePatientservice } = require("../services")
const getDoctorController = async (req, res, next) => {
    try {
        var config = await getDoctorservice()

        return res.status(200).send(config)
    } catch (error) {
        return res.status(500).send(error)
    }
}
const savePatientController = async (req, res, next) => {
    try {
        console.log(req.body)
        var config = await savePatientservice(req.body,res,next)
        return res.status(200).send(config)
    } catch (error) {
        return res.status(500).send(error)
    }
}
module.exports = { getDoctorController, savePatientController }