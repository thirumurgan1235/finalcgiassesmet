import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list-new',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3>Employee List</h3>
        <button class="btn btn-primary" (click)="addEmployee()">Add New Employee</button>
      </div>
      <div class="card-body">
        <div *ngIf="loading">Loading...</div>
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <div *ngIf="!loading && !error && employees.length === 0">
          <p>No employees found.</p>
          <button class="btn btn-primary" (click)="addEmployee()">Add the first employee</button>
        </div>
        <div *ngIf="!loading && !error && employees.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employees">
                <td>{{ employee.id }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.address }}</td>
                <td>{{ employee.salary }}</td>
                <td>
                  <button class="btn btn-warning btn-sm" (click)="editEmployee(employee.id)">Edit</button>
                  <button class="btn btn-danger btn-sm" (click)="deleteEmployee(employee.id, employee.name)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EmployeeListNewComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load employees. Please try again.';
        this.loading = false;
        console.error('Error loading employees:', error);
      }
    });
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          this.error = 'Failed to delete employee. Please try again.';
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}
