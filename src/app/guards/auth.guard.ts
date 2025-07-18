import { inject } from "@angular/core"
import { Router, type CanActivateFn } from "@angular/router"

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  if (localStorage.getItem("isLoggedIn") === "true") {
    return true
  }

  router.navigate(["/login"])
  return false
}
