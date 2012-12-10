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
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class Coordinates
    {
        public int X { get; set; }

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
