import { Component } from '@angular/core';
import { AdminNavbar } from './components/admin-navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [AdminNavbar, RouterOutlet],
  template: `
    <app-admin-navbar class="card" />
    <div class="flex-auto">
      <router-outlet />
    </div>
  `,
  styles: `
  :host {
    display: flex;
    gap: 24px;
    padding: 24px;
    flex: 1 1 auto;
    @media screen and (max-width: 820px) {
      flex-direction: column;
    }
  }`,
})
export class Admin {}
