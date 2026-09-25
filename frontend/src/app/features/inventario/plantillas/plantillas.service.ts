import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Plantilla {
  id: number;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
}

export interface PlantillaPayload {
  nombre: string;
  tipo: string;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlantillasService {
  private readonly baseUrl = `${environment.apiUrl}/plantillas`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Plantilla[]> {
    return this.http.get<Plantilla[]>(this.baseUrl);
  }

  crear(payload: PlantillaPayload): Observable<Plantilla> {
    return this.http.post<Plantilla>(this.baseUrl, payload);
  }

  actualizar(id: number, payload: PlantillaPayload): Observable<Plantilla> {
    return this.http.put<Plantilla>(`${this.baseUrl}/${id}`, payload);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
