import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatDatepickerModule } from "@angular/material/datepicker"
import { MatNativeDateModule } from "@angular/material/core"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import  { BonoService } from "../../services/bono.service"
import { Bono, Configuracion } from "../../models/bono.model"
import { MatIconModule } from "@angular/material/icon"

@Component({
  selector: "app-bono-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  template: `
    <div class="form-container">
      <div class="header-actions">
        <h1>{{isEditMode ? 'Editar' : 'Nuevo'}} Bono Corporativo</h1>
        <button mat-button color="primary" (click)="volver()">
          Volver al Dashboard
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card *ngIf="!isLoading">
        <mat-card-content>
          <form [formGroup]="bonoForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nombre del Bono</mat-label>
                <input matInput formControlName="nombre" placeholder="Ej. Bono Corporativo XYZ">
                <mat-error *ngIf="bonoForm.controls['nombre'].errors && bonoForm.controls['nombre'].errors['required']">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Valor Nominal</mat-label>
                <input matInput type="number" formControlName="valorNominal" placeholder="Ej. 10000">
                <mat-error *ngIf="bonoForm.controls['valorNominal'].errors && bonoForm.controls['valorNominal'].errors['required']">
                  El valor nominal es requerido
                </mat-error>
                <mat-error *ngIf="bonoForm.controls['valorNominal'].errors && bonoForm.controls['valorNominal'].errors['min']">
                  El valor debe ser mayor a 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Moneda</mat-label>
                <mat-select formControlName="moneda">
                  <mat-option *ngFor="let moneda of configuracion.monedas" [value]="moneda">
                    {{moneda}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Tasa de Interés</mat-label>
                <input matInput type="number" formControlName="tasaInteres" placeholder="Ej. 0.05 (5%)">
                <mat-error *ngIf="bonoForm.controls['tasaInteres'].errors && bonoForm.controls['tasaInteres'].errors['required']">
                  La tasa de interés es requerida
                </mat-error>
                <mat-error *ngIf="(bonoForm.controls['tasaInteres'].errors && bonoForm.controls['tasaInteres'].errors['min']) ||
                                 (bonoForm.controls['tasaInteres'].errors && bonoForm.controls['tasaInteres'].errors['max'])">
                  La tasa debe estar entre 0 y 1
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Tipo de Tasa</mat-label>
                <mat-select formControlName="tipoTasa">
                  <mat-option value="efectiva">Efectiva</mat-option>
                  <mat-option value="nominal">Nominal</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row" *ngIf="bonoForm.controls['tipoTasa'].value === 'nominal'">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Capitalización (veces por año)</mat-label>
                <input matInput type="number" formControlName="capitalizacion" placeholder="Ej. 12 (mensual)">
                <mat-error *ngIf="bonoForm.controls['capitalizacion'].errors && bonoForm.controls['capitalizacion'].errors['required']">
                  La capitalización es requerida para tasas nominales
                </mat-error>
                <mat-error *ngIf="bonoForm.controls['capitalizacion'].errors && bonoForm.controls['capitalizacion'].errors['min']">
                  La capitalización debe ser mayor a 0
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-columns">
              <mat-form-field appearance="outline">
                <mat-label>Plazo Total (períodos)</mat-label>
                <input matInput type="number" formControlName="plazoTotal" placeholder="Ej. 20">
                <mat-error *ngIf="bonoForm.controls['plazoTotal'].errors && bonoForm.controls['plazoTotal'].errors['required']">
                  El plazo total es requerido
                </mat-error>
                <mat-error *ngIf="bonoForm.controls['plazoTotal'].errors && bonoForm.controls['plazoTotal'].errors['min']">
                  El plazo debe ser mayor a 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Frecuencia de Pago (veces por año)</mat-label>
                <mat-select formControlName="frecuenciaPago">
                  <mat-option [value]="1">Anual (1)</mat-option>
                  <mat-option [value]="2">Semestral (2)</mat-option>
                  <mat-option [value]="4">Trimestral (4)</mat-option>
                  <mat-option [value]="12">Mensual (12)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-section">
              <h3 class="section-title">Plazos de Gracia</h3>
              <p class="section-description">
                Los plazos de gracia son períodos donde no se realizan pagos completos o parciales del bono.
              </p>

              <div class="form-row two-columns">
                <mat-form-field appearance="outline">
                  <mat-label>Plazo de Gracia Total (períodos)</mat-label>
                  <input matInput type="number" formControlName="plazoGraciaTotal" placeholder="0">
                  <mat-hint>Períodos donde no se paga ni interés ni amortización</mat-hint>
                  <mat-error *ngIf="bonoForm.controls['plazoGraciaTotal'].errors && bonoForm.controls['plazoGraciaTotal'].errors['min']">
                    El plazo no puede ser negativo
                  </mat-error>
                  <mat-error *ngIf="bonoForm.controls['plazoGraciaTotal'].errors && bonoForm.controls['plazoGraciaTotal'].errors['max']">
                    El plazo de gracia no puede ser mayor al plazo total
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Plazo de Gracia Parcial (períodos)</mat-label>
                  <input matInput type="number" formControlName="plazoGraciaParcial" placeholder="0">
                  <mat-hint>Períodos donde solo se paga interés (no amortización)</mat-hint>
                  <mat-error *ngIf="bonoForm.controls['plazoGraciaParcial'].errors && bonoForm.controls['plazoGraciaParcial'].errors['min']">
                    El plazo no puede ser negativo
                  </mat-error>
                  <mat-error *ngIf="bonoForm.controls['plazoGraciaParcial'].errors && bonoForm.controls['plazoGraciaParcial'].errors['max']">
                    Los plazos de gracia no pueden superar el plazo total
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="grace-period-info" *ngIf="bonoForm.get('plazoTotal')?.value">
                <div class="info-card">
                  <mat-icon>info</mat-icon>
                  <div>
                    <p><strong>Resumen de Períodos:</strong></p>
                    <p>• Plazo total: {{bonoForm.get('plazoTotal')?.value}} períodos</p>
                    <p>• Gracia total: {{bonoForm.get('plazoGraciaTotal')?.value || 0}} períodos (sin pagos)</p>
                    <p>• Gracia parcial: {{bonoForm.get('plazoGraciaParcial')?.value || 0}} períodos (solo interés)</p>
                    <p>• Períodos de amortización: {{calcularPeriodosAmortizacion()}} períodos</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Fecha de Emisión</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="fechaEmision">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="bonoForm.controls['fechaEmision'].errors && bonoForm.controls['fechaEmision'].errors['required']">
                  La fecha de emisión es requerida
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="volver()">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="bonoForm.invalid || isSaving">
                <span *ngIf="!isSaving">{{isEditMode ? 'Actualizar' : 'Guardar'}} Bono</span>
                <mat-spinner *ngIf="isSaving" diameter="24"></mat-spinner>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 20px;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 40px;
      }

      .form-row {
        margin-bottom: 16px;
      }

      .two-columns {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      @media (max-width: 768px) {
        .two-columns {
          grid-template-columns: 1fr;
        }
      }

      .full-width {
        width: 100%;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 24px;
      }

      .form-section {
        margin-bottom: 2rem;
        padding: 1rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #2196f3;
      }

      .section-title {
        color: #2196f3;
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .section-description {
        color: #666;
        font-size: 14px;
        margin-bottom: 1rem;
      }

      .grace-period-info {
        margin-top: 1rem;
      }

      .info-card {
        display: flex;
        align-items: flex-start;
        padding: 1rem;
        background-color: #e3f2fd;
        border-radius: 8px;
        border: 1px solid #bbdefb;
      }

      .info-card mat-icon {
        color: #1976d2;
        margin-right: 0.5rem;
        margin-top: 0.25rem;
      }

      .info-card p {
        margin: 0.25rem 0;
        font-size: 14px;
      }
    `,
  ],
})
export class BonoFormComponent implements OnInit {
  bonoForm: FormGroup
  isEditMode = false
  isLoading = true
  isSaving = false
  bonoId: string | null = null
  configuracion: Configuracion = {
    monedas: ["PEN", "USD", "EUR"],
    monedaDefecto: "PEN",
    tipoTasaDefecto: "efectiva",
  }

  constructor(
    private fb: FormBuilder,
    private bonoService: BonoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.bonoForm = this.createForm()
  }

  ngOnInit(): void {
    // Cargar configuración
    this.bonoService.getConfiguracion().subscribe({
      next: (config) => {
        this.configuracion = config

        // Verificar si estamos en modo edición
        this.bonoId = this.route.snapshot.paramMap.get("id")
        this.isEditMode = !!this.bonoId

        if (this.isEditMode && this.bonoId) {
          this.cargarBono(this.bonoId)
        } else {
          // Establecer valores por defecto
          this.bonoForm.patchValue({
            moneda: this.configuracion.monedaDefecto,
            tipoTasa: this.configuracion.tipoTasaDefecto,
            capitalizacion:
              this.configuracion.tipoTasaDefecto === "nominal" ? this.configuracion.capitalizacionDefecto : undefined,
            plazoGraciaTotal: 0,
            plazoGraciaParcial: 0,
            fechaEmision: new Date(),
          })
          this.isLoading = false
        }
      },
      error: () => {
        this.isLoading = false
        this.snackBar.open("Error al cargar la configuración", "Cerrar", { duration: 5000 })
      },
    })

    // Escuchar cambios en el tipo de tasa
    this.bonoForm.get("tipoTasa")?.valueChanges.subscribe((value) => {
      const capitalizacionControl = this.bonoForm.get("capitalizacion")
      if (value === "nominal") {
        capitalizacionControl?.setValidators([Validators.required, Validators.min(1)])
      } else {
        capitalizacionControl?.clearValidators()
        capitalizacionControl?.setValue(undefined)
      }
      capitalizacionControl?.updateValueAndValidity()
    })

    // Add custom validation for grace periods
    this.bonoForm.get("plazoTotal")?.valueChanges.subscribe(() => {
      this.updateGracePeriodValidation()
    })

    this.bonoForm.get("plazoGraciaTotal")?.valueChanges.subscribe(() => {
      this.updateGracePeriodValidation()
    })

    this.bonoForm.get("plazoGraciaParcial")?.valueChanges.subscribe(() => {
      this.updateGracePeriodValidation()
    })
  }

  updateGracePeriodValidation(): void {
    const plazoTotal = this.bonoForm.get("plazoTotal")?.value || 0
    const plazoGraciaTotal = this.bonoForm.get("plazoGraciaTotal")?.value || 0

    const plazoGraciaTotalControl = this.bonoForm.get("plazoGraciaTotal")
    const plazoGraciaParcialControl = this.bonoForm.get("plazoGraciaParcial")

    // Update validators
    plazoGraciaTotalControl?.setValidators([Validators.min(0), Validators.max(plazoTotal)])

    plazoGraciaParcialControl?.setValidators([Validators.min(0), Validators.max(plazoTotal - plazoGraciaTotal)])

    // Update validity without emitting new events to prevent infinite loops
    plazoGraciaTotalControl?.updateValueAndValidity({ emitEvent: false })
    plazoGraciaParcialControl?.updateValueAndValidity({ emitEvent: false })
  }

  calcularPeriodosAmortizacion(): number {
    const plazoTotal = this.bonoForm.get("plazoTotal")?.value || 0
    const plazoGraciaTotal = this.bonoForm.get("plazoGraciaTotal")?.value || 0
    const plazoGraciaParcial = this.bonoForm.get("plazoGraciaParcial")?.value || 0

    return Math.max(0, plazoTotal - plazoGraciaTotal - plazoGraciaParcial)
  }

  createForm(): FormGroup {
    return this.fb.group({
      nombre: ["", Validators.required],
      valorNominal: [null, [Validators.required, Validators.min(0.01)]],
      tasaInteres: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      tipoTasa: ["efectiva", Validators.required],
      capitalizacion: [undefined],
      plazoTotal: [null, [Validators.required, Validators.min(1)]],
      frecuenciaPago: [12, Validators.required],
      moneda: ["PEN", Validators.required],
      plazoGraciaTotal: [0, Validators.min(0)],
      plazoGraciaParcial: [0, Validators.min(0)],
      fechaEmision: [null, Validators.required],
    })
  }

  cargarBono(id: string): void {
    const bonoId = Number.parseInt(id, 10)
    this.bonoService.getBonoById(bonoId).subscribe({
      next: (bono) => {
        if (bono) {
          // Convertir la fecha de string a Date para el formulario
          const fechaEmision = typeof bono.fechaEmision === "string" ? new Date(bono.fechaEmision) : bono.fechaEmision

          this.bonoForm.patchValue({
            ...bono,
            fechaEmision,
            tipoTasa: bono.tipoTasa.toLowerCase(), // Convertir de enum a lowercase
          })
          this.isLoading = false
        } else {
          this.snackBar.open("Bono no encontrado", "Cerrar", { duration: 5000 })
          this.router.navigate(["/dashboard"])
        }
      },
      error: () => {
        this.isLoading = false
        this.snackBar.open("Error al cargar el bono", "Cerrar", { duration: 5000 })
        this.router.navigate(["/dashboard"])
      },
    })
  }

  onSubmit(): void {
    if (this.bonoForm.valid) {
      this.isSaving = true

      const bonoData: Bono = {
        ...this.bonoForm.value,
      }

      if (this.isEditMode && this.bonoId) {
        bonoData.id = Number.parseInt(this.bonoId, 10)
      }

      this.bonoService.saveBono(bonoData).subscribe({
        next: (bono) => {
          this.isSaving = false
          this.snackBar.open(`Bono ${this.isEditMode ? "actualizado" : "creado"} correctamente`, "Cerrar", {
            duration: 3000,
          })

          if (this.isEditMode) {
            this.router.navigate(["/detalle-bono", bono.id])
          } else {
            this.router.navigate(["/dashboard"])
          }
        },
        error: (error) => {
          this.isSaving = false
          this.snackBar.open(
            error.message || `Error al ${this.isEditMode ? "actualizar" : "crear"} el bono`,
            "Cerrar",
            {
              duration: 5000,
            },
          )
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/dashboard"])
  }
}
