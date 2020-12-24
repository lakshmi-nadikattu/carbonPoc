import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule, GridModule, ComboBoxModule, DatePickerModule, ButtonModule,FileUploaderModule,TabsModule ,LoadingModule} from 'carbon-components-angular'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { MigartiontoolComponent } from './migartiontool/migartiontool.component';
import {
	CloseModule,
    CheckmarkFilledModule,
    WarningFilledModule,
   
} from '@carbon/icons-angular';
@NgModule({
	declarations: [
		AppComponent,
		MigartiontoolComponent,
		
	],
	imports: [
		BrowserModule,
		AppRoutingModule, FormsModule, ReactiveFormsModule, InputModule, GridModule,
		ComboBoxModule, DatePickerModule, ButtonModule,HttpModule,FileUploaderModule,
		CheckmarkFilledModule,WarningFilledModule,CloseModule,LoadingModule,TabsModule 
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
