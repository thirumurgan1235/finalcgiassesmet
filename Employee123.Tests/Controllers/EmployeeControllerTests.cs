using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using Moq;
using EmployeeApi.Controllers;
using EmployeeApi.Models;
using EmployeeApi.Services;

namespace EmployeeApi.Tests.Controllers
{
    [TestFixture]
    public class EmployeeControllerTests
    {
        private Mock<IEmployeeService> _mockService;
        private EmployeeController _controller;

        [SetUp]
        public void Setup()
        {
            _mockService = new Mock<IEmployeeService>();
            _controller = new EmployeeController(_mockService.Object);
        }

        [Test]
        public async Task GetEmployees_ShouldReturnOkResultWithEmployees()
        {
            // Arrange
            var employees = new List<Employee>
            {
                new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 },
                new Employee { Id = 2, Name = "Jane Smith", Address = "456 Oak Ave", Salary = 60000 }
            };

            _mockService.Setup(s => s.GetAllEmployeesAsync()).ReturnsAsync(employees);

            // Act
            var result = await _controller.GetEmployees();

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(employees));
        }

        [Test]
        public async Task GetEmployee_WithValidId_ShouldReturnOkResultWithEmployee()
        {
            // Arrange
            var employee = new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 };
            _mockService.Setup(s => s.GetEmployeeByIdAsync(1)).ReturnsAsync(employee);

            // Act
            var result = await _controller.GetEmployee(1);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
            var okResult = result.Result as OkObjectResult;
            Assert.That(okResult.Value, Is.EqualTo(employee));
        }

        [Test]
        public async Task GetEmployee_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.GetEmployeeByIdAsync(999)).ReturnsAsync((Employee?)null);

            // Act
            var result = await _controller.GetEmployee(999);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<NotFoundResult>());
        }

        [Test]
        public async Task CreateEmployee_WithValidEmployee_ShouldReturnCreatedAtAction()
        {
            // Arrange
            var employee = new Employee { Name = "John Doe", Address = "123 Main St", Salary = 50000 };
            var createdEmployee = new Employee { Id = 1, Name = "John Doe", Address = "123 Main St", Salary = 50000 };

            _mockService.Setup(s => s.CreateEmployeeAsync(employee)).ReturnsAsync(createdEmployee);

            // Act
            var result = await _controller.CreateEmployee(employee);

            // Assert
            Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
            var createdResult = result.Result as CreatedAtActionResult;
            Assert.That(createdResult.Value, Is.EqualTo(createdEmployee));
            Assert.That(createdResult.ActionName, Is.EqualTo(nameof(_controller.GetEmployee)));
        }

        [Test]
        public async Task UpdateEmployee_WithValidId_ShouldReturnNoContent()
        {
            // Arrange
            var employee = new Employee { Id = 1, Name = "John Updated", Address = "456 New St", Salary = 60000 };
            var updatedEmployee = new Employee { Id = 1, Name = "John Updated", Address = "456 New St", Salary = 60000 };

            _mockService.Setup(s => s.UpdateEmployeeAsync(1, employee)).ReturnsAsync(updatedEmployee);

            // Act
            var result = await _controller.UpdateEmployee(1, employee);

            // Assert
            Assert.That(result, Is.InstanceOf<NoContentResult>());
        }

        [Test]
        public async Task UpdateEmployee_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            var employee = new Employee { Id = 999, Name = "John Updated", Address = "456 New St", Salary = 60000 };
            _mockService.Setup(s => s.UpdateEmployeeAsync(999, employee)).ReturnsAsync((Employee?)null);

            // Act
            var result = await _controller.UpdateEmployee(999, employee);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundResult>());
        }

        [Test]
        public async Task DeleteEmployee_WithValidId_ShouldReturnNoContent()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteEmployeeAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteEmployee(1);

            // Assert
            Assert.That(result, Is.InstanceOf<NoContentResult>());
        }

        [Test]
        public async Task DeleteEmployee_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockService.Setup(s => s.DeleteEmployeeAsync(999)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteEmployee(999);

            // Assert
            Assert.That(result, Is.InstanceOf<NotFoundResult>());
        }
    }
}

