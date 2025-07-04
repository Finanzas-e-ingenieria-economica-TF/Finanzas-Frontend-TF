import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterOutlet, RouterLink } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span>{{title}}</span>
        <span class="toolbar-spacer"></span>
        <button mat-icon-button aria-label="Perfil" routerLink="/profile" *ngIf="isLoggedIn">
          <mat-icon>person</mat-icon>
        </button>
        <button mat-icon-button aria-label="Configuración" routerLink="/configuracion" *ngIf="isLoggedIn">
          <mat-icon>settings</mat-icon>
        </button>
        <button mat-button *ngIf="isLoggedIn" (click)="logout()">Cerrar Sesión</button>
      </mat-toolbar>

      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .app-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .content-container {
        margin-top: 64px;
        padding: 20px;
        flex: 1;
        overflow: auto;
      }

      @media (max-width: 599px) {
        .content-container {
          margin-top: 56px;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = "Sistema de Bonos Corporativos"
  isLoggedIn = false

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Verificar si el usuario está autenticado
    this.checkAuthStatus()

    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
    })
  }

  checkAuthStatus() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    // Redirigir a la página correcta según el estado de autenticación
    if (this.isLoggedIn) {
      // Si está autenticado y está en la ruta raíz, redirigir al dashboard
      if (window.location.pathname === "/" || window.location.pathname === "") {
        this.router.navigate(["/dashboard"])
      }
    } else {
      // Si no está autenticado, redirigir al login
      if (
        !window.location.pathname.includes("/welcome") &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register") &&
        !window.location.pathname.includes("/recover-password")
      ) {
        this.router.navigate(["/welcome"])
      }
    }
  }

  logout() {
    this.authService.logout()
    this.isLoggedIn = false
    this.router.navigate(["/welcome"])
  }
}
