import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatListModule } from "@angular/material/list"
import { MatDividerModule } from "@angular/material/divider"
import  { AuthService, User } from "../../services/auth.service"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatListModule, MatDividerModule],
  template: `
    <div class="profile-container">
      <div class="header">
        <button mat-icon-button routerLink="/dashboard" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">Perfil</h1>
      </div>

      <div class="profile-content">
        <div class="profile-info">
          <p class="info-text">
            En Esta Sección Puede Revisar Su Perfil De Cuenta Y Otros Ajustes Adicionales
          </p>

          <div class="avatar-container">
            <div class="avatar">
              <mat-icon class="avatar-icon">person</mat-icon>
            </div>
            <h2 class="user-name">{{user?.nombre || 'Usuario'}}</h2>
          </div>

          <mat-list class="profile-menu">
            <mat-list-item routerLink="/profile/view" class="menu-item">
              <div class="menu-item-content">
                <div class="menu-icon">
                  <mat-icon>person</mat-icon>
                </div>
                <span class="menu-text">Perfil</span>
                <mat-icon class="menu-arrow">chevron_right</mat-icon>
              </div>
            </mat-list-item>

            <mat-divider></mat-divider>

            <mat-list-item routerLink="/profile/password" class="menu-item">
              <div class="menu-item-content">
                <div class="menu-icon">
                  <mat-icon>lock</mat-icon>
                </div>
                <span class="menu-text">Manejo De Contraseñas</span>
                <mat-icon class="menu-arrow">chevron_right</mat-icon>
              </div>
            </mat-list-item>

            <mat-divider></mat-divider>

            <mat-list-item (click)="logout()" class="menu-item">
              <div class="menu-item-content">
                <div class="menu-icon">
                  <mat-icon>exit_to_app</mat-icon>
                </div>
                <span class="menu-text">Cerrar Sesión</span>
                <mat-icon class="menu-arrow">chevron_right</mat-icon>
              </div>
            </mat-list-item>
          </mat-list>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        min-height: 100vh;
        background-color: #f5f5f5;
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
      }

      .profile-info {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
      }

      .info-text {
        text-align: center;
        color: #555;
        margin-top: 0;
        margin-bottom: 1.5rem;
        font-size: 14px;
      }

      .avatar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
      }

      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #4caf50;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
      }

      .avatar-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: white;
      }

      .user-name {
        margin: 0;
        color: #333;
        font-size: 18px;
      }

      .profile-menu {
        padding: 0;
      }

      .menu-item {
        height: auto;
        cursor: pointer;
      }

      .menu-item-content {
        display: flex;
        align-items: center;
        padding: 1rem 0;
        width: 100%;
      }

      .menu-icon {
        background-color: rgba(76, 175, 80, 0.1);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 1rem;
      }

      .menu-icon mat-icon {
        color: #4caf50;
      }

      .menu-text {
        flex-grow: 1;
        color: #333;
      }

      .menu-arrow {
        color: #999;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        width: 100%;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: User | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUser
  }

  logout() {
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
