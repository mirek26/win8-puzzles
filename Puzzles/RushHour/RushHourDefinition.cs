// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RushHourDefinition.cs" company="">
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
            Coordinates exit = null;
            for (var i = 0; i < this.Size.Y + 2; i++)
            {
                for (var j = 0; j < this.Size.X + 2; j++)
                {
                    var c = tutorDefinition[i][j];
                    switch (c)
                    {
                        case 'E':
                            exit = new Coordinates() { X = j - 1, Y = i - 1 };
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
            this.RedCar = new Car(cars['x']);
            cars['x'] = null;

            this.Cars = cars.Where(car => car != null).Select(data => new Car(data)).ToList();

            // set RedCarGoal
            if (exit == null)
            {
                throw new ArgumentException("No exit found in the plan.");
            }

            this.RedCarGoal = this.RedCar.Orientation == Car.OrientationEnum.Horizontal ?
                new Coordinates() { X = exit.X == -1 ? 0 : exit.X - this.RedCar.Length, Y = exit.Y } :
                new Coordinates() { X = exit.X, Y = exit.Y == -1 ? 0 : exit.Y - this.RedCar.Length };
        }

        public Coordinates Size { get; set; }

        public Car RedCar { get; set; }

        public List<Car> Cars { get; set; }

        public Coordinates RedCarGoal { get; set; }

    }
}
