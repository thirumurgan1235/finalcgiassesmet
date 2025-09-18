using EmployeeApi.Models;

namespace EmployeeApi.Services
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee?> GetEmployeeByIdAsync(int id);
        Task<Employee> CreateEmployeeAsync(Employee employee);
        Task<Employee?> UpdateEmployeeAsync(int id, Employee employee);
        Task<bool> DeleteEmployeeAsync(int id);
    }
}

