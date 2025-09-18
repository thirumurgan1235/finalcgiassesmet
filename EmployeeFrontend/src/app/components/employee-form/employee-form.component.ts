import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h3>
      </div>
      <div class="card-body">
        <div *ngIf="loading">Loading...</div>
        <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
        <div *ngIf="success" class="alert alert-success">{{ success }}</div>
        
        <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
          <div class="form-group mb-3">
            <label for="name">Name *</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-control"
              [class.is-invalid]="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched"
              placeholder="Enter employee name"
            />
            <div *ngIf="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched" class="invalid-feedback">
              <div *ngIf="employeeForm.get('name')?.errors?.['required']">Name is required</div>
              <div *ngIf="employeeForm.get('name')?.errors?.['minlength']">Name must be at least 2 characters</div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="address">Address *</label>
            <textarea
              id="address"
              formControlName="address"
              class="form-control"
              [class.is-invalid]="employeeForm.get('address')?.invalid && employeeForm.get('address')?.touched"
              placeholder="Enter employee address"
              rows="3"
            ></textarea>
            <div *ngIf="employeeForm.get('address')?.invalid && employeeForm.get('address')?.touched" class="invalid-feedback">
              <div *ngIf="employeeForm.get('address')?.errors?.['required']">Address is required</div>
              <div *ngIf="employeeForm.get('address')?.errors?.['minlength']">Address must be at least 5 characters</div>
            </div>
          </div>
          
          <div class="form-group mb-3">
            <label for="salary">Salary *</label>
            <input
              type="number"
              id="salary"
              formControlName="salary"
              class="form-control"
              [class.is-invalid]="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched"
              placeholder="Enter employee salary"
              min="0"
              step="0.01"
            />
            <div *ngIf="employeeForm.get('salary')?.invalid && employeeForm.get('salary')?.touched" class="invalid-feedback">
              <div *ngIf="employeeForm.get('salary')?.errors?.['required']">Salary is required</div>
              <div *ngIf="employeeForm.get('salary')?.errors?.['min']">Salary must be greater than 0</div>
            </div>
          </div>
          
          <div class="form-group">
            <button
              type="submit"
              class="btn btn-success"
              [disabled]="employeeForm.invalid || loading"
            >
              {{ isEditMode ? 'Update Employee' : 'Add Employee' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              (click)="goBack()"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      salary: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (this.employeeId) {
      this.loading = true;
      this.employeeService.getEmployeeById(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            name: employee.name,
            address: employee.address,
            salary: employee.salary
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load employee data. Please try again.';
          this.loading = false;
          console.error('Error loading employee:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const employeeData = this.employeeForm.value;

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, {
          id: this.employeeId,
          ...employeeData
        }).subscribe({
          next: () => {
            this.success = 'Employee updated successfully!';
            this.loading = false;
            setTimeout(() => {
              this.router.navigate(['/employees']);
            }, 1500);
          },
          error: (error) => {
            this.error = 'Failed to update employee. Please try again.';
            this.loading = false;
            console.error('Error updating employee:', error);
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.success = 'Employee added successfully!';
            this.loading = false;
            this.employeeForm.reset();
            setTimeout(() => {
              this.router.navigate(['/employees']);
            }, 1500);
          },
          error: (error) => {
            this.error = 'Failed to add employee. Please try again.';
            this.loading = false;
            console.error('Error creating employee:', error);
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}