import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabComponent } from './lab/lab.component';
import { PageNotFoundComponent } from './http-statuses/page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: '', component: LabComponent },
  { path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
