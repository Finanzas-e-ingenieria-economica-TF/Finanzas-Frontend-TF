import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatMenuModule } from "@angular/material/menu"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import {  MatDialog, MatDialogModule } from "@angular/material/dialog"
import  { BonoService } from "../../services/bono.service"
import { Bono } from "../../models/bono.model"

interface ResumenBonos {
  totalBonos: number
  valorNominalTotal: number
  tasaPromedio: number
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  template: `
    <div class="dashboard-container">
      <div class="header-actions">
        <h1>Bonos Corporativos</h1>
        <button mat-raised-button color="primary" (click)="crearNuevoBono()">
          <mat-icon>add</mat-icon> Nuevo Bono
        </button>
      </div>

      <mat-card class="summary-card" *ngIf="!isLoading && bonos.length > 0">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>dashboard</mat-icon>
            Resumen de Bonos
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-number">{{resumenBonos?.totalBonos}}</div>
              <div class="summary-label">Total de Bonos</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">{{resumenBonos?.valorNominalTotal | currency:'PEN':'symbol':'1.0-0'}}</div>
              <div class="summary-label">Valor Nominal Total</div>
            </div>
            <div class="summary-item">
              <div class="summary-number">{{resumenBonos?.tasaPromedio | percent:'1.2-2'}}</div>
              <div class="summary-label">Tasa Promedio</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div *ngIf="isLoading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <div *ngIf="!isLoading && bonos.length === 0" class="empty-state">
            <mat-icon>assignment</mat-icon>
            <p>No hay bonos registrados</p>
            <button mat-raised-button color="primary" (click)="crearNuevoBono()">
              Crear Primer Bono
            </button>
          </div>

          <table mat-table [dataSource]="bonos" *ngIf="!isLoading && bonos.length > 0" class="full-width">
            <!-- Nombre Column -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let bono">{{bono.nombre}}</td>
            </ng-container>

            <!-- Valor Nominal Column -->
            <ng-container matColumnDef="valorNominal">
              <th mat-header-cell *matHeaderCellDef>Valor Nominal</th>
              <td mat-cell *matCellDef="let bono">{{bono.valorNominal | currency:bono.moneda}}</td>
            </ng-container>

            <!-- Tasa Interés Column -->
            <ng-container matColumnDef="tasaInteres">
              <th mat-header-cell *matHeaderCellDef>Tasa de Interés</th>
              <td mat-cell *matCellDef="let bono">
                {{bono.tasaInteres | percent:'1.2-2'}}
                ({{bono.tipoTasa === 'efectiva' ? 'Efectiva' : 'Nominal'}})
              </td>
            </ng-container>

            <!-- Plazo Column -->
            <ng-container matColumnDef="plazo">
              <th mat-header-cell *matHeaderCellDef>Plazo</th>
              <td mat-cell *matCellDef="let bono">{{bono.plazoTotal}} períodos</td>
            </ng-container>

            <!-- Fecha Emisión Column -->
            <ng-container matColumnDef="fechaEmision">
              <th mat-header-cell *matHeaderCellDef>Fecha Emisión</th>
              <td mat-cell *matCellDef="let bono">{{bono.fechaEmision | date:'dd/MM/yyyy'}}</td>
            </ng-container>

            <!-- Acciones Column -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let bono" (click)="$event.stopPropagation()">
                <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Acciones">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="verDetalle(bono)">
                    <mat-icon>visibility</mat-icon>
                    <span>Ver Detalle</span>
                  </button>
                  <button mat-menu-item (click)="editarBono(bono)">
                    <mat-icon>edit</mat-icon>
                    <span>Editar</span>
                  </button>
                  <button mat-menu-item (click)="eliminarBono(bono)">
                    <mat-icon>delete</mat-icon>
                    <span>Eliminar</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="verDetalle(row)" class="row-clickable"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 20px;
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .full-width {
        width: 100%;
      }

      .loading-container {
        display: flex;
        justify-content: center;
        padding: 40px;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #666;
      }

      .empty-state mat-icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        margin-bottom: 16px;
      }

      .row-clickable {
        cursor: pointer;
      }

      .row-clickable:hover {
        background-color: #f5f5f5;
      }

      .summary-card {
        margin-bottom: 20px;
      }

      .summary-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1976d2;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }

      .summary-item {
        text-align: center;
        padding: 16px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
        border-radius: 8px;
      }

      .summary-number {
        font-size: 24px;
        font-weight: 600;
        color: #1976d2;
        margin-bottom: 4px;
      }

      .summary-label {
        font-size: 14px;
        color: #666;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  bonos: Bono[] = []
  isLoading = true
  displayedColumns: string[] = ["nombre", "valorNominal", "tasaInteres", "plazo", "fechaEmision", "acciones"]
  resumenBonos: ResumenBonos | undefined

  constructor(
    private bonoService: BonoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargarBonos()
    this.cargarResumen()
  }

  cargarBonos(): void {
    this.isLoading = true
    this.bonoService.getBonos().subscribe({
      next: (bonos) => {
        this.bonos = bonos
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
        this.snackBar.open("Error al cargar los bonos", "Cerrar", {
          duration: 5000,
        })
      },
    })
  }

  cargarResumen(): void {
    this.bonoService.getResumenBonos().subscribe({
      next: (resumen) => {
        this.resumenBonos = resumen
      },
      error: (error) => {
        console.error("Error al cargar resumen:", error)

        this.calcularResumenLocal()
      },
    })
  }

  private calcularResumenLocal(): void {
    this.resumenBonos = {
      totalBonos: this.bonos.length,
      valorNominalTotal: this.getTotalValorNominal(),
      tasaPromedio: this.getPromedioTasa(),
    }
  }

  crearNuevoBono(): void {
    this.router.navigate(["/nuevo-bono"])
  }

  verDetalle(bono: Bono): void {
    this.router.navigate(["/detalle-bono", bono.id])
  }

  editarBono(bono: Bono): void {
    this.router.navigate(["/editar-bono", bono.id])
  }

  eliminarBono(bono: Bono): void {
    if (confirm(`¿Está seguro que desea eliminar el bono "${bono.nombre}"?`)) {
      this.bonoService.deleteBono(bono.id!).subscribe({
        next: () => {
          this.snackBar.open("Bono eliminado correctamente", "Cerrar", {
            duration: 3000,
          })
          this.cargarBonos()
          this.cargarResumen()
        },
        error: () => {
          this.snackBar.open("Error al eliminar el bono", "Cerrar", {
            duration: 5000,
          })
        },
      })
    }
  }

  getTotalValorNominal(): number {
    return this.bonos.reduce((total, bono) => total + bono.valorNominal, 0)
  }

  getPromedioTasa(): number {
    if (this.bonos.length === 0) return 0
    const totalTasa = this.bonos.reduce((total, bono) => total + bono.tasaInteres, 0)
    return totalTasa / this.bonos.length
  }
}
