import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { EquipoService, Integrante } from '../equipo/equipo.service';
import { HorariosCatalogoService, NombreCatalogo } from '../equipo/horarios-catalogo.service';

interface DiaSemana {
  nombre: string;
  fechaCorta: string;
}

interface ChipArrastrable {
  tipo: 'alias' | 'horario';
  etiqueta: string;
}

interface ItemAsignado {
  id: number;
  etiqueta: string;
}

interface SubFilaCelda {
  id: number;
  alias: ItemAsignado | null;
  horario: ItemAsignado | null;
}

const NOMBRES_DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function obtenerIsoWeek(fecha: Date): { anio: number; semana: number } {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const diaNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - diaNum);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const semana = Math.ceil(((d.getTime() - inicioAnio.getTime()) / 86400000 + 1) / 7);
  return { anio: d.getUTCFullYear(), semana };
}

function semanaIsoString(fecha: Date): string {
  const { anio, semana } = obtenerIsoWeek(fecha);
  return `${anio}-W${String(semana).padStart(2, '0')}`;
}

function lunesDeSemanaIso(valor: string): Date {
  const [anioStr, semanaStr] = valor.split('-W');
  const anio = Number(anioStr);
  const semana = Number(semanaStr);
  const jan4 = new Date(Date.UTC(anio, 0, 4));
  const diaJan4 = jan4.getUTCDay() || 7;
  const lunes = new Date(jan4);
  lunes.setUTCDate(jan4.getUTCDate() - diaJan4 + 1 + (semana - 1) * 7);
  return lunes;
}

@Component({
  selector: 'app-rrhh-horarios',
  standalone: true,
  imports: [],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss',
})
export class HorariosComponent implements OnInit {
  private readonly equipoService = inject(EquipoService);
  private readonly horariosCatalogoService = inject(HorariosCatalogoService);

  readonly etiquetasFilas = ['Garzones', 'Barra', 'Cocina', 'Otros'];
  readonly semanaSeleccionada = signal(semanaIsoString(new Date()));

  readonly integrantes = signal<Integrante[]>([]);
  readonly horariosCatalogo = signal<NombreCatalogo[]>([]);

  readonly asignaciones = signal<Map<string, SubFilaCelda[]>>(new Map());

  private contadorItemId = 0;
  private contadorFilaId = 0;
  private chipArrastrado: ChipArrastrable | null = null;

  readonly dias = computed<DiaSemana[]>(() => {
    const lunes = lunesDeSemanaIso(this.semanaSeleccionada());
    return NOMBRES_DIAS.map((nombre, i) => {
      const fecha = new Date(lunes);
      fecha.setUTCDate(lunes.getUTCDate() + i);
      return {
        nombre,
        fechaCorta: fecha.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          timeZone: 'UTC',
        }),
      };
    });
  });

  ngOnInit(): void {
    this.equipoService.listar().subscribe({
      next: (integrantes) => this.integrantes.set(integrantes),
      error: () => this.integrantes.set([]),
    });
    this.horariosCatalogoService.listar().subscribe({
      next: (horarios) => this.horariosCatalogo.set(horarios),
      error: () => this.horariosCatalogo.set([]),
    });
  }

  onSemanaChange(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    if (valor) {
      this.semanaSeleccionada.set(valor);
      this.asignaciones.set(new Map());
    }
  }

  aliasDe(integrante: Integrante): string {
    return integrante.alias?.trim() || integrante.nombre;
  }

  iniciarArrastre(tipo: 'alias' | 'horario', etiqueta: string): void {
    this.chipArrastrado = { tipo, etiqueta };
  }

  permitirSoltar(event: DragEvent): void {
    event.preventDefault();
  }

  soltarEnCelda(event: DragEvent, diaIndex: number, filaIndex: number): void {
    event.preventDefault();
    const chip = this.chipArrastrado;
    if (!chip) {
      return;
    }
    this.chipArrastrado = null;

    const clave = `${diaIndex}_${filaIndex}`;
    const mapa = new Map(this.asignaciones());
    const subfilas = (mapa.get(clave) ?? []).map((f) => ({ ...f }));
    const item: ItemAsignado = { id: ++this.contadorItemId, etiqueta: chip.etiqueta };

    if (chip.tipo === 'alias') {
      const libre = subfilas.find((f) => f.alias === null);
      if (libre) {
        libre.alias = item;
      } else {
        subfilas.push({ id: ++this.contadorFilaId, alias: item, horario: null });
      }
    } else {
      const libre = subfilas.find((f) => f.horario === null);
      if (libre) {
        libre.horario = item;
      } else {
        subfilas.push({ id: ++this.contadorFilaId, alias: null, horario: item });
      }
    }

    mapa.set(clave, subfilas);
    this.asignaciones.set(mapa);
  }

  quitarAlias(diaIndex: number, filaIndex: number, subFilaId: number): void {
    this.actualizarSubFila(diaIndex, filaIndex, subFilaId, (f) => ({ ...f, alias: null, horario: null }));
  }

  quitarHorario(diaIndex: number, filaIndex: number, subFilaId: number): void {
    this.actualizarSubFila(diaIndex, filaIndex, subFilaId, (f) => ({ ...f, horario: null }));
  }

  celda(diaIndex: number, filaIndex: number): SubFilaCelda[] {
    return this.asignaciones().get(`${diaIndex}_${filaIndex}`) ?? [];
  }

  private actualizarSubFila(
    diaIndex: number,
    filaIndex: number,
    subFilaId: number,
    cambiar: (f: SubFilaCelda) => SubFilaCelda,
  ): void {
    const clave = `${diaIndex}_${filaIndex}`;
    const mapa = new Map(this.asignaciones());
    const subfilas = (mapa.get(clave) ?? [])
      .map((f) => (f.id === subFilaId ? cambiar(f) : f))
      .filter((f) => f.alias !== null || f.horario !== null);
    mapa.set(clave, subfilas);
    this.asignaciones.set(mapa);
  }
}
