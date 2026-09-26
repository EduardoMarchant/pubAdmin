import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plantilla, PlantillasService } from '../plantillas.service';
import { ImportItemsResult, Item, ItemsService } from './items.service';

@Component({
  selector: 'app-inventario-items',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent implements OnInit {
  private readonly plantillasService = inject(PlantillasService);
  private readonly itemsService = inject(ItemsService);
  private readonly fb = inject(FormBuilder);

  readonly plantillas = signal<Plantilla[]>([]);

  readonly modalOpen = signal(false);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);

  readonly searchPlantillaId = this.fb.control<number | null>(null, [Validators.required]);
  readonly searched = signal(false);
  readonly items = signal<Item[]>([]);
  readonly itemsLoading = signal(false);
  readonly itemsError = signal<string | null>(null);

  readonly estados = ['Activo', 'Inactivo'];

  readonly importing = signal(false);
  readonly importResult = signal<ImportItemsResult | null>(null);
  readonly importError = signal<string | null>(null);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    estado: ['Activo', [Validators.required]],
    plantillaId: [null as number | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.plantillasService.listar().subscribe({
      next: (plantillas) => this.plantillas.set(plantillas),
      error: () => this.plantillas.set([]),
    });
  }

  abrirCrear(): void {
    this.formError.set(null);
    this.form.reset({
      nombre: '',
      categoria: '',
      estado: 'Activo',
      plantillaId: this.searchPlantillaId.value,
    });
    this.modalOpen.set(true);
  }

  cerrarModal(): void {
    this.modalOpen.set(false);
  }

  guardar(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.formError.set(null);

    const { nombre, categoria, estado, plantillaId } = this.form.getRawValue();

    this.itemsService
      .crear({
        nombre: nombre!,
        categoria: categoria!,
        estado: estado!,
        plantillaId: plantillaId!,
      })
      .subscribe({
        next: (item) => {
          this.submitting.set(false);
          this.modalOpen.set(false);
          if (this.searchPlantillaId.value === item.plantillaId) {
            this.buscar();
          }
        },
        error: () => {
          this.submitting.set(false);
          this.formError.set('No se pudo guardar el ítem. Intenta de nuevo.');
        },
      });
  }

  buscar(): void {
    if (this.searchPlantillaId.invalid || this.searchPlantillaId.value == null) {
      this.searchPlantillaId.markAsTouched();
      return;
    }

    this.itemsLoading.set(true);
    this.itemsError.set(null);
    this.searched.set(true);

    this.itemsService.listarPorPlantilla(this.searchPlantillaId.value).subscribe({
      next: (items) => {
        this.items.set(items);
        this.itemsLoading.set(false);
      },
      error: () => {
        this.itemsError.set('No se pudo cargar el listado de ítems.');
        this.itemsLoading.set(false);
      },
    });
  }

  onArchivoSeleccionado(event: Event, inputElement: HTMLInputElement): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.importing.set(true);
    this.importError.set(null);

    this.itemsService.cargarExcel(file).subscribe({
      next: (result) => {
        this.importing.set(false);
        this.importResult.set(result);
        inputElement.value = '';
        if (this.searched()) {
          this.buscar();
        }
      },
      error: () => {
        this.importing.set(false);
        this.importError.set('No se pudo procesar el archivo. Verifica que sea un Excel válido.');
        inputElement.value = '';
      },
    });
  }

  cerrarResultadoImportacion(): void {
    this.importResult.set(null);
  }
}
