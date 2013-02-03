// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RushHourUnitTests.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Unit tests. 
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Puzzle.RushHour
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    
    [TestClass]
    public class RushHourUnitTests
    {
        #region RushHourDefinition constructor from Tutor data

        [TestMethod]
        public void RushHour_CreatePuzzleFromTutorData_ExitOnRight()
        {
            var tutorData = new string[]
            {
                "--------",
                "-aab#cd-",
                "-##b#cd-",
                "-##bxxdE",
                "-###eff-",
                "-ghhe##-",
                "-g##eii-",
                "--------",
            };

            var puzzle = RushHourDefinition.FromTutor(tutorData);
            Assert.AreEqual(6, puzzle.Size[1]);
            Assert.AreEqual(6, puzzle.Size[0]);
            Assert.AreEqual(10, puzzle.Cars.Count);
            Assert.AreEqual(3, puzzle.Cars[0].Position);
            Assert.AreEqual(2, puzzle.Cars[0].Street);
            Assert.AreEqual(2, puzzle.Cars[0].Length);
            Assert.AreEqual(CarOrientation.Horizontal, puzzle.Cars[0].Orientation);
            Assert.AreEqual(ExitPosition.Right, puzzle.Exit);
        }

        [TestMethod]
        public void RushHour_CreatePuzzleFromTutorData_ExitOnBottom()
        {
            var tutorData = new string[]
            {
                "--------",
                "-cc##x#-",
                "-####x#-",
                "-#baaa#-",
                "-#b####-",
                "-#b####-",
                "-ddd###-",
                "-----E--",
            };

            var puzzle = RushHourDefinition.FromTutor(tutorData);
            Assert.AreEqual(6, puzzle.Size[1]);
            Assert.AreEqual(6, puzzle.Size[0]);
            Assert.AreEqual(5, puzzle.Cars.Count);
            Assert.AreEqual(4, puzzle.Cars[0].Street);
            Assert.AreEqual(0, puzzle.Cars[0].Position);
            Assert.AreEqual(2, puzzle.Cars[0].Length);
            Assert.AreEqual(CarOrientation.Vertical, puzzle.Cars[0].Orientation);
            Assert.AreEqual(ExitPosition.Down, puzzle.Exit);
        }

        [TestMethod]
        public void RushHour_CreatePuzzleFromTutorData_ExitOnTop()
        {
            var tutorData = new string[]
            {
                "-----E--",
                "-ddd###-",
                "-#b####-",
                "-#b####-",
                "-#baaa#-",
                "-####x#-",
                "-cc##x#-",
                "--------",
            };

            var puzzle = RushHourDefinition.FromTutor(tutorData);
            Assert.AreEqual(6, puzzle.Size[1]);
            Assert.AreEqual(6, puzzle.Size[0]);
            Assert.AreEqual(5, puzzle.Cars.Count);
            Assert.AreEqual(4, puzzle.Cars[0].Position);
            Assert.AreEqual(4, puzzle.Cars[0].Street);
            Assert.AreEqual(2, puzzle.Cars[0].Length);
            Assert.AreEqual(CarOrientation.Vertical, puzzle.Cars[0].Orientation);
            Assert.AreEqual(ExitPosition.Up, puzzle.Exit);
        }

        [TestMethod]
        public void RushHour_CreatePuzzleFromTutorData_ExitOnLeft()
        {
            var tutorData = new string[]
            {
                "--------",
                "-dc#baa-",
                "-dc#b##-",
                "Edxxb##-",
                "-ffe###-",
                "-##ehhg-",
                "-iie##g-",
                "--------",
            };

            var puzzle = RushHourDefinition.FromTutor(tutorData);
            Assert.AreEqual(6, puzzle.Size[1]);
            Assert.AreEqual(6, puzzle.Size[0]);
            Assert.AreEqual(10, puzzle.Cars.Count);
            Assert.AreEqual(1, puzzle.Cars[0].Position);
            Assert.AreEqual(2, puzzle.Cars[0].Street);
            Assert.AreEqual(2, puzzle.Cars[0].Length);
            Assert.AreEqual(CarOrientation.Horizontal, puzzle.Cars[0].Orientation);
            Assert.AreEqual(ExitPosition.Left, puzzle.Exit);
        }

        #endregion

        #region Car constructor
        [TestMethod]
        public void RushHour_CreateCarHorizontal()
        {
            var c = new Car(3, 5, 3, 8);
            Assert.IsTrue(c.Equals(new Car(new int[] { 3, 5, 3, 8 })));
            Assert.AreEqual(c.Street, 3);
            Assert.AreEqual(c.Position, 5);
            Assert.AreEqual(c.Length, 4);
            Assert.AreEqual(c.Orientation, CarOrientation.Vertical);
        }

        [TestMethod]
        public void RushHour_CreateCarVertical()
        {
            var c = new Car(3, 2, 4, 2);
            Assert.IsTrue(c.Equals(new Car(new int[] { 3, 2, 4, 2 })));
            Assert.AreEqual(c.Position, 3);
            Assert.AreEqual(c.Street, 2);
            Assert.AreEqual(c.Length, 2);
            Assert.AreEqual(c.Orientation, CarOrientation.Horizontal);
        }
        #endregion
    }
}
