import { NgModule } from '@angular/core';
import { AuthStateModule } from '@app/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../../environments/environment';
import { APP_STATE_INITIALIZER } from './app-state-handler';

@NgModule({
  imports: [
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: 'ui'
    }),
    AuthStateModule,
  ],
  exports: [
    NgxsModule,
    NgxsReduxDevtoolsPluginModule,
    NgxsStoragePluginModule
  ],
  providers: [
    APP_STATE_INITIALIZER,
  ]
})
export class AppStateModule { }
