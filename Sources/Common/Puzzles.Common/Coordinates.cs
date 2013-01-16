// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Coordinates.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Common
{
    using Newtonsoft.Json;

    public class Coordinates
    {
        [JsonProperty(PropertyName = "x")] 
        public int X { get; set; }

        [JsonProperty(PropertyName = "y")] 
        public int Y { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as Coordinates;
            if (other == null)
            {
                return false;
            }
            else
            {
                return other.X == this.X && other.Y == this.Y;
            }
        }

        public override int GetHashCode()
        {
            return this.X.GetHashCode() ^ this.Y.GetHashCode();
        }
    }
}
