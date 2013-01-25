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
    public class PuzzleDetails
    {
        [JsonProperty(PropertyName = "id")] 
        public int Id { get; set; }

        [JsonProperty(PropertyName = "type")] 
        public string Type { get; set; }

        [JsonProperty(PropertyName = "name")] 
        public string Name { get; set; }

        [JsonProperty(PropertyName = "author")] 
        public int AuthorId { get; set; }

        [JsonProperty(PropertyName = "definition")] 
        public object Definition { get; set; }

        [JsonProperty(PropertyName = "state")] 
        public object State { get; set; }

        [JsonProperty(PropertyName = "solved")] 
        public bool Solved { get; set; }

        [JsonProperty(PropertyName = "spendTime")] 
        public TimeSpan? SpendTime { get; set; }

        [JsonProperty(PropertyName = "expectedTime")] 
        public TimeSpan? ExpectedTime { get; set; }
    }
}
