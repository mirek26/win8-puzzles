// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzleType.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   A class representing a type of puzzle (e.g. Rush Hour)
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace API.Webrole.WebRole.Models
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// A class representing a type of puzzle (e.g. Rush Hour)
    /// </summary>
    public class PuzzleType
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Subtitle { get; set; }

        public string Rules { get; set; }

        public string JsFile { get; set; }
    }
}
