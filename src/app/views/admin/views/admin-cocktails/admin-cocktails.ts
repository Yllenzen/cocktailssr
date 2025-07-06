import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-cocktails',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <ul class="flex gap-16 mb-20">
      <a routerLink="list" routerLinkActive="active-link">Liste</a>
      <a routerLink="new" routerLinkActive="active-link">Nouveau</a>
    </ul>
    <router-outlet />
  `,
  styles: ` :host {display: flex; flex-direction: column;}`,
})
export class AdminCocktails {}
