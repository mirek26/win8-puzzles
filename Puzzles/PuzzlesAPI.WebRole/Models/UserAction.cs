// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UserAction.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Represents a particular action of a user when solving a puzzle.
    /// </summary>
    public class UserAction
    {
        public const string Pause = "Pause";
        public const string Open = "Open";
        public const string Close = "Close";
        public const string Finished = "Finished";

        [Key]
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public string Description { get; set; }
    }
}
