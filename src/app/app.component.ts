import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'modelclassforangular';
	@ViewChild('fred', {static: false})fred;
	showError = false;

	ngOnInit() {

	}
	onSubmit() {
		this.showError = true;
		console.log(this.fred.model.id);


	}
}
