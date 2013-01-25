// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RushHourDefinition.cs" company="">
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

    public class RushHourDefinition
    {
        public const int MaximalSize = 10;

        public RushHourDefinition()
        {
        }

        public RushHourDefinition(string[] tutorDefinition)
        {
            if (tutorDefinition == null || tutorDefinition.Length < 1 || tutorDefinition.Length > MaximalSize)
            {
                throw new ArgumentException("Invalid input format. Argument is null or the number of lines is invalid.");
            }

            this.Size = new Coordinates() { Y = tutorDefinition.Length - 2, X = tutorDefinition[0].Length - 2 };

            Func<int, int, int> min = (i, j) => i > j ? j : i;
            Func<int, int, int> max = (i, j) => i > j ? i : j;
            Func<int, int, int[], int[]> update = (i, j, act) => new int[] { min(i, act[0]), min(j, act[1]), max(i, act[2]), max(j, act[3]) };

            var cars = new int[256][];
            for (var i = 0; i < this.Size.Y + 2; i++)
            {
                for (var j = 0; j < this.Size.X + 2; j++)
                {
                    var c = tutorDefinition[i][j];
                    switch (c)
                    {
                        case 'E':
                            this.Exit = (j==0 || i==0) ? ExitPosition.LeftOrUp: ExitPosition.RightOrDown;
                            break;
                        case '-': 
                        case '#':
                            break;
                        default: 
                            cars[c] = update(j - 1, i - 1, cars[c] ?? new int[] { j - 1, i - 1, j - 1, i - 1 });
                            break;
                    }
                }
            }

            // set RedCar and Cars
            var redCar = new Car(cars['x']);
            cars['x'] = null;

            this.Cars = cars.Where(car => car != null).Select(data => new Car(data)).ToList();
            this.Cars.Insert(0, redCar);
        }

        [JsonProperty(PropertyName = "size")] 
        public Coordinates Size { get; set; }

        [JsonProperty(PropertyName = "cars")] 
        public List<Car> Cars { get; set; }

        [JsonProperty(PropertyName = "exit")] 
        public ExitPosition Exit { get; set; }
    }
}
