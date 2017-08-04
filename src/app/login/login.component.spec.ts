import { async } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { apiHost } from '../constants';
import { AuthService } from '../auth/auth.service';
import { LoginComponent } from './login.component';
import { LoginForm } from './login-form';

import { FormsModule } from '@angular/forms';
import { Ng2AutoCompleteModule } from '../ng2-auto-complete/ng2AutoComplete.module';
import { UiSwitchModule } from 'ngx-ui-switch/src';

import {
    CollapseModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    TooltipModule,
    TypeaheadModule } from 'ngx-bootstrap';

import {
    CityDropdownComponent,
    ScenarioToggleComponent,
    ModelModalComponent,
    UnitsDropdownComponent,
    LabComponent
} from '../lab';

import { NavbarComponent } from '../navbar/navbar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AddEditProjectComponent } from '../project/add-edit-project.component';
import { PageNotFoundComponent } from '../http-status/page-not-found/page-not-found.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChartComponent } from '../charts/chart.component';
import { IndicatorListComponent } from '../sidebar/indicator-list.component';
import { LineGraphComponent } from '../charts/line-graph.component';
import { WaveComponent } from '../ng2-spin-kit/wave.component';

import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';
import { BrowserModule } from '@angular/platform-browser';


describe('LoginComponent', () => {

    let component:    LoginComponent;
    let fixture:      ComponentFixture<LoginComponent>;
    let emailDebug:   DebugElement;
    let emailElement: HTMLElement;
    let pwDebug:      DebugElement;
    let pwElement:    HTMLElement;

    let authServiceStub: any;

    // asynchronous beforeEach to compile component
    beforeEach(async(() => {
        authServiceStub = {
            isAuthenticated: jasmine.createSpy('isAuthenticated'),
            login: jasmine.createSpy('login').and.returnValue({
                subscribe: jasmine.createSpy('subscribe')
            }),
            toString: jasmine.createSpy('toString')
        };

        TestBed.configureTestingModule({
            imports: [ FormsModule, Ng2AutoCompleteModule, UiSwitchModule, BrowserModule,

                RouterTestingModule.withRoutes([{ path: 'login', component: LoginComponent },
                                               { path: '', component: AppComponent },
                                               { path: 'edit/', component: LoginComponent }]),

                // bootstrap
                CollapseModule.forRoot(),
                BsDropdownModule.forRoot(),
                ModalModule.forRoot(),
                PaginationModule.forRoot(),
                TooltipModule.forRoot(),
                TypeaheadModule.forRoot() ],
            declarations: [ LoginComponent, NavbarComponent, DashboardComponent, LabComponent,
                AddEditProjectComponent, PageNotFoundComponent, SidebarComponent, AppComponent,
                CityDropdownComponent, ScenarioToggleComponent, ModelModalComponent, UnitsDropdownComponent,
                ChartComponent, IndicatorListComponent, LineGraphComponent, WaveComponent ],
            providers: [
                        {provide: AuthService, useValue: authServiceStub}]
        });
    }));

    // synchronous beforeEach, using compiled component
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        fixture.detectChanges();

        component = fixture.componentInstance;

        // query by CSS element selector
        emailDebug = fixture.debugElement.query(By.css('#email'));

        emailElement = emailDebug.nativeElement;

        pwDebug = fixture.debugElement.query(By.css('#password'));
        pwElement = pwDebug.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });


    it('should have an empty email field', () => {
        expect(emailElement.textContent).toBe('');
    });

    it('should attempt login on form submission', () => {
        spyOn(component, 'onSubmit').and.callThrough();
        fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', null);
        fixture.detectChanges();

        expect(component.onSubmit).toHaveBeenCalled();
        expect(authServiceStub.login).toHaveBeenCalled();
    });
});
