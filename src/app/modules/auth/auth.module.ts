import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {PasswordResetRequestComponent} from './password-reset-request/password-reset-request.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "../../shared/layout/layout.component";
import {AppInputComponent} from "../../shared/input/app-input.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'password-reset-request', component: PasswordResetRequestComponent },
      { path: 'password-reset', component: PasswordResetComponent }
    ]
  }

];

@NgModule({
    declarations: [LoginComponent, PasswordResetRequestComponent, PasswordResetComponent, AppInputComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],


})
export class AuthModule { }
