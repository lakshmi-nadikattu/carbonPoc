import { Component, OnInit } from '@angular/core';
import{ EmployeeDTO } from './modelEmpDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-simplemodel',
	templateUrl: './simplemodel.component.html',
	styleUrls: ['./simplemodel.component.css']
})
export class SimplemodelComponent  implements OnInit {
employeeDTO: EmployeeDTO;
saveForm: FormGroup;
submitted = false;
templatesubmitted = false;
		constructor(private formBuilder: FormBuilder) { }

		ngOnInit() {

			this.saveForm = this.formBuilder.group({
				empName: ['', Validators.required]
			});
	}
//   // convenience getter for easy access to form fields
		get f() { return this.saveForm.controls; }

save() {
	this.submitted = true;
	if (this.saveForm.invalid) {
return;
	}
		this.employeeDTO.empName = this.saveForm.value.empName;
		console.log(this.employeeDTO, this.saveForm.value);
}



	onSubmit(tempform) {
		this.templatesubmitted = true;
		console.log(tempform.value);
		if (tempform.invalid) {
			return;
		}
	}

}
