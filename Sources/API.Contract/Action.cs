// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Action.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Contract
{
    using System;

    using Newtonsoft.Json;

    /// <summary>
    /// Represents a particular action of a user when solving a puzzle.
    /// </summary>
    public class Action
    {
        public const string Pause = "Pause";
        public const string Continue = "Continue";
        public const string Open = "Open";
        public const string Close = "Close";
        public const string Solved = "Solved";
        public const string Move = "Move";
        
        [JsonProperty(PropertyName = "timestamp")] 
        public DateTime Timestamp { get; set; }

        [JsonProperty(PropertyName = "type")] 
        public string Type { get; set; }

        [JsonProperty(PropertyName = "params")] 
        public object Parameters { get; set; }
    }
}
