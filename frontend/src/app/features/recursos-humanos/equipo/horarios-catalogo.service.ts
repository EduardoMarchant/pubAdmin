import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface NombreCatalogo {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class HorariosCatalogoService {
  private readonly baseUrl = `${environment.apiUrl}/horarios`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<NombreCatalogo[]> {
    return this.http.get<NombreCatalogo[]>(this.baseUrl);
  }

  crear(nombre: string): Observable<NombreCatalogo> {
    return this.http.post<NombreCatalogo>(this.baseUrl, { nombre });
  }
}
