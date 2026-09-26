import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Item {
  id: number;
  nombre: string;
  categoria: string;
  estado: string;
  plantillaId: number;
  plantillaNombre: string;
}

export interface ItemPayload {
  nombre: string;
  categoria: string;
  estado: string;
  plantillaId: number;
}

export interface ImportItemsError {
  fila: number;
  motivo: string;
}

export interface ImportItemsResult {
  insertados: number;
  errores: ImportItemsError[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private readonly baseUrl = `${environment.apiUrl}/items`;

  constructor(private readonly http: HttpClient) {}

  listarPorPlantilla(plantillaId: number): Observable<Item[]> {
    const params = new HttpParams().set('plantillaId', plantillaId);
    return this.http.get<Item[]>(this.baseUrl, { params });
  }

  crear(payload: ItemPayload): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, payload);
  }

  cargarExcel(file: File): Observable<ImportItemsResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportItemsResult>(`${this.baseUrl}/carga-masiva`, formData);
  }
}
