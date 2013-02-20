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
    using System.Collections.Generic;
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

        [JsonProperty("median")]
        public TimeSpan? MedianTime { get; set; }

        [JsonProperty("mean")]
        public TimeSpan? MeanTime { get; set; }

        [JsonProperty("num")]
        public int NumberOfUsers { get; set; }

        [JsonProperty("hist")]
        public Histogram Histogram { get; set; }
    }
}
