import { Component, output } from '@angular/core';
import { Header } from './components/header/header';
import { Footer } from './components/footer';
import { RouterOutlet } from '@angular/router';
// import { seedData } from './shared/data/seed';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  template: `
    <app-header />
    <!--<app-cocktails class="flex-auto" />-->
    <div class="flex-auto flex flex-col">
      <router-outlet />
    </div>
    <app-footer />
  `,
  styles: `
  :host {
    min-height: 100vh;
    display: flex;
    flex-direction:column; 
  }`,
})
export class App {
  protected title = 'Cocktails';

  constructor() {
    // seedData();
  }
}
