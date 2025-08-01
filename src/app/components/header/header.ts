import { Component } from '@angular/core';
import { HeaderMenu } from './components/header-menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [HeaderMenu, RouterLink, RouterLinkActive],
  template: `
    <h3 class="flex-auto text-bold text-lg">Cocktails</h3>
    <ul class="xs-hide flex flex-row gap-16">
      <li>
        <a routerLink="/admin" routerLinkActive="active-link">Admin</a>
      </li>
      <li>
        <a routerLink="/cocktails" routerLinkActive="active-link">Cocktails</a>
      </li>
      <li>
        <a routerLink="/cart" routerLinkActive="active-link">Panier</a>
      </li>
    </ul>
    <app-header-menu class="hide xs-show" />
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      background-color: var(--primary);
      color: white;
      height: 56px;
      padding: 0 16px;
    }
    ul {
      position: relative;
    }
  `,
})
export class Header {}
