export interface Bono {
  id?: number // Cambiado de string a number para coincidir con Long del backend
  nombre: string
  valorNominal: number // Se mantiene como number, el backend maneja BigDecimal
  tasaInteres: number // Se mantiene como number, el backend maneja BigDecimal
  tipoTasa: "efectiva" | "nominal" // Se mantiene como string en frontend
  capitalizacion?: number
  plazoTotal: number
  frecuenciaPago: number
  moneda: string
  plazoGraciaTotal: number
  plazoGraciaParcial: number
  fechaEmision: string // Cambiado a string para manejar LocalDate del backend (yyyy-MM-dd)
  fechaCreacion?: string // Cambiado a string para manejar LocalDateTime del backend
  fechaModificacion?: string // Cambiado a string para manejar LocalDateTime del backend
}

export interface FlujoCaja {
  periodo: number
  fechaPago: Date
  saldoInicial: number
  interes: number
  cuota: number
  amortizacion: number
  saldoFinal: number
  flujoEmisor: number
  flujoBonista: number
}

export interface ResultadosBono {
  flujos: FlujoCaja[]
  convexidad: number
  duracion: number
  duracionModificada: number
  tcea: number
  trea: number
  precioMaximo: number
}

export interface Configuracion {
  monedas: string[]
  monedaDefecto: string
  tipoTasaDefecto: "efectiva" | "nominal"
  capitalizacionDefecto?: number
}

// Interfaces para las respuestas del backend
export interface ApiResponse<T> {
  message?: string
  data?: T
  error?: string
}

export interface LoginResponse {
  token: string
  usuario: User
  message: string
}

export interface User {
  id: number
  username: string
  nombre: string
  email: string
  fechaCreacion?: string
  activo?: boolean
}

export interface ResumenBonos {
  totalBonos: number
  valorNominalTotal: number
  tasaPromedio: number
}
