import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterLink } from "@angular/router"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-welcome",
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="welcome-container">
      <div class="welcome-content">
        <div class="logo-container">
          <div class="logo">
            <mat-icon class="logo-icon">trending_up</mat-icon>
          </div>
          <h1 class="app-name">Sistema de Bonos</h1>
        </div>

        <div class="welcome-message">
          <h2>Bienvenida</h2>
          <p>Ingrese a su cuenta o regístrese mediante alguna de las siguientes opciones</p>
        </div>

        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/login" class="login-button">
            Iniciar Sesión
          </button>
          <button mat-stroked-button routerLink="/register" class="register-button">
            Registrarse
          </button>
        </div>
      </div>

      <div class="background-decoration">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
      </div>
    </div>
  `,
  styles: [
    `
    .welcome-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
      position: relative;
      overflow: hidden;
    }

    .welcome-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      z-index: 10;
      max-width: 500px;
      width: 100%;
    }

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;
    }

    .logo {
      background-color: #ffffff;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .logo-icon {
      font-size: 60px;
      height: 60px;
      width: 60px;
      color: #1976d2;
    }

    .app-name {
      color: #ffffff;
      font-size: 28px;
      margin: 0;
    }

    .welcome-message {
      color: #ffffff;
      margin-bottom: 3rem;
    }

    .welcome-message h2 {
      font-size: 24px;
      margin-bottom: 0.5rem;
    }

    .welcome-message p {
      font-size: 16px;
      opacity: 0.9;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 1rem;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      background-color: #4caf50;
    }

    .register-button {
      height: 48px;
      font-size: 16px;
      border-color: #ffffff;
      color: #ffffff;
    }

    .background-decoration {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .circle-1 {
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.1);
      top: -100px;
      right: -100px;
    }

    .circle-2 {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.05);
      bottom: -150px;
      left: -150px;
    }
  `,
  ],
})
export class WelcomeComponent {
  constructor(private router: Router) {

    if (localStorage.getItem("isLoggedIn") === "true") {
      this.router.navigate(["/dashboard"])
    }
  }
}
