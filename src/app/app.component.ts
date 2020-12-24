import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'modelclassforangular';
	@ViewChild('fred', { static: false }) fred;
	showError = false;

	ngOnInit() {
		var i=this.getResponseforfewRecords();
		console.log(i)

	}
	getResponseforfewRecords() {
		var limit = 5;
		for (let i = 0; i < 20; i++) {
			if (i<limit) {
			//	console.log("i have reached" + i )
				
			}
			limit=limit+5;
			return "have reached"
		}
	}
	onSubmit() {
		this.showError = true;
		console.log(this.fred.model.id);


	}
}
