import { ApplicationRef, DoBootstrap, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';

import { AuthInterceptor } from './service/auth/auth.interceptor';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';




import { AppointmentCreate } from './scheduling-system/appointment-create/appointment-create';

registerLocaleData(localePt);
@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,

    // ✅ App standalone entra em imports
    App,

    // standalone pages
    AppointmentCreate

  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [],
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(App);
  }
}
