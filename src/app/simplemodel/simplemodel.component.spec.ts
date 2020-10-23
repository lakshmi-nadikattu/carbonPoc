import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplemodelComponent } from './simplemodel.component';

describe('SimplemodelComponent', () => {
	let component: SimplemodelComponent;
	let fixture: ComponentFixture<SimplemodelComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SimplemodelComponent ]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SimplemodelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
