import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Plantilla, PlantillasService } from '../plantillas/plantillas.service';
import { HistoricoInventario, HistoricoService, InventarioDetalleItem } from './historico.service';

function hoyISO(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-inventario-historico',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss',
})
export class HistoricoComponent implements OnInit {
  private readonly plantillasService = inject(PlantillasService);
  private readonly historicoService = inject(HistoricoService);

  readonly plantillas = signal<Plantilla[]>([]);
  readonly plantillaControl = new FormControl<number | null>(null);
  readonly fechaControl = new FormControl<string | null>(hoyISO());

  readonly resultados = signal<HistoricoInventario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searched = signal(false);

  readonly detalleAbierto = signal<HistoricoInventario | null>(null);
  readonly detalleItems = signal<InventarioDetalleItem[]>([]);
  readonly detalleLoading = signal(false);
  readonly detalleError = signal<string | null>(null);

  ngOnInit(): void {
    this.plantillasService.listar().subscribe({
      next: (plantillas) => this.plantillas.set(plantillas),
      error: () => this.plantillas.set([]),
    });
    this.buscar();
  }

  buscar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);

    this.historicoService.buscar(this.plantillaControl.value, this.fechaControl.value).subscribe({
      next: (resultados) => {
        this.resultados.set(resultados);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el histórico de inventarios.');
        this.loading.set(false);
      },
    });
  }

  limpiarFiltros(): void {
    this.plantillaControl.setValue(null);
    this.fechaControl.setValue(null);
    this.buscar();
  }

  abrirDetalle(registro: HistoricoInventario): void {
    this.detalleAbierto.set(registro);
    this.detalleItems.set([]);
    this.detalleError.set(null);
    this.detalleLoading.set(true);

    this.historicoService.obtenerDetalle(registro).subscribe({
      next: (items) => {
        this.detalleItems.set(items);
        this.detalleLoading.set(false);
      },
      error: () => {
        this.detalleError.set('No se pudo cargar el detalle del inventario.');
        this.detalleLoading.set(false);
      },
    });
  }

  cerrarDetalle(): void {
    this.detalleAbierto.set(null);
  }
}
