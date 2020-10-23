import { Component, OnInit } from '@angular/core';
import { PatientRegister, pAddress,DoctorList} from '../masterDTO';
import { SavetoexcelService } from '../savetoexcel.service'

@Component({
	selector: 'app-patientregisterform',
	templateUrl: './patientregisterform.component.html',
	styleUrls: ['./patientregisterform.component.css']
})
export class PatientregisterformComponent implements OnInit {
	placeholder = "Alphabate";
	ageplaceholder = "Number";
	pateintregisterDTO: PatientRegister;
	doctorlist:DoctorList
	constructor(private exportservice: SavetoexcelService) {
		
		this.doctorlist=new DoctorList(exportservice)
	}
	items = [];
	// [{ "content": "lakshmi", selected: false },
	// { content: "jai", selected: false }, { content: "raja", selected: false }, { content: "vysu", selected: false }
	// 	, { content: "pandu", selected: false }, { content: "chinni", selected: false }, { content: "anil", selected: false }, { content: "srilakshmi", selected: false },
	// { content: "vinod", selected: false }, { content: "srilatha", selected: false }]
	ngOnInit() {
		this.pateintregisterDTO = new PatientRegister();
		this.doctorlist.getDoctorlist().then(res => {
			res.forEach(element => {
				element.doctorlist.forEach(element=>{
					var result = [{ content: element}]
					this.items = this.items.concat(result)
				})	
			});

		});
		this.pateintregisterDTO.address = new pAddress();

	}
	disabled;
	savetoExcel() {
		console.log(this.pateintregisterDTO);
		var patientRegisterdetails = [];
		this.disabled = true;
		this.exportservice.savepatientDetails(this.pateintregisterDTO);
		//patientRegisterdetails.push(this.pateintregisterDTO)
		//this.exportservice.exportExcel(patientRegisterdetails,'patientform')

	}
	addNewPateint() {
		this.pateintregisterDTO.name = "";
		this.pateintregisterDTO.phonenumber = null;
		this.pateintregisterDTO.age = null;
		this.consultdoctor = '';
		this.pateintregisterDTO.time = '';
		this.pateintregisterDTO.address.city = '';
		this.pateintregisterDTO.address.pincode = null;
		this.pateintregisterDTO.address.streetno = ''
		this.selectedconsultdoctor = '';
		//this.pateintregisterDTO.doctor = ''


	}
	editNewPateint() {
		this.disabled = false;
	}
	consultdoctor = '';
	selectedconsultdoctor;
	selected(event) {
		if (this.selectedconsultdoctor.content.length != 0) {

			this.pateintregisterDTO.doctor = this.selectedconsultdoctor.content;
			this.consultdoctor = this.pateintregisterDTO.doctor;
		}
	}


}
