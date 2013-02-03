// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RushHourDefinition.cs" company="">
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

    public class RushHourDefinition
    {
        public const int MaximalSize = 10;

        public static RushHourDefinition FromTutor(IList<string> definition)
        {
            var result = new RushHourDefinition();

            if (definition == null || definition.Count < 1 || definition.Count > MaximalSize)
            {
                throw new ArgumentException("Invalid input format. Argument is null or the number of lines is invalid.");
            }

            result.Size = new[] { definition.Count - 2, definition[0].Length - 2 };

            Func<int, int, int> min = (i, j) => i > j ? j : i;
            Func<int, int, int> max = (i, j) => i > j ? i : j;
            Func<int, int, int[], int[]> update = (i, j, act) => new int[] { min(i, act[0]), min(j, act[1]), max(i, act[2]), max(j, act[3]) };

            var cars = new int[256][];
            for (var i = 0; i < result.Size[0] + 2; i++)
            {
                for (var j = 0; j < result.Size[1] + 2; j++)
                {
                    var c = definition[i][j];
                    switch (c)
                    {
                        case 'E':
                            result.Exit = (i == 0) ? ExitPosition.Up :
                                (i == result.Size[0] + 1) ? ExitPosition.Down :
                                (j == 0) ? ExitPosition.Left : ExitPosition.Right;
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

            result.Cars = cars.Where(car => car != null).Select(data => new Car(data)).ToList();
            result.Cars.Insert(0, redCar);
            return result;
        }

        [JsonProperty(PropertyName = "size")]
        public int[] Size { get; set; }

        [JsonProperty(PropertyName = "cars")] 
        public List<Car> Cars { get; set; }

        [JsonProperty(PropertyName = "exit")] 
        public ExitPosition Exit { get; set; }
    }
}
