// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RushHourState.cs" company="">
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

    public class RushHourState
    {
        public Car RedCar { get; set; }

        public List<Car> Cars { get; set; }
    }
}
