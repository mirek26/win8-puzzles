﻿

namespace API.Webrole.WebRole.Models
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.IO;
    using System.Text.RegularExpressions;

    using Newtonsoft.Json;
    using Puzzles.RushHour;

    public class SampleData : DropCreateDatabaseAlways<PuzzlesDb>
    {
        protected override void Seed(PuzzlesDb context)
        {
            var rushhour = context.PuzzleTypes.Add(new PuzzleType
                {
                    Id = "RushHour",
                    Title = "Rush Hour", 
                    Subtitle = "Hey, this is the great rush hour puzzle!", 
                    Rules = "Move the red car to the exit!",
                });

            context.PuzzleTypes.Add(new PuzzleType
                {
                    Id = "Sokoban",
                    Title = "Sokoban",
                    Subtitle = "Move all the boxes to their places!",
                    Rules = "Move all the boxes to their places!"
                });

            context.PuzzleTypes.Add(new PuzzleType
                {
                    Id = "Polyominoes",
                    Title = "Polyominoes",
                    Subtitle = "Put all the pieces in the mold!" 
                });

            context.PuzzleTypes.Add(new PuzzleType
                {
                    Id = "Nurikabe",
                    Title = "Nurikabe",
                    Subtitle = "Build the river!"
                });

            context.PuzzleTypes.Add(new PuzzleType
            {
                Id = "LoopFinder",
                Title = "Loop Finder",
                Subtitle = "Build the fence!"
            });

            var user1 = context.Users.Add(new User()
                {
                    Name = "Mirek Klimoš",
                    Info = "Já, ne", 
                    YearOfBirth = 1989,
                    CompletedEducation = User.Education.Tertiary
                });
            var user2 = context.Users.Add(new User()
                {
                    Name = "Tutor", 
                    Info = "Data associated with this account are imported from tutor.fi.muni.cz."
                });

            var buffer = new List<string>();
            Puzzle puzzle = null;
            var idline = new Regex(@"id: (\d*);(.*)");

            var filepath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "tutor_rushHour.txt");
            foreach (var line in File.ReadAllLines(filepath))
            {
                var match = idline.Match(line, 0);
                if (match.Success)
                {
                    if (puzzle != null)
                    {
                        puzzle.Definition = JsonConvert.SerializeObject(new RushHourDefinition(buffer.ToArray()));
                        context.Puzzles.Add(puzzle);
                    }

                    puzzle = new Puzzle()
                        {
                            Author = user2,
                            Created = DateTime.Now,
                            Name = match.Groups[2].Value,
                            TutorId = Convert.ToInt32(match.Groups[1].Value),
                            Type = rushhour
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
                puzzle.Definition = JsonConvert.SerializeObject(new RushHourDefinition(buffer.ToArray()));
                context.Puzzles.Add(puzzle);
            }

            base.Seed(context);
        }
    }
}