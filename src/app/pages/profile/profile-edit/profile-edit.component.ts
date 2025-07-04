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
  selector: "app-profile-edit",
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
    <div class="profile-edit-container">
      <div class="header">
        <button mat-icon-button routerLink="/profile/view" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">Edición de Perfil</h1>
      </div>

      <div class="profile-content">
        <div class="profile-card">
          <h2 class="section-title">
            Revise Los Datos Ingresados Y Seleccione Aquellos Datos Que Necesita Actualizar
          </h2>

          <div class="avatar-section">
            <h3 class="field-label">Editar Imagen de Perfil:</h3>
            <div class="avatar-container">
              <div class="avatar">
                <mat-icon class="avatar-icon">person</mat-icon>
                <div class="avatar-badge">
                  <mat-icon class="badge-icon">edit</mat-icon>
                </div>
              </div>
            </div>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-field">
              <h3 class="field-label">Editar Nombre de Compañía:</h3>
              <mat-form-field appearance="outline" class="custom-form-field">
                <input matInput formControlName="nombre" placeholder="Compañía con Nombre Genérico">
                <mat-error *ngIf="profileForm.get('nombre')?.errors?.['required']">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-field">
              <h3 class="field-label">Editar Correo Electrónico:</h3>
              <mat-form-field appearance="outline" class="custom-form-field">
                <input matInput formControlName="email" placeholder="compañiagenerico@gmail.com" type="email">
                <mat-error *ngIf="profileForm.get('email')?.errors?.['required']">
                  El correo es requerido
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.errors?.['email']">
                  Ingrese un correo válido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="action-buttons">
              <button
                mat-stroked-button
                type="button"
                routerLink="/profile/view"
                class="cancel-button">
                Retroceder
              </button>

              <button
                mat-raised-button
                color="primary"
                type="submit"
                class="save-button"
                [disabled]="profileForm.invalid || isLoading">
                <span *ngIf="!isLoading">Guardar</span>
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
      .profile-edit-container {
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

      .profile-card {
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

      .avatar-section {
        margin-bottom: 1.5rem;
      }

      .avatar-container {
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
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
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup
  isLoading = false
  user: User | null = null

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.profileForm = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
    this.user = this.authService.currentUser

    if (this.user) {
      this.profileForm.patchValue({
        nombre: this.user.nombre,
        email: this.user.email,
      })
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true

      const userData = {
        username: this.user?.username || "",
        nombre: this.profileForm.value.nombre,
        email: this.profileForm.value.email,
        password: "", // El backend puede requerir este campo, pero no lo cambiaremos
      }

      this.authService.updateProfile(userData).subscribe({
        next: (response) => {
          this.isLoading = false
          this.snackBar.open("Perfil actualizado correctamente", "Cerrar", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate(["/profile/view"])
        },
        error: (error) => {
          this.isLoading = false
          this.snackBar.open(error.message || "Error al actualizar el perfil", "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
        },
      })
    }
  }
}
