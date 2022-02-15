import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessageUnreadDetailsComponent } from './message-unread-details.component';
import { MessageUnreadDetailsResolve } from './message-unread-details.resovle';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        resolve: {
          message: MessageUnreadDetailsResolve
        },
        component: MessageUnreadDetailsComponent
      }
    ])
  ],
  providers: [MessageUnreadDetailsResolve],
  declarations: [MessageUnreadDetailsComponent]
})
export class MessageUnreadDetailsModule { }
