import { AdminCocktailsForm } from './admin-cocktails-form';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CocktailsService } from 'app/shared/services/cocktails.service';
import { By } from '@angular/platform-browser';

describe('AdminCocktailsFormComponent', () => {
  let component: AdminCocktailsForm;
  let fixture: ComponentFixture<AdminCocktailsForm>;
  let cocktailsServiceSpy: jasmine.SpyObj<CocktailsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockCocktail = {
      _id: '123',
      name: 'Mojito',
      imageUrl: 'http://example.com/mojito.jpg',
      description: 'Refreshing cocktail',
      ingredients: ['Mint', 'Lime', 'Rum'],
    };

    cocktailsServiceSpy = jasmine.createSpyObj('CocktailsService', [
      'cocktailsResource',
      'editCocktail',
      'createCocktail',
    ]);

    cocktailsServiceSpy.cocktailsResource = {
      value: () => [mockCocktail],
    } as any;

    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdminCocktailsForm],
      providers: [
        provideRouter([], withComponentInputBinding()),
        { provide: CocktailsService, useValue: cocktailsServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ cocktailId: '123' }),
            snapshot: { params: { cocktailId: '123' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCocktailsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('devrait créer une instance du composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait initialiser le formulaire avec un cocktail existant', () => {
    expect(component.cocktailForm.value).toEqual({
      name: 'Mojito',
      imageUrl: 'http://example.com/mojito.jpg',
      description: 'Refreshing cocktail',
      ingredients: ['Mint', 'Lime', 'Rum'],
    });
    expect(component.ingredientsControl.length).toBe(3);
  });

  it('devrait ajouter un ingrédient à la liste', () => {
    component.addIngredient();
    expect(component.ingredientsControl.length).toBe(4);
  });

  it('devrait supprimer un ingrédient de la liste', () => {
    component.deleteIngredient(0);
    expect(component.ingredientsControl.length).toBe(2);
  });

  it('devrait désactiver le bouton de sauvegarde si le formulaire est invalide', () => {
    component.cocktailForm.get('name')?.setValue(''); // Invalider le formulaire
    fixture.detectChanges();

    const saveButton = fixture.debugElement
      .queryAll(By.css('button'))
      .find(
        (button) => button.nativeElement.textContent.trim() === 'Sauvegarder'
      );

    expect(saveButton).toBeTruthy();
    expect(saveButton!.nativeElement.disabled).toBeTrue();
  });

  it('devrait appeler "editCocktail" lors de la soumission avec un cocktail existant', async () => {
    cocktailsServiceSpy.editCocktail.and.returnValue(Promise.resolve());

    await component.submit();
    expect(cocktailsServiceSpy.editCocktail).toHaveBeenCalledWith({
      name: 'Mojito',
      imageUrl: 'http://example.com/mojito.jpg',
      description: 'Refreshing cocktail',
      ingredients: ['Mint', 'Lime', 'Rum'],
      _id: '123',
    });
  });

  it('devrait appeler "createCocktail" lors de la soumission d’un nouveau cocktail', async () => {
    component.cocktailID = null as any; // Simuler un nouveau cocktail
    cocktailsServiceSpy.createCocktail.and.returnValue(Promise.resolve());

    await component.submit();
    expect(cocktailsServiceSpy.createCocktail).toHaveBeenCalledWith({
      name: 'Mojito',
      imageUrl: 'http://example.com/mojito.jpg',
      description: 'Refreshing cocktail',
      ingredients: ['Mint', 'Lime', 'Rum'],
    });
  });

  it('devrait naviguer vers la liste des cocktails après une soumission réussie', async () => {
    cocktailsServiceSpy.editCocktail.and.returnValue(Promise.resolve());

    await component.submit();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      '/admin/cocktails/list'
    );
  });

  it('devrait afficher un message d’erreur si le nom du cocktail est vide', () => {
    component.nameControl.setValue(''); // Rendre le champ "name" invalide
    component.nameControl.markAsTouched();
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(
      By.css('.error')
    )?.nativeElement;
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain(
      'Le nom du cocktail est obligatoire'
    );
  });
});
