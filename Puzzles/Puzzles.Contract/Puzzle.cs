﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Puzzle.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   A class representing an instance of a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// A class representing an instance of a puzzle.
    /// </summary>
    public class Puzzle
    {
        /// <summary>
        /// Gets or sets the unique Id of the puzzle.
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the type of the puzzle, e.g. "RushHour".
        /// </summary>
        [Required]
        public string Type { get; set; }

        /// <summary>
        /// Gets or sets the name of the puzzle, e.g. "Totally trivial puzzle".
        /// </summary>
        [Required]
        public string Name { get; set; }

        [ForeignKey()]
        
        [Required]
        public virtual User Author { get; set; }

        /// <summary>
        /// Gets or sets the definition of the puzzle. The specific format of the definition depends on the type of the puzzle.
        /// </summary>
        [Required]
        public string Definition { get; set; }
    }
}
