import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AccountRoutingModule} from './account-routing.module';
import {ProfileComponent} from './components/profile.component';
import {SharedModule} from '../../shared/shared.module';
import {ChangePasswordComponent} from './components/change-password/change-password.component';
import {ProfileDetailsComponent} from './components/profile-details/profile-details.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        AccountRoutingModule,
    ],
  declarations: [ProfileComponent, ChangePasswordComponent, ProfileDetailsComponent],
  exports: [ProfileComponent]
})
export class AccountModule { }
