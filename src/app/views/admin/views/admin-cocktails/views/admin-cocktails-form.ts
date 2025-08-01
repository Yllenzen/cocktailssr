import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cocktail, CocktailForm } from '../../../../../shared/interfaces';
import { CocktailsService } from '../../../../../shared/services/cocktails.service';

@Component({
  selector: 'app-admin-cocktails-form',
  imports: [ReactiveFormsModule],
  template: `
    @if (this.cocktailID) {
    <h3 class="mb-20">Modification d'un cocktail</h3>
    } @else {
    <h3 class="mb-20">Création d'un cocktail</h3>
    }
    <form [formGroup]="cocktailForm" (submit)="submit()">
      <div class="flex flex-col gap-12 mb-10">
        <label for="name">Nom du cocktail</label>
        <input formControlName="name" type="text" id="name" />
        @if (nameControl.errors?.['required'] && (nameControl.touched ||
        cocktailForm.dirty)) {
        <p class="error">Le nom du cocktail est obligatoire</p>
        }
      </div>
      <div class="flex flex-col gap-12 mb-10">
        <label for="imageUrl">Url de l'image</label>
        <input formControlName="imageUrl" type="text" id="imageUrl" />
      </div>
      <div class="flex flex-col gap-12 mb-10">
        <label for="description">Description</label>
        <textarea
          formControlName="description"
          id="description"
          cols="3"
        ></textarea>
      </div>
      <div class="mb-20">
        <div class="flex align-items-center gap-12 mb-10">
          <label class="flex-auto">Ingrédients</label>
          <button
            type="button"
            (click)="addIngredient()"
            class="btn btn-primary"
          >
            Ajouter
          </button>
        </div>
        <ul formArrayName="ingredients">
          @for (ingredient of ingredientsControl.controls; track $index) {
          <li class="flex align-items-center gap-12 mb-10">
            <input class="flex-auto" [formControlName]="$index" type="text" />
            <button (click)="deleteIngredient($index)" class="btn btn-danger">
              Supprimer
            </button>
          </li>
          }
        </ul>
      </div>
      <div>
        <button
          [disabled]="cocktailForm.invalid || this.isLoading()"
          class="btn btn-primary"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  `,
  host: { class: 'card' },
  styles: ` .card { padding: 8px;}`,
})
export class AdminCocktailsForm {
  private fb = inject(FormBuilder);
  private cocktailService = inject(CocktailsService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  cocktails = computed(() => this.cocktailService.cocktailsResource.value());
  cocktailID = toSignal(this.activatedRoute.params)()!['cocktailId'];
  isLoading = signal(false);

  cocktailForm = this.fb.group({
    name: ['', Validators.required],
    imageUrl: [''],
    description: [''],
    ingredients: this.fb.array([]),
  });

  initCocktailFormEffect = effect(() => {
    if (this.cocktailID) {
      const cocktails = this.cocktails();
      if (cocktails) {
        const { name, imageUrl, description, ingredients } = cocktails.find(
          ({ _id }) => this.cocktailID === _id
        )!;
        this.cocktailForm.patchValue({
          name,
          imageUrl,
          description,
        });
        ingredients.forEach((i) =>
          this.ingredientsControl.push(this.fb.control(i))
        );
        this.initCocktailFormEffect.destroy();
      }
    } else {
      this.initCocktailFormEffect.destroy();
    }
  });

  get ingredientsControl() {
    return this.cocktailForm.get('ingredients') as FormArray;
  }

  get nameControl() {
    return this.cocktailForm.get('name') as FormControl;
  }

  addIngredient() {
    this.ingredientsControl.push(this.fb.control(''));
  }

  deleteIngredient(index: number) {
    this.ingredientsControl.removeAt(index);
  }

  async submit() {
    this.isLoading.set(true);
    try {
      if (this.cocktailID) {
        await this.cocktailService.editCocktail({
          ...this.cocktailForm.getRawValue(),
          _id: this.cocktailID,
        } as Cocktail);
      } else {
        await this.cocktailService.createCocktail(
          this.cocktailForm.getRawValue() as CocktailForm
        );
      }
      this.router.navigateByUrl('/admin/cocktails/list');
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
