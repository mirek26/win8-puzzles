
namespace Puzzles.Contract
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
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

        /// <summary>
        /// Gets or sets the name of the author of the puzzle, i.e. "Mirek".
        /// </summary>
        [Required]
        public string Author { get; set; }

        /// <summary>
        /// Gets or sets the definition of the puzzle. The specific format of the definition depends on the type of the puzzle.
        /// </summary>
        [Required]
        public string Definition { get; set; }
    }
}
