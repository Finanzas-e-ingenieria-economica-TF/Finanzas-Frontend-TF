import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterLink } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"

@Component({
  selector: "app-recover-password",
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
    <div class="recover-container">
      <div class="header">
        <button mat-icon-button routerLink="/login" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div class="logo-container">
          <mat-icon class="logo-icon">trending_up</mat-icon>
          <h1 class="app-title">Sistema de Bonos</h1>
        </div>
      </div>

      <div class="recover-card">
        <h2 class="card-title">Recuperación de Contraseña</h2>
        <p class="card-subtitle">Ingrese una contraseña confiable y fácil de recordar para que pueda acceder a su cuenta</p>

        <form [formGroup]="recoverForm" (ngSubmit)="onSubmit()">
          <div class="form-field">
            <label>Nueva Contraseña</label>
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
              <mat-error *ngIf="recoverForm.get('password')?.errors?.['required']">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="recoverForm.get('password')?.errors?.['minlength']">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-field">
            <label>Confirmar Nueva Contraseña</label>
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
              <mat-error *ngIf="recoverForm.get('confirmPassword')?.errors?.['required']">
                Confirme su contraseña
              </mat-error>
              <mat-error *ngIf="recoverForm.errors?.['passwordMismatch']">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>
          </div>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-button"
            [disabled]="recoverForm.invalid || isLoading">
            <span *ngIf="!isLoading">Guardar Nueva Contraseña</span>
            <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
    .recover-container {
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

    .recover-card {
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

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      height: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field-bottom-align {
      height: 0 !important;
    }
  `,
  ],
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup
  isLoading = false
  hidePassword = true
  hideConfirmPassword = true

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    // Redirigir si ya está autenticado
    if (localStorage.getItem("isLoggedIn") === "true") {
      this.router.navigate(["/dashboard"])
    }

    this.recoverForm = this.fb.group(
      {
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

  onSubmit() {
    if (this.recoverForm.valid) {
      this.isLoading = true

      // Simulación de recuperación de contraseña
      setTimeout(() => {
        this.isLoading = false
        this.snackBar.open("Contraseña actualizada correctamente", "Cerrar", {
          duration: 5000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
        })
        this.router.navigate(["/login"])
      }, 1500)
    }
  }
}
