import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HistoricoInventario {
  plantillaId: number;
  plantillaNombre: string;
  plantillaTipo: string;
  fecha: string;
  usuarioId: number;
  usuarioNombre: string;
}

export interface InventarioDetalleItem {
  itemNombre: string;
  itemCategoria: string;
  cantidadAnterior: number;
  cantidadActual: number;
}

@Injectable({
  providedIn: 'root',
})
export class HistoricoService {
  private readonly baseUrl = `${environment.apiUrl}/inventario`;

  constructor(private readonly http: HttpClient) {}

  buscar(plantillaId: number | null, fecha: string | null): Observable<HistoricoInventario[]> {
    let params = new HttpParams();
    if (plantillaId != null) {
      params = params.set('plantillaId', plantillaId);
    }
    if (fecha) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<HistoricoInventario[]>(`${this.baseUrl}/historico`, { params });
  }

  obtenerDetalle(registro: HistoricoInventario): Observable<InventarioDetalleItem[]> {
    const params = new HttpParams()
      .set('plantillaId', registro.plantillaId)
      .set('fecha', registro.fecha)
      .set('usuarioId', registro.usuarioId);
    return this.http.get<InventarioDetalleItem[]>(`${this.baseUrl}/detalle`, { params });
  }
}
