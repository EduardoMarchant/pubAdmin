import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ItemParaInventario {
  itemId: number;
  itemNombre: string;
  itemCategoria: string;
  itemEstado: string;
  cantidadAnterior: number;
  cantidadActualHoy: number;
}

export interface RegistroInventario {
  itemId: number;
  cantidadActual: number;
}

export interface GuardarInventarioPayload {
  plantillaId: number;
  registros: RegistroInventario[];
}

export interface GuardarInventarioResult {
  guardados: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private readonly baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private readonly http: HttpClient) {}

  preparar(plantillaId: number): Observable<ItemParaInventario[]> {
    const params = new HttpParams().set('plantillaId', plantillaId);
    return this.http.get<ItemParaInventario[]>(`${this.baseUrl}/preparar`, { params });
  }

  guardar(payload: GuardarInventarioPayload): Observable<GuardarInventarioResult> {
    return this.http.post<GuardarInventarioResult>(this.baseUrl, payload);
  }
}
