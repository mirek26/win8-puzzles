// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzleDetails.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Puzzle.Contract defines the object that are sent over the API. Here is a class for a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Contract
{
    using System;
    using Newtonsoft.Json;

    /// <summary>
    /// Detailed information about a puzzle.
    /// </summary>
    public class PuzzleDetails: Puzzle
    {
        [JsonProperty(PropertyName = "author")] 
        public int AuthorId { get; set; }

        [JsonProperty(PropertyName = "def")] 
        public object Definition { get; set; }

        [JsonProperty(PropertyName = "istate")]
        public object InitialState { get; set; }

        [JsonProperty(PropertyName = "state")] 
        public object State { get; set; }
    }
}
