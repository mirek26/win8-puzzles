

namespace Puzzles.API.Webrole.WebRole.Models
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Validation;
    using System.Diagnostics;
    using System.IO;
    using System.Text.RegularExpressions;

    using Newtonsoft.Json;
    using Puzzles.API.Contract;
    using Puzzles.Puzzle.LoopFinder;
    using Puzzles.Puzzle.RushHour;
    using Puzzles.Puzzle.Sokoban;

    public class SampleData : DropCreateDatabaseAlways<PuzzlesDb>
    {
        private static PuzzleType RushHourType = new PuzzleType
            {
                Id = "RushHour",
                Title = "Rush Hour",
                Subtitle = "Move the red car out of grid!",
                Rules = "<ul><li>Your goal is to get the red car out of grid.</li>" +
                    "<li>You can achieve that by moving other cars and trucks out of its way.</li>" +
                    "<li>Every car or truck can be moved only horizontally or vertically.</li>" +
                    "<li>Enjoy!</li>"
            };

        private static PuzzleType SokobanType = new PuzzleType
            {
                Id = "Sokoban",
                Title = "Sokoban",
                Subtitle = "Push the boxes to storage locations!",
                Rules = "<ul><li>Control the storage man by arrows or by touch.</li>" +
                    "<li>Your goal is to push all the boxes to the marked storage locations.</li>" +
                    "<li>Only one box can be pushed at a time.</li>" +
                    "<li>A box cannot be pulled.</li>" +
                    "<li>The storage man cannot walk through the walls or climb over the boxes.</li>" +
                    "<li>Enjoy!</li></ul>"
            };

        private static PuzzleType LoopFinderType = new PuzzleType
            {
                Id = "LoopFinder",
                Title = "Loop Finder",
                Subtitle = "Build an enclosure around your pasture!",
                Rules = "<ul><li>Your task is to make an enclosure using fences so that:</li>" +
                    "<ul><li>Solution contains only one closed continous loop made from fences.</li>" +
                    "<li>Fields with numbers on the meadow have the same number of fences around them.</li>" +
                    "<li>Fences never cross or branch out.</li></ul>" +
                    "<li>Click or touch to build a fence.</li>" +
                    "<li>Click or touch again to pull it down.</li>" +
                    "<li>Right-click or double-click to mark a place as free (just for your convenience). </li></ul>"
            };

        private static List<Puzzle> LoadPuzzles(PuzzleType type, string filename, Func<IList<string>, Tuple<string, string>> convertDefinition)
        {
            var result = new List<Puzzle>();

            var buffer = new List<string>();
            Puzzle puzzle = null;
            var idline = new Regex(@"id: (\d*);(.*)");

            foreach (var line in File.ReadAllLines(filename))
            {
                var match = idline.Match(line, 0);
                if (match.Success)
                {
                    if (puzzle != null)
                    {
                        var def = convertDefinition(buffer);
                        puzzle.Definition = def.Item1;
                        puzzle.InitialState = def.Item2;
                        result.Add(puzzle);
                    }

                    var tutorId = Convert.ToInt32(match.Groups[1].Value);
                    var title = string.IsNullOrEmpty(match.Groups[2].Value) ? type.Title + " " + match.Groups[1].Value : match.Groups[2].Value;

                    puzzle = new Puzzle()
                        {
                            Created = DateTime.Now,
                            Title = title,
                            Hidden = false,
                            TutorId = tutorId,
                            TypeId = type.Id,
                        };
                    buffer.Clear();
                }
                else
                {
                    if (line != string.Empty)
                    {
                        buffer.Add(line);
                    }
                }
            }

            if (puzzle != null)
            {
                var def = convertDefinition(buffer);
                puzzle.Definition = def.Item1;
                puzzle.InitialState = def.Item2;
                result.Add(puzzle);
            }

            return result;
        }

        private static Tuple<string, string> ConvertDefinition<T>(IList<string> tutorDef)
        {
            var def = typeof(T).GetMethod("FromTutor").Invoke(null, new[] { tutorDef.ToArray() });
            var state = def.GetType().GetProperty("InitialState").GetValue(def, null);
            return new Tuple<string, string>(JsonConvert.SerializeObject(def), JsonConvert.SerializeObject(state));
        }

        private static Puzzle LoadTraining<T>(PuzzleType type, string filename)
        {
            var p = ConvertDefinition<T>(File.ReadAllLines(filename));
            return new Puzzle
            {
                Created = DateTime.Now,
                Title = "Training",
                Hidden = true,
                Definition = p.Item1,
                InitialState = p.Item2,
                TypeId = type.Id,
            };
        }

        private static void LoadStats(IEnumerable<Puzzle> puzzles, string filename)
        {
            const int NumberOfIntervals = 14;

            var all = File.ReadAllLines(filename).Skip(1);
            foreach (var line in all)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;
                var fields = line.Split(';', ':');
                var tutorId = Convert.ToInt32(fields[1]);
                
                // select the puzzle (continue if not present - training for example)
                var puzzle = puzzles.SingleOrDefault(p => p.TutorId == tutorId);
                if (puzzle == null) continue;

                // get list of times
                var times = fields.Skip(3).Select(x => Convert.ToInt32(x)).ToList();
                times.Sort();

                puzzle.MeanTime = TimeSpan.FromSeconds(Math.Round(times.Average()));
                puzzle.MedianTime = TimeSpan.FromSeconds(times[times.Count / 2]);

                var length = Math.Min(
                    times[(int)Math.Floor((times.Count-1) * 0.95)] / NumberOfIntervals,
                    times[times.Count / 2] * 5 / (2 * NumberOfIntervals));
                var histogram = new int[NumberOfIntervals];
                foreach (var time in times)
                {
                    if (time / length < NumberOfIntervals)
                    {
                        histogram[time / length]++;
                    }
                }

                puzzle.Historgram = JsonConvert.SerializeObject(
                    new Histogram
                    {
                        Length = length, 
                        Values = histogram
                    });
            }
        }

        protected override void Seed(PuzzlesDb context)
        {
            base.Seed(context);

            var rushhour = context.PuzzleTypes.Add(RushHourType);
            var loopfinder = context.PuzzleTypes.Add(LoopFinderType);
            var sokoban = context.PuzzleTypes.Add(SokobanType);
            context.SaveChanges();

            rushhour.TrainingPuzzle = context.Puzzles.Add(LoadTraining<RushHourDefinition>(rushhour, @"C:\tutor-rushhour-training.txt"));
            loopfinder.TrainingPuzzle = context.Puzzles.Add(LoadTraining<LoopFinderDefinition>(loopfinder, @"C:\tutor-loopfinder-training.txt"));
            sokoban.TrainingPuzzle = context.Puzzles.Add(LoadTraining<SokobanDefinition>(sokoban, @"C:\tutor-sokoban-training.txt"));
            context.SaveChanges();

            var all = new List<Puzzle>();
            LoadPuzzles(rushhour, @"C:\tutor-rushhour.txt", ConvertDefinition<RushHourDefinition>).ForEach(all.Add);
            LoadPuzzles(loopfinder, @"C:\tutor-loopfinder.txt", ConvertDefinition<LoopFinderDefinition>).ForEach(all.Add);
            LoadPuzzles(sokoban, @"C:\tutor-sokoban.txt", ConvertDefinition<SokobanDefinition>).ForEach(all.Add);
            LoadStats(all, @"C:\tutor-rushhour-boxplot.txt");
            LoadStats(all, @"C:\tutor-sokoban-boxplot.txt");
            LoadStats(all, @"C:\tutor-loopfinder-boxplot.txt");
            all.ForEach(p => context.Puzzles.Add(p));
            context.SaveChanges();
        }
    }
}