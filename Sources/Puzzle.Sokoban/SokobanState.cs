// --------------------------------------------------------------------------------------------------------------------
// <copyright file="SokobanState.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Puzzle.Sokoban
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public class SokobanState
    {
        [JsonProperty("man")]
        public int[] Man { get; set; }

        [JsonProperty("boxes")]
        public List<int[]> Boxes { get; set; }
    }
}
