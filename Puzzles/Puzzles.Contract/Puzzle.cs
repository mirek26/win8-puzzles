// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Puzzle.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Puzzle.Contract defines the object that are sent over the API. Here is a class for a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    using System;

    /// <summary>
    /// A class representing an instance of a puzzle.
    /// </summary>
    public class Puzzle
    {
        public int Id { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public int AuthorId { get; set; }

        public object Definition { get; set; }

        public object State { get; set; }

        public bool Solved { get; set; }

        public TimeSpan SpendTime { get; set; }

        public TimeSpan ExpectedTime { get; set; }
    }
}
