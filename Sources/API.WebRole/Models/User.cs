// --------------------------------------------------------------------------------------------------------------------
// <copyright file="User.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Basic information about a user.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace API.Webrole.WebRole.Models
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Basic information about a user.
    /// </summary>
    public class User
    {
        public enum Education
        {
            Elementary,
            Secontary,
            Tertiary
        }

        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Info { get; set; }

        public int? YearOfBirth { get; set; }

        public Education? CompletedEducation { get; set; }
    }
}
