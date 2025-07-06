import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatTabsModule } from "@angular/material/tabs"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { BonoService } from "../../services/bono.service"
import { Bono, ResultadosBono } from "../../models/bono.model"

@Component({
  selector: "app-bono-detalle",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="detalle-container">
      <div class="header-actions">
        <h1>Detalle del Bono</h1>
        <div>
          <button mat-button color="primary" (click)="volver()">
            Volver al Dashboard
          </button>
          <button mat-raised-button color="primary" (click)="editarBono()" *ngIf="bono">
            <mat-icon>edit</mat-icon> Editar Bono
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <ng-container *ngIf="!isLoading && bono">
        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre</div>
                <div class="info-value">{{bono.nombre}}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Valor Nominal</div>
                <div class="info-value">{{bono.valorNominal | currency:bono.moneda}}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tasa de Interés</div>
                <div class="info-value">
                  {{bono.tasaInteres | percent:'1.2-2'}}
                  ({{bono.tipoTasa === 'efectiva' ? 'Efectiva' : 'Nominal'}})
                  <span *ngIf="bono.tipoTasa === 'nominal'">
                    - Capitalización: {{bono.capitalizacion}} veces/año
                  </span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Plazo</div>
                <div class="info-value">
                  {{bono.plazoTotal}} períodos
                  (Frecuencia: {{bono.frecuenciaPago}} pagos/año)
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Plazos de Gracia</div>
                <div class="info-value">
                  Total: {{bono.plazoGraciaTotal}} períodos,
                  Parcial: {{bono.plazoGraciaParcial}} períodos
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Fecha de Emisión</div>
                <div class="info-value">{{bono.fechaEmision | date:'dd/MM/yyyy'}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Información del Método de Cálculo
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="metodo-info">
              <p><strong>Método Alemán:</strong> Sistema de amortización con cuotas de capital constantes.</p>
              <p><strong>Características:</strong></p>
              <ul>
                <li>Amortización constante: {{(bono.valorNominal / (bono.plazoTotal - bono.plazoGraciaTotal - bono.plazoGraciaParcial)) | currency:bono.moneda}}</li>
                <li>Intereses decrecientes sobre saldo pendiente</li>
                <li>Cuotas decrecientes en el tiempo</li>
              </ul>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="resultados-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>analytics</mat-icon>
              Resultados del Análisis Financiero
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="resultados-principales">
              <div class="resultado-destacado">
                <div class="resultado-icono">
                  <mat-icon>trending_up</mat-icon>
                </div>
                <div class="resultado-info">
                  <div class="resultado-label">TCEA (Tasa de Costo Efectiva Anual)</div>
                  <div class="resultado-value destacado">{{resultados.tcea | percent:'1.4-4'}}</div>
                  <div class="resultado-descripcion">Costo efectivo para el emisor</div>
                </div>
              </div>

              <div class="resultado-destacado">
                <div class="resultado-icono">
                  <mat-icon>account_balance</mat-icon>
                </div>
                <div class="resultado-info">
                  <div class="resultado-label">TREA (Tasa de Rendimiento Efectiva Anual)</div>
                  <div class="resultado-value destacado">{{resultados.trea | percent:'1.4-4'}}</div>
                  <div class="resultado-descripcion">Rendimiento efectivo para el bonista</div>
                </div>
              </div>

              <div class="resultado-destacado">
                <div class="resultado-icono">
                  <mat-icon>monetization_on</mat-icon>
                </div>
                <div class="resultado-info">
                  <div class="resultado-label">Precio del Bono</div>
                  <div class="resultado-value destacado">{{resultados.precioMaximo | currency:bono.moneda:'symbol':'1.2-2'}}</div>
                  <div class="resultado-descripcion">Valor presente de los flujos futuros</div>
                </div>
              </div>
            </div>

            <div class="resultados-adicionales">
              <h3>Métricas de Riesgo</h3>
              <div class="metricas-grid">
                <div class="metrica-item">
                  <mat-icon>schedule</mat-icon>
                  <div class="metrica-content">
                    <div class="metrica-label">Duración (Macaulay)</div>
                    <div class="metrica-value">{{resultados.duracion | number:'1.4-4'}} períodos</div>
                  </div>
                </div>

                <div class="metrica-item">
                  <mat-icon>timeline</mat-icon>
                  <div class="metrica-content">
                    <div class="metrica-label">Duración Modificada</div>
                    <div class="metrica-value">{{resultados.duracionModificada | number:'1.4-4'}} períodos</div>
                  </div>
                </div>

                <div class="metrica-item">
                  <mat-icon>show_chart</mat-icon>
                  <div class="metrica-content">
                    <div class="metrica-label">Convexidad</div>
                    <div class="metrica-value">{{resultados.convexidad | number:'1.4-4'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-content>
            <h2>Flujo de Caja</h2>
            <div class="table-container">
              <table mat-table [dataSource]="resultados.flujos" class="full-width">
                <!-- Periodo Column -->
                <ng-container matColumnDef="periodo">
                  <th mat-header-cell *matHeaderCellDef>Período</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.periodo}}</td>
                </ng-container>

                <!-- Fecha Column -->
                <ng-container matColumnDef="fecha">
                  <th mat-header-cell *matHeaderCellDef>Fecha</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.fechaPago | date:'dd/MM/yyyy'}}</td>
                </ng-container>

                <!-- Saldo Inicial Column -->
                <ng-container matColumnDef="saldoInicial">
                  <th mat-header-cell *matHeaderCellDef>Saldo Inicial</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.saldoInicial | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Interés Column -->
                <ng-container matColumnDef="interes">
                  <th mat-header-cell *matHeaderCellDef>Interés</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.interes | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Amortización Column -->
                <ng-container matColumnDef="amortizacion">
                  <th mat-header-cell *matHeaderCellDef>Amortización</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.amortizacion | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Cuota Column -->
                <ng-container matColumnDef="cuota">
                  <th mat-header-cell *matHeaderCellDef>Cuota</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.cuota | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Saldo Final Column -->
                <ng-container matColumnDef="saldoFinal">
                  <th mat-header-cell *matHeaderCellDef>Saldo Final</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.saldoFinal | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Flujo Emisor Column -->
                <ng-container matColumnDef="flujoEmisor">
                  <th mat-header-cell *matHeaderCellDef>Flujo Emisor</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.flujoEmisor | currency:bono.moneda}}</td>
                </ng-container>

                <!-- Flujo Bonista Column -->
                <ng-container matColumnDef="flujoBonista">
                  <th mat-header-cell *matHeaderCellDef>Flujo Bonista</th>
                  <td mat-cell *matCellDef="let flujo">{{flujo.flujoBonista | currency:bono.moneda}}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .detalle-container {
        padding: 20px;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .header-actions div {
        display: flex;
        gap: 10px;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 40px;
      }

      .info-card, .resultados-card {
        margin-bottom: 20px;
      }

      .info-grid, .resultados-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }

      .info-item, .resultado-item {
        padding: 8px;
      }

      .info-label, .resultado-label {
        font-weight: 500;
        color: #666;
        margin-bottom: 4px;
      }

      .info-value, .resultado-value {
        font-size: 16px;
      }

      .resultado-value {
        font-weight: 500;
      }

      .table-container {
        overflow-x: auto;
        max-height: 500px;
        overflow-y: auto;
      }

      .full-width {
        width: 100%;
      }

      .resultados-card {
        margin-bottom: 20px;
      }

      .resultados-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
      }

      .resultados-principales {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .resultado-destacado {
        display: flex;
        align-items: center;
        padding: 16px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-radius: 12px;
        border-left: 4px solid #1976d2;
      }

      .resultado-icono {
        background-color: #1976d2;
        color: white;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 16px;
      }

      .resultado-info {
        flex-grow: 1;
      }

      .resultado-label {
        font-weight: 500;
        color: #666;
        margin-bottom: 4px;
        font-size: 14px;
      }

      .resultado-value.destacado {
        font-size: 24px;
        font-weight: 600;
        color: #1976d2;
        margin-bottom: 4px;
      }

      .resultado-descripcion {
        font-size: 12px;
        color: #888;
      }

      .resultados-adicionales h3 {
        color: #333;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
      }

      .metricas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .metrica-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
      }

      .metrica-item mat-icon {
        color: #4caf50;
        margin-right: 12px;
      }

      .metrica-content {
        flex-grow: 1;
      }

      .metrica-label {
        font-weight: 500;
        color: #555;
        font-size: 13px;
        margin-bottom: 2px;
      }

      .metrica-value {
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    `,
  ],
})
export class BonoDetalleComponent implements OnInit {
  bono: Bono | null = null
  resultados: ResultadosBono = {
    flujos: [],
    duracion: 0,
    duracionModificada: 0,
    convexidad: 0,
    tcea: 0,
    trea: 0,
    precioMaximo: 0,
  }
  isLoading = true
  displayedColumns: string[] = [
    "periodo",
    "fecha",
    "saldoInicial",
    "interes",
    "amortizacion",
    "cuota",
    "saldoFinal",
    "flujoEmisor",
    "flujoBonista",
  ]

  constructor(
    private bonoService: BonoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.cargarBono(id)
    } else {
      this.isLoading = false
      this.snackBar.open("ID de bono no proporcionado", "Cerrar", { duration: 5000 })
      this.router.navigate(["/dashboard"])
    }
  }

  cargarBono(id: string): void {
    const bonoId = Number.parseInt(id, 10)
    this.bonoService.getBonoById(bonoId).subscribe({
      next: (bono) => {
        if (bono) {
          this.bono = bono
          this.calcularResultados()
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

  calcularResultados(): void {
    if (this.bono) {
      this.resultados = this.bonoService.calcularFlujoCaja(this.bono)
      this.isLoading = false
    }
  }

  editarBono(): void {
    if (this.bono) {
      this.router.navigate(["/editar-bono", this.bono.id])
    }
  }

  volver(): void {
    this.router.navigate(["/dashboard"])
  }

  eliminarBono(bono: Bono): void {
    if (confirm(`¿Está seguro que desea eliminar el bono "${bono.nombre}"?`)) {
      this.bonoService.deleteBono(bono.id!).subscribe({
        next: () => {
          this.snackBar.open("Bono eliminado correctamente", "Cerrar", {
            duration: 3000,
          })
          this.cargarBonos()
        },
        error: () => {
          this.snackBar.open("Error al eliminar el bono", "Cerrar", {
            duration: 5000,
          })
        },
      })
    }
  }

  cargarBonos(): void {
    this.router.navigate(["/dashboard"])
  }
}
