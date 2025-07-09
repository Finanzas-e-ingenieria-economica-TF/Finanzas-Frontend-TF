import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable, of, throwError } from "rxjs"
import  { HttpClient } from "@angular/common/http"
import { map, catchError, tap } from "rxjs/operators"
import { environment } from ".././environments/environment"
import  { Bono, FlujoCaja, ResultadosBono, Configuracion, ResumenBonos } from "../models/bono.model"

@Injectable({
  providedIn: "root",
})
export class BonoService {
  private bonos: Bono[] = []
  private bonosSubject = new BehaviorSubject<Bono[]>([])
  public bonos$ = this.bonosSubject.asObservable()
  private apiUrl = environment.apiUrl

  private configuracion: Configuracion = {
    monedas: ["PEN", "USD", "EUR"],
    monedaDefecto: "PEN",
    tipoTasaDefecto: "efectiva",
  }

  constructor(private http: HttpClient) {}

  getBonos(): Observable<Bono[]> {
    return this.http.get<Bono[]>(`${this.apiUrl}/api/bonos`).pipe(
      tap((bonos) => {
        this.bonos = bonos
        this.bonosSubject.next(bonos)
      }),
      catchError((error) => {
        console.error("Error obteniendo bonos:", error)
        return throwError(() => error)
      }),
    )
  }

  getBonoById(id: number): Observable<Bono | undefined> {
    return this.http.get<Bono>(`${this.apiUrl}/api/bonos/${id}`).pipe(
      catchError((error) => {
        console.error("Error obteniendo bono:", error)
        return throwError(() => error)
      }),
    )
  }

  saveBono(bono: Bono): Observable<Bono> {
    const bonoData = this.prepareBonoForApi(bono)

    console.log("Datos del bono a enviar:", bonoData)

    if (bono.id) {
      return this.http.put<any>(`${this.apiUrl}/api/bonos/${bono.id}`, bonoData).pipe(
        map((response) => response.bono || response),
        tap(() => this.refreshBonos()),
        catchError((error) => {
          console.error("Error actualizando bono:", error)
          const errorMessage = error.error?.error || "Error de conexión con el servidor"
          return throwError(() => new Error(errorMessage))
        }),
      )
    } else {
      return this.http.post<any>(`${this.apiUrl}/api/bonos`, bonoData).pipe(
        map((response) => response.bono || response),
        tap(() => this.refreshBonos()),
        catchError((error) => {
          console.error("Error creando bono:", error)
          const errorMessage = error.error?.error || "Error de conexión con el servidor"
          return throwError(() => new Error(errorMessage))
        }),
      )
    }
  }

