import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule, GridModule, ComboBoxModule, DatePickerModule, ButtonModule } from 'carbon-components-angular'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SimplemodelComponent } from './simplemodel/simplemodel.component';
import { Child1Component } from './child1/child1.component';
import { PatientregisterformComponent } from './patientregisterform/patientregisterform.component';
import { HttpModule } from '@angular/http';

@NgModule({
	declarations: [
		AppComponent,
		SimplemodelComponent,
		Child1Component,
		PatientregisterformComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule, FormsModule, ReactiveFormsModule, InputModule, GridModule,
		ComboBoxModule, DatePickerModule, ButtonModule,HttpModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
