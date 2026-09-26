import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NombreCatalogo } from './horarios-catalogo.service';

@Injectable({
  providedIn: 'root',
})
export class AreasTrabajoService {
  private readonly baseUrl = `${environment.apiUrl}/areas-trabajo`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<NombreCatalogo[]> {
    return this.http.get<NombreCatalogo[]>(this.baseUrl);
  }

  crear(nombre: string): Observable<NombreCatalogo> {
    return this.http.post<NombreCatalogo>(this.baseUrl, { nombre });
  }
}
