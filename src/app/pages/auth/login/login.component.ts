import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  Router, RouterLink } from "@angular/router"
import {  FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="login-container">
      <div class="header">
        <button mat-icon-button routerLink="/welcome" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="logo-container">
          <mat-icon class="logo-icon">trending_up</mat-icon>
          <h1 class="app-title">Sistema de Bonos</h1>
        </div>
      </div>

      <div class="login-card">
        <h2 class="card-title">Inicio de Sesión</h2>
        <p class="card-subtitle">Ingrese sus credenciales para continuar</p>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label>Nombre de Usuario</label>
            <mat-form-field appearance="outline" class="custom-form-field">
              <input matInput formControlName="username" placeholder="Compañía con Nombre Genérico">
              <mat-error *ngIf="loginForm.get('username')?.errors?.['required']">
                El nombre de usuario es requerido
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-field">
            <label>Contraseña</label>
            <mat-form-field appearance="outline" class="custom-form-field">
              <input
                matInput
                [type]="hidePassword ? 'password' : 'text'"
                formControlName="password"
                placeholder="********">
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="hidePassword = !hidePassword">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.errors?.['required']">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <div class="forgot-password">
            <a routerLink="/recover-password">¿Olvidó su contraseña?</a>
          </div>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-button"
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Iniciar Sesión</span>
            <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
          </button>
        </form>

        <div class="register-link">
          <span>¿No tiene una cuenta?</span>
          <a routerLink="/register">Registrarse</a>
        </div>

        <div class="test-accounts">
          <p>Cuentas de prueba:</p>
          <p>Usuario: admin | Contraseña: admin123</p>
          <p>Usuario: usuario | Contraseña: usuario123</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
        display: flex;
        flex-direction: column;
        padding: 1rem;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        color: white;
      }

      .back-button {
        color: white;
        margin-right: 1rem;
      }

      .logo-container {
        display: flex;
        align-items: center;
      }

      .logo-icon {
        font-size: 24px;
        height: 24px;
        width: 24px;
        margin-right: 0.5rem;
      }

      .app-title {
        font-size: 20px;
        margin: 0;
      }

      .login-card {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 1.5rem;
        max-width: 500px;
        width: 100%;
        margin: 0 auto;
      }

      .card-title {
        color: #2e7d32;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .card-subtitle {
        color: #555;
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 14px;
      }

      .form-field {
        margin-bottom: 1rem;
      }

      .form-field label {
        display: block;
        margin-bottom: 0.25rem;
        color: #555;
        font-size: 14px;
      }

      .custom-form-field {
        width: 100%;
      }

      .forgot-password {
        text-align: right;
        margin-bottom: 1rem;
      }

      .forgot-password a {
        color: #2e7d32;
        text-decoration: none;
        font-size: 14px;
      }

      .forgot-password a:hover {
        text-decoration: underline;
      }

      .submit-button {
        width: 100%;
        height: 48px;
        background-color: #4caf50;
        color: white;
      }

      .register-link {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 14px;
      }

      .register-link a {
        color: #2e7d32;
        text-decoration: none;
        font-weight: 500;
        margin-left: 0.5rem;
      }

      .register-link a:hover {
        text-decoration: underline;
      }

      .test-accounts {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        font-size: 12px;
        color: #666;
      }

      .test-accounts p {
        margin: 0.25rem 0;
      }

      ::ng-deep .mat-mdc-form-field-subscript-wrapper {
        height: 0 !important;
      }

      ::ng-deep .mat-mdc-form-field-bottom-align {
        height: 0 !important;
      }
    `,
  ],
})
export class LoginComponent {
  loginForm: FormGroup
  isLoading = false
  hidePassword = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    // Redirigir si ya está autenticado
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.router.navigate(["/dashboard"])
    }

    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true
      const { username, password } = this.loginForm.value

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.isLoading = false
          this.router.navigate(["/dashboard"])
        },
        error: (error) => {
          this.isLoading = false
          this.snackBar.open(error.message, "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
        },
      })
    }
  }
}
