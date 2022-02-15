import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';

import { CustomizationComponent } from './customization.component';
import { UIState } from './user-interface.state';

@NgModule({
  imports: [
    CommonModule,
    NzSwitchModule,
    ReactiveFormsModule,
    FormsModule,
    NzDropDownModule,
    NzIconModule,
    NgxsModule.forFeature([UIState])
  ],
  exports: [CustomizationComponent],
  declarations: [CustomizationComponent]
})
export class CustomizationModule { }
