import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, throwError } from "rxjs"
import  { HttpClient } from "@angular/common/http"
import { tap, catchError } from "rxjs/operators"
import { environment } from ".././environments/environment"

export interface User {
  id: number
  username: string
  nombre: string
  email: string
  fechaCreacion?: string
  activo?: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  nombre: string
  email: string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface LoginResponse {
  token: string
  usuario: User
  message: string
}

export interface ApiResponse<T> {
  message?: string
  data?: T
  error?: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()
  private apiUrl = environment.apiUrl

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    console.log("AuthService init - Token:", token ? "exists" : "not found")
    console.log("AuthService init - User:", storedUser ? "exists" : "not found")

    if (storedUser && token) {
      this.currentUserSubject.next(JSON.parse(storedUser))
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { username, password }
    console.log("Login attempt for user:", username)

    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, loginData).pipe(
      tap((response: LoginResponse) => {
        console.log("Login successful, response:", response)

        localStorage.setItem("token", response.token)
        localStorage.setItem("user", JSON.stringify(response.usuario))
        localStorage.setItem("isLoggedIn", "true")
        this.currentUserSubject.next(response.usuario)
      }),
      catchError((error) => {
        console.error("Error en login:", error)
        const errorMessage = error.error?.error || error.error?.message || "Error de conexión con el servidor"
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/auth/register`, userData).pipe(
      tap((response: any) => {
        console.log("Register response:", response)
      }),
      catchError((error) => {
        console.error("Error en registro:", error)
        const errorMessage = error.error?.error || error.error?.message || "Error de conexión con el servidor"
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/auth/change-password`, passwordData).pipe(
      tap((response: any) => {
        console.log("Change password response:", response)
      }),
      catchError((error) => {
        console.error("Error cambiando contraseña:", error)
        const errorMessage = error.error?.error || error.error?.message || "Error de conexión con el servidor"
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  logout(): void {
    console.log("Logging out user")
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    this.currentUserSubject.next(null)
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/auth/me`).pipe(
      tap((user: User) => {
        console.log("Current user response:", user)
        localStorage.setItem("user", JSON.stringify(user))
        this.currentUserSubject.next(user)
      }),
      catchError((error) => {
        console.error("Error obteniendo usuario actual:", error)
        return throwError(() => error)
      }),
    )
  }

  updateProfile(userData: RegisterRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/auth/profile`, userData).pipe(
      tap((response: any) => {
        console.log("Profile update response:", response)

        if (response && response.usuario) {
          localStorage.setItem("user", JSON.stringify(response.usuario))
          this.currentUserSubject.next(response.usuario)
        }
      }),
      catchError((error) => {
        console.error("Error actualizando perfil:", error)
        const errorMessage = error.error?.error || error.error?.message || "Error de conexión con el servidor"
        return throwError(() => new Error(errorMessage))
      }),
    )
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value
  }

  isLoggedIn(): boolean {
    const hasUser = !!this.currentUserSubject.value
    const hasToken = !!localStorage.getItem("token")
    console.log("isLoggedIn check - hasUser:", hasUser, "hasToken:", hasToken)
    return hasUser && hasToken
  }

  getToken(): string | null {
    const token = localStorage.getItem("token")
    console.log("getToken called, token exists:", !!token)
    return token
  }
}
