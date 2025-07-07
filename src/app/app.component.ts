import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterOutlet, RouterLink } from "@angular/router"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatMenuModule } from "@angular/material/menu"
import { MatDividerModule } from "@angular/material/divider"
import  { AuthService, User } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar" *ngIf="isLoggedIn">
        <span>{{title}}</span>
        <span class="toolbar-spacer"></span>

        <!-- Botón de Dashboard -->
        <button mat-button routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Dashboard
        </button>

        <!-- Menú de usuario -->
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
          <mat-icon>person</mat-icon>
          {{currentUser?.nombre || 'Usuario'}}
          <mat-icon>arrow_drop_down</mat-icon>
        </button>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/profile">
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item routerLink="/profile/password">
            <mat-icon>lock</mat-icon>
            <span>Cambiar Contraseña</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="content-container" [class.with-toolbar]="isLoggedIn">
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

      .user-menu-button {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .content-container {
        flex: 1;
        overflow: auto;
      }

      .content-container.with-toolbar {
        margin-top: 64px;
        padding: 20px;
      }

      .content-container:not(.with-toolbar) {
        padding: 0;
      }

      @media (max-width: 599px) {
        .content-container.with-toolbar {
          margin-top: 56px;
        }

        .user-menu-button {
          font-size: 12px;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = "Sistema de Bonos Corporativos"
  isLoggedIn = false
  currentUser: User | null = null

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.checkAuthStatus()

    this.authService.currentUser$.subscribe((user) => {
      this.isLoggedIn = !!user
      this.currentUser = user
    })
  }

  checkAuthStatus() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    // Cargar usuario actual si está logueado
    if (this.isLoggedIn) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser)
      }

      if (window.location.pathname === "/" || window.location.pathname === "") {
        this.router.navigate(["/dashboard"])
      }
    } else {
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
    this.currentUser = null
    this.router.navigate(["/welcome"])
  }
}
