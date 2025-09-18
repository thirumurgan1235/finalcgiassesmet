using System.ComponentModel.DataAnnotations;

namespace EmployeeApi.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Salary must be a positive number")]
        public decimal Salary { get; set; }
    }
}

