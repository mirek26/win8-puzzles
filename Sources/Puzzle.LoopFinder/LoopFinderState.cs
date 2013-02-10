// --------------------------------------------------------------------------------------------------------------------
// <copyright file="LoopFinderState.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Puzzle.LoopFinder
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public class LoopFinderState
    {
        [JsonProperty("segm")]
        string Segments { get; set; }
    }
}
