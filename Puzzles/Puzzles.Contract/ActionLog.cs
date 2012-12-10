// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ActionLog.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Collected data about how a user tried to solve a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System.Collections.Generic;

    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class ActionLog
    {
        public int UserId { get; set; }

        public int PuzzleId { get; set; }

        public List<Action> Actions { get; set; } 
    }
}
