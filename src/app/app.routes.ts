import type { Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"

export const routes: Routes = [
  {
    path: "welcome",
    loadComponent: () => import("./pages/auth/welcome/welcome.component").then((m) => m.WelcomeComponent),
  },
  {
    path: "login",
    loadComponent: () => import("./pages/auth/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./pages/auth/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./pages/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "nuevo-bono",
    loadComponent: () => import("./pages/bono-form/bono-form.component").then((m) => m.BonoFormComponent),
    canActivate: [authGuard],
  },
  {
    path: "editar-bono/:id",
    loadComponent: () => import("./pages/bono-form/bono-form.component").then((m) => m.BonoFormComponent),
    canActivate: [authGuard],
  },
  {
    path: "detalle-bono/:id",
    loadComponent: () => import("./pages/bono-detalle/bono-detalle.component").then((m) => m.BonoDetalleComponent),
    canActivate: [authGuard],
  },
  {
    path: "profile",
    loadComponent: () => import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: "profile/view",
    loadComponent: () =>
      import("./pages/profile/profile-view/profile-view.component").then((m) => m.ProfileViewComponent),
    canActivate: [authGuard],
  },
  {
    path: "profile/edit",
    loadComponent: () =>
      import("./pages/profile/profile-edit/profile-edit.component").then((m) => m.ProfileEditComponent),
    canActivate: [authGuard],
  },
  {
    path: "profile/password",
    loadComponent: () =>
      import("./pages/profile/profile-password/profile-password.component").then((m) => m.ProfilePasswordComponent),
    canActivate: [authGuard],
  },
  { path: "", redirectTo: "/welcome", pathMatch: "full" },
  { path: "**", redirectTo: "/welcome" },
]
