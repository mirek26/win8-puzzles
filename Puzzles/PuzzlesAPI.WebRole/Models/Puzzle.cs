// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Puzzle.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   A class representing an instance of a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;

    /// <summary>
    /// A class representing an instance of a puzzle.
    /// </summary>
    public class Puzzle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public string Name { get; set; }

        public string Info { get; set; }

        [Required]
        public virtual User Author { get; set; }

        public DateTime Created { get; set; }

        [Required]
        public string Definition { get; set; }
    }
}
