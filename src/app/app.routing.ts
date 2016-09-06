import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LabComponent } from './lab/lab.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './http-status/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'lab', component: LabComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
