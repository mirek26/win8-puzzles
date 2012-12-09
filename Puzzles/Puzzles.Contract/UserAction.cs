﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UserAction.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Represents a particular action of a user when solving a puzzle.
    /// </summary>
    public class UserAction
    {
        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of pausing.
        /// </summary>
        public const string Pause = "Pause";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of opening a puzzle.
        /// </summary>
        public const string Open = "Open";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of closing a puzzle (without finishing it).
        /// </summary>
        public const string Close = "Close";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of finishing a puzzle.
        /// </summary>
        public const string Finished = "Finished";

        /// <summary>
        /// Gets or sets the timestamp of the action.
        /// </summary>
        public DateTime Timestamp { get; set; }

        /// <summary>
        /// Gets or sets the description of the action. Every type of puzzle can use different strings.
        /// </summary>
        public string Description { get; set; }
    }
}
