
import { SavetoexcelService } from '.././app/savetoexcel.service'

class PatientRegister {

    name: string;
    age: number;
    address: pAddress;
    phonenumber: number;
    doctor: string;
    time: string;


}
class pAddress {
    streetno: string
    pincode: number;
    city: string;
}
class DoctorList
{
    constructor(private service:SavetoexcelService){}
    getDoctorlist()
    {
    return this.service.getDoctorDetails()
    }
}
export { PatientRegister, pAddress,DoctorList}

