import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ PatientregisterformComponent } from './patientregisterform/patientregisterform.component';

const routes: Routes = [
	{
			path: '',
			component: PatientregisterformComponent,
			pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
