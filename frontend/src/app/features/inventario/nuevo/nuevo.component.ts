import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plantilla, PlantillasService } from '../plantillas/plantillas.service';
import { InventarioService, ItemParaInventario } from './inventario.service';

@Component({
  selector: 'app-inventario-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.scss',
})
export class NuevoComponent implements OnInit {
  private readonly plantillasService = inject(PlantillasService);
  private readonly inventarioService = inject(InventarioService);

  readonly plantillas = signal<Plantilla[]>([]);
  readonly plantillaControl = new FormControl<number | null>(null);

  readonly filas = signal<ItemParaInventario[]>([]);
  readonly cantidades = new FormArray<FormControl<number>>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly guardando = signal(false);
  readonly guardadoOk = signal<string | null>(null);

  ngOnInit(): void {
    this.plantillasService.listar().subscribe({
      next: (plantillas) => this.plantillas.set(plantillas),
      error: () => this.plantillas.set([]),
    });
  }

  onPlantillaChange(): void {
    this.guardadoOk.set(null);
    this.error.set(null);

    const plantillaId = this.plantillaControl.value;
    if (plantillaId == null) {
      this.filas.set([]);
      this.cantidades.clear();
      return;
    }

    this.cargar(plantillaId);
  }

  private cargar(plantillaId: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.inventarioService.preparar(plantillaId).subscribe({
      next: (items) => {
        this.filas.set(items);
        this.cantidades.clear();
        items.forEach((item) => {
          this.cantidades.push(
            new FormControl(item.cantidadActualHoy, {
              nonNullable: true,
              validators: [Validators.required, Validators.min(0)],
            }),
          );
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar los ítems de la planilla.');
        this.loading.set(false);
      },
    });
  }

  guardar(): void {
    const plantillaId = this.plantillaControl.value;
    if (plantillaId == null || this.filas().length === 0 || this.cantidades.invalid || this.guardando()) {
      this.cantidades.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);
    this.guardadoOk.set(null);

    const registros = this.filas().map((fila, i) => ({
      itemId: fila.itemId,
      cantidadActual: this.cantidades.at(i).value,
    }));

    this.inventarioService.guardar({ plantillaId, registros }).subscribe({
      next: (result) => {
        this.guardando.set(false);
        this.guardadoOk.set(`Inventario guardado: ${result.guardados} ítem(s).`);
        this.cargar(plantillaId);
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el inventario.');
      },
    });
  }
}
