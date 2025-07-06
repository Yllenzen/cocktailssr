import { Component, computed, inject } from '@angular/core';
import { CartIngredientsList } from './components/cart-ingredients-list';
import { CartService } from '../../shared/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CartIngredientsList],
  template: `
    <app-cart-ingredients-list class="card" [ingredients]="ingredients()" />
  `,
  styles: `
  :host { flex: 1 1 auto; padding: 24px }`,
})
export class Cart {
  private CartService = inject(CartService);
  ingredients = computed(() => this.CartService.ingredients());
}
