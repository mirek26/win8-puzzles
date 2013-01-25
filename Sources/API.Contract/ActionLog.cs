// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ActionLog.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Collected data about how a user tried to solve a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Contract
{
    using System.Collections.Generic;

    using Newtonsoft.Json;
    
    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class ActionLog
    {
        [JsonProperty(PropertyName = "user")] 
        public int UserId { get; set; }

        [JsonProperty(PropertyName = "puzzle")] 
        public int PuzzleId { get; set; }

        [JsonProperty(PropertyName = "actions")] 
        public List<Action> Actions { get; set; } 
    }
}
