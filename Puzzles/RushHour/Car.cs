// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Car.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Represents a particular action of a user when solving a puzzle.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace RushHour
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Puzzles.Common;

    public class Car
    {
        public Car(int[] minmax)
            : this(minmax[0], minmax[1], minmax[2], minmax[3])
        {
        }

        public Car(int minX, int minY, int maxX, int maxY)
        {
            this.Coordinates = new Coordinates() { X = minX, Y = minY };

            if (minX == maxX)
            {
                this.Orientation = OrientationEnum.Vertical;
                this.Length = maxY - minY + 1;
                return;
            }

            if (minY == maxY)
            {
                this.Orientation = OrientationEnum.Horizontal;
                this.Length = maxX - minX + 1;
                return;
            }

            throw new ArgumentException("One dimension must be 1!");
        }

        public enum OrientationEnum
        {
            Horizontal,
            Vertical
        }

        public Coordinates Coordinates { get; set; }

        public OrientationEnum Orientation { get; set; }

        public int Length { get; set; }

        public override bool Equals(object obj)
        {
            var other = obj as Car;
            if (other == null)
            {
                return false;
            }
            return other.Length == this.Length && other.Orientation == this.Orientation
               && other.Coordinates.Equals(this.Coordinates);
        }

        public override int GetHashCode()
        {
            return this.Coordinates.GetHashCode() ^ this.Length.GetHashCode() ^ this.Orientation.GetHashCode();
        }
    }
}
