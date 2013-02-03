

namespace Puzzles.API.Webrole.WebRole.Models
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.IO;
    using System.Text.RegularExpressions;

    using Newtonsoft.Json;
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
                Rules = "<ul><li>Your goal is to get the red car out of grid.</li>"+
                    "<li>You can achieve that by moving other cars and trucks out of its way.</li>"+
                    "<li>Every car or truck can be moved only horizontally or vertically.</li>"+
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
                    "<li>Right-click, double-click or hold to mark a place as free (just for your convenience). </li></ul>"
            };

        private static List<Puzzle> LoadPuzzles(PuzzleType type, string filename, Func<IList<string>, string> convertDefinition, User user){
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
                        puzzle.Definition = convertDefinition(buffer);
                        result.Add(puzzle);
                    }

                    var tutorId = Convert.ToInt32(match.Groups[1].Value);
                    var title = string.IsNullOrEmpty(match.Groups[2].Value) ? type.Title + " " + match.Groups[1].Value : match.Groups[2].Value;
                    
                    puzzle = new Puzzle()
                        {
                            Author = user,
                            Created = DateTime.Now,
                            Title = title, 
                            TutorId = tutorId,
                            Type = type
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
                puzzle.Definition = convertDefinition(buffer);
                result.Add(puzzle);
            }

            return result;
        }

        private static string ConvertDefinition<T>(IList<string> def)
        {
            return JsonConvert.SerializeObject(typeof(T).GetMethod("FromTutor").Invoke(null, new[]{ def.ToArray() }));
        }

        protected override void Seed(PuzzlesDb context)
        {
            var rushhour = context.PuzzleTypes.Add(RushHourType);
            var loopfinder = context.PuzzleTypes.Add(LoopFinderType);
            var sokoban = context.PuzzleTypes.Add(SokobanType);

            var testuser = context.Users.Add(new User()
                {
                    Name = "Mirek Klimoš",
                    Info = "Já, ne", 
                    YearOfBirth = 1989,
                    CompletedEducation = User.Education.Tertiary
                });
            var tutor = context.Users.Add(new User()
                {
                    Name = "Tutor", 
                    Info = "Data associated with this account are imported from tutor.fi.muni.cz."
                });

            LoadPuzzles(rushhour, @"C:\tutor-rushhour.txt", ConvertDefinition<RushHourDefinition>, tutor).ForEach(p => context.Puzzles.Add(p));
            LoadPuzzles(loopfinder, @"C:\tutor-loopfinder.txt", ConvertDefinition<LoopFinderDefinition>, tutor).ForEach(p => context.Puzzles.Add(p));
            LoadPuzzles(sokoban, @"C:\tutor-sokoban.txt", ConvertDefinition<SokobanDefinition>, tutor).ForEach(p => context.Puzzles.Add(p));
            base.Seed(context);
        }
    }
}