import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllEmployees', () => {
    it('should return employees from API', () => {
      // Arrange
      const mockEmployees: Employee[] = [
        { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 },
        { id: 2, name: 'Jane Smith', address: '456 Oak Ave', salary: 60000 }
      ];

      // Act
      service.getAllEmployees().subscribe(employees => {
        expect(employees).toEqual(mockEmployees);
      });

      // Assert
      const req = httpMock.expectOne('https://localhost:7120/api/employee');
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployees);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee by ID from API', () => {
      // Arrange
      const mockEmployee: Employee = { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 };

      // Act
      service.getEmployeeById(1).subscribe(employee => {
        expect(employee).toEqual(mockEmployee);
      });

      // Assert
      const req = httpMock.expectOne('https://localhost:7120/api/employee/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockEmployee);
    });
  });

  describe('createEmployee', () => {
    it('should create employee via API', () => {
      // Arrange
      const newEmployee: Employee = { name: 'John Doe', address: '123 Main St', salary: 50000 };
      const createdEmployee: Employee = { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 };

      // Act
      service.createEmployee(newEmployee).subscribe(employee => {
        expect(employee).toEqual(createdEmployee);
      });

      // Assert
      const req = httpMock.expectOne('https://localhost:7120/api/employee');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEmployee);
      req.flush(createdEmployee);
    });
  });

  describe('updateEmployee', () => {
    it('should update employee via API', () => {
      // Arrange
      const updateEmployee: Employee = { id: 1, name: 'John Updated', address: '456 New St', salary: 60000 };

      // Act
      service.updateEmployee(1, updateEmployee).subscribe(response => {
        expect(response).toBeTruthy();
      });

      // Assert
      const req = httpMock.expectOne('https://localhost:7120/api/employee/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateEmployee);
      req.flush({});
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee via API', () => {
      // Act
      service.deleteEmployee(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      // Assert
      const req = httpMock.expectOne('https://localhost:7120/api/employee/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
