import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "../../shared/layout/layout.component";
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }

];

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],


})
export class AuthModule { }
