import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientregisterformComponent } from './patientregisterform.component';

describe('PatientregisterformComponent', () => {
	let component: PatientregisterformComponent;
	let fixture: ComponentFixture<PatientregisterformComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ PatientregisterformComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PatientregisterformComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
