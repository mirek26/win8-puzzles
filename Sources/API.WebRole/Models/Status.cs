// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Status.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Collected data about how a user tried to solve a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace API.Webrole.WebRole.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class Status
    {
        [Key]
        public int Id { get; set; }

        public virtual User User { get; set; }

        public virtual Puzzle Puzzle { get; set; }

        /// <summary>
        /// JSON object in string.
        /// </summary>
        public string State { get; set; }

        public DateTime LastChange { get; set; }

        public bool Solved { get; set; }
    }
}
