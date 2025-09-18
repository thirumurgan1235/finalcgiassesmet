using NUnit.Framework;
using Microsoft.EntityFrameworkCore;
using EmployeeApi.Data;
using EmployeeApi.Models;
using EmployeeApi.Services;

namespace EmployeeApi.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private EmployeeDbContext _context;
        private EmployeeService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<EmployeeDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new EmployeeDbContext(options);
            _service = new EmployeeService(_context);
        }

        [TearDown]
        public void TearDown()
        {
            _context.Dispose();
        }

        [Test]
        public async Task GetAllEmployeesAsync_ShouldReturnAllEmployees()
        {
            // Arrange
            var employees = new List<Employee>
            {
                new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 },
                new Employee { Id = 2, Name = "Jane Smith", Address = "456 Oak Ave", Salary = 60000 }
            };

            _context.Employees.AddRange(employees);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetAllEmployeesAsync();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count(), Is.EqualTo(2));
            Assert.That(result.Any(e => e.Name == "John Doe"), Is.True);
            Assert.That(result.Any(e => e.Name == "Jane Smith"), Is.True);
        }

        [Test]
        public async Task GetEmployeeByIdAsync_WithValidId_ShouldReturnEmployee()
        {
            // Arrange
            var employee = new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.GetEmployeeByIdAsync(1);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("John Doe"));
            Assert.That(result.Address, Is.EqualTo("123 Main St"));
            Assert.That(result.Salary, Is.EqualTo(50000));
        }

        [Test]
        public async Task GetEmployeeByIdAsync_WithInvalidId_ShouldReturnNull()
        {
            // Act
            var result = await _service.GetEmployeeByIdAsync(999);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CreateEmployeeAsync_ShouldAddEmployeeToDatabase()
        {
            // Arrange
            var employee = new Employee { Name = "John Doe", Address = "123 Main St", Salary = 50000 };

            // Act
            var result = await _service.CreateEmployeeAsync(employee);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.GreaterThan(0));
            Assert.That(result.Name, Is.EqualTo("John Doe"));

            var savedEmployee = await _context.Employees.FindAsync(result.Id);
            Assert.That(savedEmployee, Is.Not.Null);
            Assert.That(savedEmployee.Name, Is.EqualTo("John Doe"));
        }

        [Test]
        public async Task UpdateEmployeeAsync_WithValidId_ShouldUpdateEmployee()
        {
            // Arrange
            var employee = new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            var updatedEmployee = new Employee { Id = 1, Name = "John Updated", Address = "456 New St", Salary = 60000 };

            // Act
            var result = await _service.UpdateEmployeeAsync(1, updatedEmployee);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Name, Is.EqualTo("John Updated"));
            Assert.That(result.Address, Is.EqualTo("456 New St"));
            Assert.That(result.Salary, Is.EqualTo(60000));

            var savedEmployee = await _context.Employees.FindAsync(1);
            Assert.That(savedEmployee.Name, Is.EqualTo("John Updated"));
        }

        [Test]
        public async Task UpdateEmployeeAsync_WithInvalidId_ShouldReturnNull()
        {
            // Arrange
            var updatedEmployee = new Employee { Id = 999, Name = "John Updated", Address = "456 New St", Salary = 60000 };

            // Act
            var result = await _service.UpdateEmployeeAsync(999, updatedEmployee);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task DeleteEmployeeAsync_WithValidId_ShouldRemoveEmployee()
        {
            // Arrange
            var employee = new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Act
            var result = await _service.DeleteEmployeeAsync(1);

            // Assert
            Assert.That(result, Is.True);

            var deletedEmployee = await _context.Employees.FindAsync(1);
            Assert.That(deletedEmployee, Is.Null);
        }

        [Test]
        public async Task DeleteEmployeeAsync_WithInvalidId_ShouldReturnFalse()
        {
            // Act
            var result = await _service.DeleteEmployeeAsync(999);

            // Assert
            Assert.That(result, Is.False);
        }
    }
}

