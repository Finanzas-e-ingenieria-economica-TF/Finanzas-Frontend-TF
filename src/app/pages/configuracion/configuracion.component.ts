import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, type FormArray } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { BonoService } from "../../services/bono.service"
import { Configuracion } from "../../models/bono.model"

@Component({
  selector: "app-configuracion",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="config-container">
      <div class="header-actions">
        <h1>Configuración del Sistema</h1>
        <button mat-button color="primary" (click)="volver()">
          Volver al Dashboard
        </button>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card *ngIf="!isLoading">
        <mat-card-content>
          <form [formGroup]="configForm" (ngSubmit)="onSubmit()">
            <h2>Configuración General</h2>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Moneda por Defecto</mat-label>
                <mat-select formControlName="monedaDefecto">
                  <mat-option *ngFor="let moneda of getMonedasArray()" [value]="moneda">
                    {{moneda}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Tasa por Defecto</mat-label>
                <mat-select formControlName="tipoTasaDefecto">
                  <mat-option value="efectiva">Efectiva</mat-option>
                  <mat-option value="nominal">Nominal</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row" *ngIf="configForm.controls['tipoTasaDefecto'].value === 'nominal'">
              <mat-form-field appearance="outline">
                <mat-label>Capitalización por Defecto</mat-label>
                <input matInput type="number" formControlName="capitalizacionDefecto" placeholder="Ej. 12 (mensual)">
                <mat-error *ngIf="configForm.controls['capitalizacionDefecto'].errors && configForm.controls['capitalizacionDefecto'].errors['required']">
                  La capitalización es requerida para tasas nominales
                </mat-error>
                <mat-error *ngIf="configForm.controls['capitalizacionDefecto'].errors && configForm.controls['capitalizacionDefecto'].errors['min']">
                  La capitalización debe ser mayor a 0
                </mat-error>
              </mat-form-field>
            </div>

            <h2>Monedas Disponibles</h2>

            <div formArrayName="monedas" class="monedas-container">
              <div *ngFor="let moneda of monedasArray.controls; let i = index" class="moneda-item">
                <mat-form-field appearance="outline">
                  <mat-label>Moneda {{i + 1}}</mat-label>
                  <input matInput [formControlName]="i" placeholder="Ej. USD">
                  <button
                    mat-icon-button
                    matSuffix
                    type="button"
                    *ngIf="monedasArray.length > 1"
                    (click)="eliminarMoneda(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-form-field>
              </div>

              <button
                mat-stroked-button
                type="button"
                (click)="agregarMoneda()">
                <mat-icon>add</mat-icon> Agregar Moneda
              </button>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="volver()">Cancelar</button>
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="configForm.invalid || isSaving">
                <span *ngIf="!isSaving">Guardar Configuración</span>
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
      .config-container {
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
        max-width: 400px;
      }

      h2 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-size: 18px;
        font-weight: 500;
      }

      .monedas-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
        max-width: 400px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 24px;
      }
    `,
  ],
})
export class ConfiguracionComponent implements OnInit {
  configForm: FormGroup
  isLoading = true
  isSaving = false

  constructor(
    private fb: FormBuilder,
    private bonoService: BonoService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.configForm = this.createForm()
  }

  ngOnInit(): void {
    this.cargarConfiguracion()


    this.configForm.get("tipoTasaDefecto")?.valueChanges.subscribe((value) => {
      const capitalizacionControl = this.configForm.get("capitalizacionDefecto")
      if (value === "nominal") {
        capitalizacionControl?.setValidators([Validators.required, Validators.min(1)])
      } else {
        capitalizacionControl?.clearValidators()
        capitalizacionControl?.setValue(undefined)
      }
      capitalizacionControl?.updateValueAndValidity()
    })
  }

  createForm(): FormGroup {
    return this.fb.group({
      monedaDefecto: ["PEN", Validators.required],
      tipoTasaDefecto: ["efectiva", Validators.required],
      capitalizacionDefecto: [undefined],
      monedas: this.fb.array([this.fb.control("PEN", Validators.required)]),
    })
  }

  get monedasArray(): FormArray {
    return this.configForm.get("monedas") as FormArray
  }

  getMonedasArray(): string[] {
    return this.monedasArray.controls.map((control) => control.value)
  }

  agregarMoneda(): void {
    this.monedasArray.push(this.fb.control("", Validators.required))
  }

  eliminarMoneda(index: number): void {
    this.monedasArray.removeAt(index)


    const monedaDefecto = this.configForm.get("monedaDefecto")?.value
    if (!this.getMonedasArray().includes(monedaDefecto) && this.monedasArray.length > 0) {
      this.configForm.get("monedaDefecto")?.setValue(this.monedasArray.at(0).value)
    }
  }

  cargarConfiguracion(): void {
    this.bonoService.getConfiguracion().subscribe({
      next: (config) => {

        while (this.monedasArray.length > 0) {
          this.monedasArray.removeAt(0)
        }


        config.monedas.forEach((moneda) => {
          this.monedasArray.push(this.fb.control(moneda, Validators.required))
        })

        
        this.configForm.patchValue({
          monedaDefecto: config.monedaDefecto,
          tipoTasaDefecto: config.tipoTasaDefecto,
          capitalizacionDefecto: config.capitalizacionDefecto,
        })

        this.isLoading = false
      },
      error: () => {
        this.isLoading = false
        this.snackBar.open("Error al cargar la configuración", "Cerrar", { duration: 5000 })
      },
    })
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      this.isSaving = true

      const configData: Configuracion = {
        monedas: this.getMonedasArray(),
        monedaDefecto: this.configForm.get("monedaDefecto")?.value,
        tipoTasaDefecto: this.configForm.get("tipoTasaDefecto")?.value,
        capitalizacionDefecto: this.configForm.get("capitalizacionDefecto")?.value,
      }

      this.bonoService.saveConfiguracion(configData).subscribe({
        next: () => {
          this.isSaving = false
          this.snackBar.open("Configuración guardada correctamente", "Cerrar", { duration: 3000 })
          this.router.navigate(["/dashboard"])
        },
        error: () => {
          this.isSaving = false
          this.snackBar.open("Error al guardar la configuración", "Cerrar", { duration: 5000 })
        },
      })
    }
  }

  volver(): void {
    this.router.navigate(["/dashboard"])
  }
}
