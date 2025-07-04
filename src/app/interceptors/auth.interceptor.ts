import { inject } from "@angular/core"
import type { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http"
import { catchError } from "rxjs/operators"
import { throwError } from "rxjs"
import { Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const snackBar = inject(MatSnackBar)

  // Obtener el token del localStorage
  const token = localStorage.getItem("token")

  // Clonar la request y agregar el header de autorización si existe el token
  let authReq = req
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Continuar con la request y manejar errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error("HTTP Error:", error)

      if (error.status === 401 || error.status === 403) {
        // Token expirado o inválido
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("isLoggedIn")
        router.navigate(["/login"])
        snackBar.open("Sesión expirada. Por favor, inicie sesión nuevamente.", "Cerrar", {
          duration: 5000,
        })
      }
      return throwError(() => error)
    }),
  )
}
