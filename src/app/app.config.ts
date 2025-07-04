import { type ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimations } from "@angular/platform-browser/animations"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { authInterceptor } from "./interceptors/auth.interceptor"

import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}
