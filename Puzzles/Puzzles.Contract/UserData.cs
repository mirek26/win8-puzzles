﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UserData.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Collected data about how a user tried to solve a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class UserData
    {
        /// <summary>
        /// Gets or sets the Id of the user the data comes from.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the Id of the puzzle.
        /// </summary>
        public int PuzzleId { get; set; }

        /// <summary>
        /// Gets or sets the date and time receipt of the data.
        /// </summary>
        public DateTime Received { get; set; }

        /// <summary>
        /// Gets or sets the actual data - list of user actions.
        /// </summary>
        public List<UserAction> Actions { get; set; }
    }
}
