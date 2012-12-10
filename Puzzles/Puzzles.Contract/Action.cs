// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Action.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System;

    /// <summary>
    /// Represents a particular action of a user when solving a puzzle.
    /// </summary>
    public class Action
    {
        public const string Pause = "Pause";
        public const string Pause = "Continue";
        public const string Open = "Open";
        public const string Close = "Close";
        public const string Solved = "Solved";
        public const string Move = "Move";


        public DateTime Timestamp { get; set; }

        public string Type { get; set; }

        public object Parameters { get; set; }
    }
}
