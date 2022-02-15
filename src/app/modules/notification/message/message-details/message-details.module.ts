import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessageDetailsComponent } from './message-details.component';
import { MessageDetailsResolve } from './message-details.resovle';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessageDetailsComponent,
        resolve: {
          message: MessageDetailsResolve
        }
      }
    ])
  ],
  providers: [MessageDetailsResolve],
  declarations: [MessageDetailsComponent]
})
export class MessageDetailsModule { }