  deleteBono(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/api/bonos/${id}`).pipe(
      map(() => true),
      tap(() => this.refreshBonos()),
      catchError((error) => {
        console.error("Error eliminando bono:", error)
        return throwError(() => error)
      }),
    )
  }

  getResumenBonos(): Observable<ResumenBonos> {
    return this.http.get<ResumenBonos>(`${this.apiUrl}/api/bonos/resumen`).pipe(
      catchError((error) => {
        console.error("Error obteniendo resumen:", error)
        return throwError(() => error)
      }),
    )
  }

  getConfiguracion(): Observable<Configuracion> {
    const configString = localStorage.getItem("configuracion")
    if (configString) {
      return of(JSON.parse(configString))
    } else {
      const defaultConfig: Configuracion = {
        monedas: ["PEN", "USD", "EUR"],
        monedaDefecto: "PEN",
        tipoTasaDefecto: "efectiva",
        capitalizacionDefecto: undefined,
      }
      return of(defaultConfig)
    }
  }

  saveConfiguracion(config: Configuracion): Observable<Configuracion> {
    this.configuracion = { ...config }
    localStorage.setItem("configuracion", JSON.stringify(this.configuracion))
    return of(this.configuracion)
  }

  calcularFlujoCaja(bono: Bono): ResultadosBono {
    const flujos: FlujoCaja[] = []
    const periodosTotales = bono.plazoTotal
    const periodosGraciaTotal = bono.plazoGraciaTotal
    const periodosGraciaParcial = bono.plazoGraciaParcial
    const periodosAmortizacion = periodosTotales - periodosGraciaTotal - periodosGraciaParcial

    if (periodosAmortizacion <= 0) {
      throw new Error("Los plazos de gracia no pueden ser mayores o iguales al plazo total")
    }

    const tasaEfectivaPeriodica = this.calcularTasaEfectivaPeriodica(bono)

    const cuotaAmortizacion = bono.valorNominal / periodosAmortizacion

    let saldo = bono.valorNominal
    let fechaPago = new Date(bono.fechaEmision)
    const diasPorPeriodo = Math.round(365 / bono.frecuenciaPago)

    for (let i = 1; i <= periodosTotales; i++) {
      fechaPago = new Date(fechaPago)
      fechaPago.setDate(fechaPago.getDate() + diasPorPeriodo)

      const saldoInicial = saldo
      const interes = saldo * tasaEfectivaPeriodica
      let amortizacion = 0
      let cuotaPeriodo = 0

      if (i <= periodosGraciaTotal) {
        // GRACIA TOTAL: No se paga nada, saldo se mantiene
        amortizacion = 0
        cuotaPeriodo = 0
        // El saldo NO cambia en gracia total
      } else if (i <= periodosGraciaTotal + periodosGraciaParcial) {
        // GRACIA PARCIAL: Solo se pagan intereses
        amortizacion = 0
        cuotaPeriodo = interes
        // El saldo NO cambia en gracia parcial
      } else {
        amortizacion = cuotaAmortizacion
        cuotaPeriodo = amortizacion + interes
        saldo = saldo - amortizacion
      }

      const flujoEmisor = i === 0 ? -bono.valorNominal : cuotaPeriodo
      const flujoBonista = i === 0 ? bono.valorNominal : -cuotaPeriodo

      flujos.push({
        periodo: i,
        fechaPago: new Date(fechaPago),
        saldoInicial,
        interes,
        cuota: cuotaPeriodo,
        amortizacion,
        saldoFinal: saldo,
        flujoEmisor: -cuotaPeriodo, // Negativo para el emisor (paga)
        flujoBonista: cuotaPeriodo, // Positivo para el bonista (recibe)
      })
    }

    const duracion = this.calcularDuracionMacaulay(flujos, bono, tasaEfectivaPeriodica)
    const duracionModificada = duracion / (1 + tasaEfectivaPeriodica)
    const convexidad = this.calcularConvexidad(flujos, bono, tasaEfectivaPeriodica)

    // Para TCEA: Flujo del emisor (paga el bono inicialmente, recibe pagos)
    const flujosTCEA = [-bono.valorNominal, ...flujos.map((f) => f.cuota)]
    // Para TREA: Flujo del bonista (paga inicialmente, recibe pagos)
    const flujosTREA = [-bono.valorNominal, ...flujos.map((f) => f.cuota)]

    const tcea = this.calcularTIR(flujosTCEA, bono.frecuenciaPago)
    const trea = this.calcularTIR(flujosTREA, bono.frecuenciaPago)
    const precioMaximo = this.calcularValorPresente(flujos, tasaEfectivaPeriodica)

    return {
      flujos,
      duracion,
      duracionModificada,
      convexidad,
      tcea,
      trea,
      precioMaximo,
    }
  }

  private prepareBonoForApi(bono: Bono): any {
    const bonoData = { ...bono }

    if (bonoData.fechaEmision) {
      let fecha: Date
      if (typeof bonoData.fechaEmision === "string") {
        fecha = new Date(bonoData.fechaEmision)
      } else {
        fecha = bonoData.fechaEmision
      }

      if (!isNaN(fecha.getTime())) {
        ;(bonoData as any).fechaEmision = fecha.toISOString().split("T")[0]
      }
    }

    if (bonoData.tipoTasa) {
      ;(bonoData as any).tipoTasa = bonoData.tipoTasa.toUpperCase()
    }

    return bonoData
  }

  private refreshBonos(): void {
    this.getBonos().subscribe()
  }

  private calcularDuracionMacaulay(flujos: FlujoCaja[], bono: Bono, tasaEfectivaPeriodica: number): number {
    let sumaPonderada = 0
    let sumaValoresPresentes = 0

    flujos.forEach((flujo) => {
      if (flujo.flujoBonista > 0) {
        const valorPresente = flujo.flujoBonista / Math.pow(1 + tasaEfectivaPeriodica, flujo.periodo)
        sumaPonderada += flujo.periodo * valorPresente
        sumaValoresPresentes += valorPresente
      }
    })

    return sumaValoresPresentes > 0 ? sumaPonderada / sumaValoresPresentes : 0
  }

  private calcularConvexidad(flujos: FlujoCaja[], bono: Bono, tasaEfectivaPeriodica: number): number {
    let sumaPonderada = 0
    let sumaValoresPresentes = 0

    flujos.forEach((flujo) => {
      if (flujo.flujoBonista > 0) {
        const valorPresente = flujo.flujoBonista / Math.pow(1 + tasaEfectivaPeriodica, flujo.periodo)
        sumaPonderada += flujo.periodo * (flujo.periodo + 1) * valorPresente
        sumaValoresPresentes += valorPresente
      }
    })

    const denominador = sumaValoresPresentes * Math.pow(1 + tasaEfectivaPeriodica, 2)
    return denominador > 0 ? sumaPonderada / denominador : 0
  }

  private calcularTIR(flujos: number[], frecuenciaPago: number): number {
    let tir = 0.05
    const precision = 0.0000001
    let iteraciones = 0
    const maxIteraciones = 1000

    const cambiosSigno = this.contarCambiosSigno(flujos)
    if (cambiosSigno === 0) {
      return 0
    }

    while (iteraciones < maxIteraciones) {
      const vpn = this.calcularVPN(flujos, tir)

      if (Math.abs(vpn) < precision) {
        break
      }

      const derivada = this.calcularDerivadaVPN(flujos, tir)

      if (Math.abs(derivada) < precision) {
        tir = this.calcularTIRBiseccion(flujos, -0.99, 5.0)
        break
      }

      const nuevaTir = tir - vpn / derivada
      const tirLimitada = Math.max(-0.99, Math.min(nuevaTir, 5.0))

      if (Math.abs(tirLimitada - tir) < precision) {
        tir = tirLimitada
        break
      }

      tir = tirLimitada
      iteraciones++
    }

    const tirAnual = Math.pow(1 + tir, frecuenciaPago) - 1
    return isNaN(tirAnual) || !isFinite(tirAnual) ? 0 : tirAnual
  }

  private contarCambiosSigno(flujos: number[]): number {
    let cambios = 0
    for (let i = 1; i < flujos.length; i++) {
      if (flujos[i] > 0 !== flujos[i - 1] > 0) {
        cambios++
      }
    }
    return cambios
  }

  private calcularTIRBiseccion(flujos: number[], min: number, max: number): number {
    const precision = 0.0000001
    let iteraciones = 0
    const maxIteraciones = 100

    while (iteraciones < maxIteraciones && max - min > precision) {
      const medio = (min + max) / 2
      const vpnMedio = this.calcularVPN(flujos, medio)

      if (Math.abs(vpnMedio) < precision) {
        return medio
      }

      const vpnMin = this.calcularVPN(flujos, min)

      if (vpnMin > 0 !== vpnMedio > 0) {
        max = medio
      } else {
        min = medio
      }

      iteraciones++
    }

    return (min + max) / 2
  }

  private calcularValorPresente(flujos: FlujoCaja[], tasaDescuento: number): number {
    let valorPresente = 0
    flujos.forEach((flujo) => {
      if (flujo.flujoBonista > 0) {
        valorPresente += flujo.flujoBonista / Math.pow(1 + tasaDescuento, flujo.periodo)
      }
    })
    return valorPresente
  }

  private calcularTasaEfectivaPeriodica(bono: Bono): number {
    if (bono.tipoTasa === "efectiva") {
      return Math.pow(1 + bono.tasaInteres, 1 / bono.frecuenciaPago) - 1
    } else {
      const m = bono.capitalizacion || 1
      const tasaEfectivaAnual = Math.pow(1 + bono.tasaInteres / m, m) - 1
      return Math.pow(1 + tasaEfectivaAnual, 1 / bono.frecuenciaPago) - 1
    }
  }

  private calcularVPN(flujos: number[], tasa: number): number {
    let vpn = 0
    for (let i = 0; i < flujos.length; i++) {
      vpn += flujos[i] / Math.pow(1 + tasa, i)
    }
    return vpn
  }

  private calcularDerivadaVPN(flujos: number[], tasa: number): number {
    let derivada = 0
    for (let i = 1; i < flujos.length; i++) {
      derivada -= (i * flujos[i]) / Math.pow(1 + tasa, i + 1)
    }
    return derivada
  }
}
