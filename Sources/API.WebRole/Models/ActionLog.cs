// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ActionLog.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Collected data about how a user tried to solve a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Webrole.WebRole.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class ActionLog
    {
        [Key]
        public int Id { get; set; }

        public virtual User User { get; set; }

        [Required]
        public virtual Puzzle Puzzle { get; set; }

        public DateTime Received { get; set; }

        public string Log { get; set; }
    }
}
