import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabComponent } from './lab/lab.component';

const appRoutes: Routes = [
  { path: '', component: LabComponent }
  // TODO: Add this component
  //{ path: '**', component: PageNotFoundComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
