export interface Bono {
  id?: number
  nombre: string
  valorNominal: number
  tasaInteres: number
  tipoTasa: "efectiva" | "nominal"
  capitalizacion?: number
  plazoTotal: number
  frecuenciaPago: number
  moneda: string
  plazoGraciaTotal: number
  plazoGraciaParcial: number
  fechaEmision: string
  fechaCreacion?: string
  fechaModificacion?: string
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
