import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  Router, RouterLink } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-register",
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
    <div class="register-container">
      <div class="header">
        <button mat-icon-button routerLink="/welcome" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="logo-container">
          <mat-icon class="logo-icon">trending_up</mat-icon>
          <h1 class="app-title">Sistema de Bonos</h1>
        </div>
      </div>

      <div class="register-card">
        <h2 class="card-title">Registro de Usuario</h2>
        <p class="card-subtitle">Ingrese sus datos para crear una cuenta</p>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label>Nombre Completo</label>
            <mat-form-field appearance="outline" class="custom-form-field">
              <input matInput formControlName="nombre" placeholder="Compañía con Nombre Genérico">
              <mat-error *ngIf="registerForm.get('nombre')?.errors?.['required']">
                El nombre es requerido
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-field">
            <label>Correo Electrónico</label>
            <mat-form-field appearance="outline" class="custom-form-field">
              <input matInput formControlName="email" placeholder="ejemplo@correo.com" type="email">
              <mat-error *ngIf="registerForm.get('email')?.errors?.['required']">
                El correo es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.errors?.['email']">
                Ingrese un correo válido
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
              <mat-error *ngIf="registerForm.get('password')?.errors?.['required']">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.errors?.['minlength']">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-field">
            <label>Confirmar Contraseña</label>
            <mat-form-field appearance="outline" class="custom-form-field">
              <input
                matInput
                [type]="hideConfirmPassword ? 'password' : 'text'"
                formControlName="confirmPassword"
                placeholder="********">
              <button
                type="button"
                mat-icon-button
                matSuffix
                (click)="hideConfirmPassword = !hideConfirmPassword">
                <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">
                Confirme su contraseña
              </mat-error>
              <mat-error *ngIf="registerForm.errors?.['passwordMismatch']">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>
          </div>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-button"
            [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="!isLoading">Registrarse</span>
            <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
          </button>
        </form>

        <div class="login-link">
          <span>¿Ya tiene una cuenta?</span>
          <a routerLink="/login">Iniciar Sesión</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
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

      .register-card {
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

      .submit-button {
        width: 100%;
        height: 48px;
        margin-top: 1rem;
        background-color: #4caf50;
        color: white;
      }

      .login-link {
        margin-top: 1.5rem;
        text-align: center;
        font-size: 14px;
      }

      .login-link a {
        color: #2e7d32;
        text-decoration: none;
        font-weight: 500;
        margin-left: 0.5rem;
      }

      .login-link a:hover {
        text-decoration: underline;
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
export class RegisterComponent {
  registerForm: FormGroup
  isLoading = false
  hidePassword = true
  hideConfirmPassword = true
  isSaving = false

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

    this.registerForm = this.createForm()
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        nombre: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSaving = true

      const userData = {
        username: this.registerForm.value.nombre,
        nombre: this.registerForm.value.nombre,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      }

      this.authService.register(userData).subscribe({
        next: (response) => {
          this.isSaving = false
          this.snackBar.open("Registro exitoso. Por favor inicie sesión.", "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate(["/login"])
        },
        error: (error) => {
          this.isSaving = false
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
