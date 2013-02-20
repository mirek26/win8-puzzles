// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzleType.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   A class representing a type of puzzle (e.g. Rush Hour)
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Contract
{
    using Newtonsoft.Json;

    /// <summary>
    /// A class representing a type of puzzle (e.g. Rush Hour)
    /// </summary>
    public class PuzzleType
    {
        [JsonProperty(PropertyName = "id")] 
        public string Id { get; set; }

        [JsonProperty(PropertyName = "title")] 
        public string Title { get; set; }

        [JsonProperty(PropertyName = "subtitle")] 
        public string Subtitle { get; set; }

        [JsonProperty(PropertyName = "rules")] 
        public string Rules { get; set; }

        [JsonProperty(PropertyName = "training")] 
        public int? Training { get; set; }
    }
}
