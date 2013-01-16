// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Car.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.RushHour
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Newtonsoft.Json;
    using Puzzles.Common;

    public class Car
    {
        public Car(int[] minmax)
            : this(minmax[0], minmax[1], minmax[2], minmax[3])
        {
        }

        public Car(int minX, int minY, int maxX, int maxY)
        {
            this.Position = new Coordinates() { X = minX, Y = minY };

            if (minX == maxX)
            {
                this.Orientation = CarOrientation.Vertical;
                this.Length = maxY - minY + 1;
                return;
            }

            if (minY == maxY)
            {
                this.Orientation = CarOrientation.Horizontal;
                this.Length = maxX - minX + 1;
                return;
            }

            throw new ArgumentException("Exactly one dimension must be 1!");
        }

        [JsonProperty(PropertyName = "position")] 
        public Coordinates Position { get; set; }

        [JsonProperty(PropertyName = "orientation")] 
        public CarOrientation Orientation { get; set; }

        [JsonProperty(PropertyName = "length")] 
        public int Length { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as Car;
            if (other == null)
            {
                return false;
            }
            return other.Length == this.Length && other.Orientation == this.Orientation
               && other.Position.Equals(this.Position);
        }

        public override int GetHashCode()
        {
            return this.Position.GetHashCode() ^ this.Length.GetHashCode() ^ this.Orientation.GetHashCode();
        }
    }
}
