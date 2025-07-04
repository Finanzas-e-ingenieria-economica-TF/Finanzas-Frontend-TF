import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import  { AuthService, User } from "../../../services/auth.service"

@Component({
  selector: "app-profile-view",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    <div class="profile-view-container">
      <div class="header">
        <button mat-icon-button routerLink="/profile" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">Vista de Perfil</h1>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <h2 class="section-title">Imagen de Perfil:</h2>

          <div class="avatar-container">
            <div class="avatar">
              <mat-icon class="avatar-icon">person</mat-icon>
              <div class="avatar-badge">
                <mat-icon class="badge-icon">photo_camera</mat-icon>
              </div>
            </div>
          </div>

          <mat-divider class="divider"></mat-divider>

          <div class="profile-field">
            <h3 class="field-label">Nombre de Compañía:</h3>
            <p class="field-value">{{user?.nombre || 'Compañía con Nombre Genérico'}}</p>
          </div>

          <div class="profile-field">
            <h3 class="field-label">Correo Electrónico:</h3>
            <p class="field-value">{{user?.email || 'compañiagenerico@gmail.com'}}</p>
          </div>
        </div>
      </div>

      <div class="action-button">
        <button mat-raised-button color="primary" routerLink="/profile/edit">
          Editar Perfil
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-view-container {
        min-height: 100vh;
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
        color: white;
        padding: 1rem;
        display: flex;
        align-items: center;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
      }

      .back-button {
        color: white;
        margin-right: 1rem;
      }

      .page-title {
        margin: 0;
        font-size: 24px;
        text-align: center;
        flex-grow: 1;
        margin-right: 48px; /* Compensar el botón de regreso */
      }

      .profile-content {
        padding: 1rem;
        flex-grow: 1;
      }

      .profile-card {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 1.5rem;
      }

      .section-title {
        color: #2e7d32;
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 1rem;
        text-align: center;
      }

      .avatar-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }

      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #4caf50;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      }

      .avatar-icon {
        font-size: 60px;
        height: 60px;
        width: 60px;
        color: white;
      }

      .avatar-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: #ff9800;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid white;
      }

      .badge-icon {
        font-size: 16px;
        height: 16px;
        width: 16px;
        color: white;
      }

      .divider {
        margin: 1rem 0;
      }

      .profile-field {
        margin-bottom: 1.5rem;
      }

      .field-label {
        color: #555;
        font-size: 14px;
        margin-bottom: 0.25rem;
        font-weight: normal;
      }

      .field-value {
        color: #333;
        font-size: 16px;
        margin: 0;
        font-weight: 500;
      }

      .action-button {
        padding: 1rem;
        display: flex;
        justify-content: center;
      }

      .action-button button {
        background-color: #4caf50;
        color: white;
        width: 100%;
        max-width: 300px;
        height: 48px;
      }
    `,
  ],
})
export class ProfileViewComponent implements OnInit {
  user: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser
  }
}
