import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"

export interface ConfirmDialogData {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "warning" | "danger" | "info"
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header" [ngClass]="'header-' + (data.type || 'warning')">
        <mat-icon class="dialog-icon">
          {{getIcon()}}
        </mat-icon>
        <h2 class="dialog-title">{{data.title}}</h2>
      </div>

      <div class="dialog-content">
        <p class="dialog-message">{{data.message}}</p>
      </div>

      <div class="dialog-actions">
        <button
          mat-button
          (click)="onCancel()"
          class="cancel-button">
          {{data.cancelText || 'Cancelar'}}
        </button>
        <button
          mat-raised-button
          (click)="onConfirm()"
          [ngClass]="'confirm-button-' + (data.type || 'warning')">
          {{data.confirmText || 'Confirmar'}}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-dialog {
        min-width: 400px;
        max-width: 500px;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        padding: 20px 24px 16px;
        border-radius: 4px 4px 0 0;
      }

      .header-warning {
        background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
        color: #f57c00;
      }

      .header-danger {
        background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
        color: #d32f2f;
      }

      .header-info {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        color: #1976d2;
      }

      .dialog-icon {
        font-size: 32px;
        height: 32px;
        width: 32px;
        margin-right: 16px;
      }

      .dialog-title {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .dialog-content {
        padding: 16px 24px;
      }

      .dialog-message {
        margin: 0;
        font-size: 16px;
        line-height: 1.5;
        color: #424242;
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 24px 20px;
      }

      .cancel-button {
        color: #666;
      }

      .confirm-button-warning {
        background-color: #ff9800;
        color: white;
      }

      .confirm-button-danger {
        background-color: #f44336;
        color: white;
      }

      .confirm-button-info {
        background-color: #2196f3;
        color: white;
      }

      .confirm-button-warning:hover {
        background-color: #f57c00;
      }

      .confirm-button-danger:hover {
        background-color: #d32f2f;
      }

      .confirm-button-info:hover {
        background-color: #1976d2;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case "danger":
        return "warning"
      case "info":
        return "info"
      case "warning":
      default:
        return "help_outline"
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true)
  }

  onCancel(): void {
    this.dialogRef.close(false)
  }
}
