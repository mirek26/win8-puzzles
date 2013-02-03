// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Puzzle.cs" company="">
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
    /// Short information about a puzzle.
    /// </summary>
    public class Puzzle
    {
        [JsonProperty(PropertyName = "id")] 
        public int Id { get; set; }

        [JsonProperty(PropertyName = "type")] 
        public string Type { get; set; }

        [JsonProperty(PropertyName = "title")] 
        public string Title { get; set; }

        [JsonProperty(PropertyName = "solved")] 
        public bool Solved { get; set; }

        [JsonProperty(PropertyName = "spend")] 
        public TimeSpan? SpendTime { get; set; }

        [JsonProperty(PropertyName = "expected")] 
        public TimeSpan? ExpectedTime { get; set; }
    }
}
