// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Car.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Puzzle.RushHour
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Newtonsoft.Json;

    public class Car
    {
        public Car(int[] minmax)
            : this(minmax[0], minmax[1], minmax[2], minmax[3])
        {
        }

        public Car(int minX, int minY, int maxX, int maxY)
        {
            if (minX == maxX)
            {
                this.Orientation = CarOrientation.Vertical;
                this.Length = maxY - minY + 1;
                this.Position = minY;
                this.Street = minX;
            }
            else if (minY == maxY)
            {
                this.Orientation = CarOrientation.Horizontal;
                this.Length = maxX - minX + 1;
                this.Position = minX;
                this.Street = minY;
            }
            else
            {
                throw new ArgumentException("Exactly one dimension must be 1!");
            }
        }

        [JsonProperty(PropertyName = "p")] 
        public int Position { get; set; }

        [JsonProperty(PropertyName = "s")]
        public int Street { get; set; }

        [JsonProperty(PropertyName = "o")] 
        public CarOrientation Orientation { get; set; }

        [JsonProperty(PropertyName = "l")] 
        public int Length { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as Car;
            if (other == null)
            {
                return false;
            }
            return other.Length == this.Length && other.Orientation == this.Orientation
               && other.Position == this.Position && other.Street == this.Street;
        }

        public override int GetHashCode()
        {
            return this.Position.GetHashCode() ^ this.Length.GetHashCode() ^ this.Orientation.GetHashCode();
        }
    }
}
