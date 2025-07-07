import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  Router, RouterLink } from "@angular/router"
import {  FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { AuthService, User } from "../../../services/auth.service"

@Component({
  selector: "app-profile-password",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="password-container">
      <div class="header">
        <button mat-icon-button routerLink="/profile" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">Cambiar Contraseña</h1>
      </div>

      <div class="password-content">
        <div class="password-card">
          <h2 class="section-title">
            Ingrese Su Contraseña Actual Y La Nueva Contraseña
          </h2>

          <div class="security-info">
            <mat-icon class="security-icon">security</mat-icon>
            <p>Por seguridad, necesitamos verificar su contraseña actual antes de cambiarla.</p>
          </div>

          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <h3 class="field-label">Contraseña Actual:</h3>
              <mat-form-field appearance="outline" class="custom-form-field">
                <input
                  matInput
                  [type]="hideCurrentPassword ? 'password' : 'text'"
                  formControlName="currentPassword"
                  placeholder="Ingrese su contraseña actual">
                <button
                  type="button"
                  mat-icon-button
                  matSuffix
                  (click)="hideCurrentPassword = !hideCurrentPassword">
                  <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('currentPassword')?.errors?.['required']">
                  La contraseña actual es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <h3 class="field-label">Nueva Contraseña:</h3>
              <mat-form-field appearance="outline" class="custom-form-field">
                <input
                  matInput
                  [type]="hideNewPassword ? 'password' : 'text'"
                  formControlName="newPassword"
                  placeholder="Ingrese su nueva contraseña">
                <button
                  type="button"
                  mat-icon-button
                  matSuffix
                  (click)="hideNewPassword = !hideNewPassword">
                  <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('newPassword')?.errors?.['required']">
                  La nueva contraseña es requerida
                </mat-error>
                <mat-error *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">
                  La contraseña debe tener al menos 6 caracteres
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <h3 class="field-label">Confirmar Nueva Contraseña:</h3>
              <mat-form-field appearance="outline" class="custom-form-field">
                <input
                  matInput
                  [type]="hideConfirmPassword ? 'password' : 'text'"
                  formControlName="confirmPassword"
                  placeholder="Confirme su nueva contraseña">
                <button
                  type="button"
                  mat-icon-button
                  matSuffix
                  (click)="hideConfirmPassword = !hideConfirmPassword">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.errors?.['required']">
                  Confirme su nueva contraseña
                </mat-error>
                <mat-error *ngIf="passwordForm.errors?.['passwordMismatch']">
                  Las contraseñas no coinciden
                </mat-error>
              </mat-form-field>
            </div>

            <div class="password-requirements">
              <h4>Requisitos de la contraseña:</h4>
              <ul>
                <li>Mínimo 6 caracteres</li>
                <li>Se recomienda usar una combinación de letras, números y símbolos</li>
                <li>Evite usar información personal fácil de adivinar</li>
              </ul>
            </div>

            <div class="action-buttons">
              <button
                mat-stroked-button
                type="button"
                routerLink="/profile"
                class="cancel-button">
                Cancelar
              </button>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="save-button"
                [disabled]="passwordForm.invalid || isLoading">
                <span *ngIf="!isLoading">Cambiar Contraseña</span>
                <mat-spinner *ngIf="isLoading" diameter="24"></mat-spinner>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .password-container {
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
        margin-right: 48px;
      }

      .password-content {
        padding: 1rem;
      }

      .password-card {
        background-color: #e8f5e9;
        border-radius: 12px;
        padding: 1.5rem;
      }

      .section-title {
        color: #2e7d32;
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 1.5rem;
        text-align: center;
        font-weight: normal;
      }

      .security-info {
        display: flex;
        align-items: center;
        background-color: #fff3e0;
        border: 1px solid #ffcc02;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .security-icon {
        color: #ff9800;
        margin-right: 0.5rem;
        font-size: 20px;
      }

      .security-info p {
        margin: 0;
        color: #e65100;
        font-size: 14px;
      }

      .field-label {
        color: #555;
        font-size: 14px;
        margin-bottom: 0.25rem;
        font-weight: normal;
      }

      .form-field {
        margin-bottom: 1.5rem;
      }

      .custom-form-field {
        width: 100%;
      }

      .password-requirements {
        background-color: #f0f8ff;
        border: 1px solid #2196f3;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }

      .password-requirements h4 {
        color: #1976d2;
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 14px;
      }

      .password-requirements ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #555;
        font-size: 13px;
      }

      .password-requirements li {
        margin-bottom: 0.25rem;
      }

      .action-buttons {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-top: 2rem;
      }

      .cancel-button {
        flex: 1;
        height: 48px;
        background-color: #f44336;
        color: white;
      }

      .save-button {
        flex: 1;
        height: 48px;
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
export class ProfilePasswordComponent implements OnInit {
  passwordForm: FormGroup
  isLoading = false
  user: User | null = null
  hideCurrentPassword = true
  hideNewPassword = true
  hideConfirmPassword = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.passwordForm = this.createForm()
  }

  ngOnInit() {
    this.user = this.authService.currentUser
  }

  createForm(): FormGroup {
    return this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    return newPassword === confirmPassword ? null : { passwordMismatch: true }
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.isLoading = true

      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
      }

      this.authService.changePassword(passwordData).subscribe({
        next: (response) => {
          this.isLoading = false
          this.snackBar.open("Contraseña cambiada correctamente", "Cerrar", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate(["/profile"])
        },
        error: (error) => {
          this.isLoading = false
          this.snackBar.open(error.message || "Error al cambiar la contraseña", "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
        },
      })
    }
  }
}
