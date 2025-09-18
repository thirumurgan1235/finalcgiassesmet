import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="fas fa-users me-2"></i>
          Employee Management System
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/employees" routerLinkActive="active">
                <i class="fas fa-list me-1"></i>Employee List
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="container-fluid py-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Employee Management System';
}
