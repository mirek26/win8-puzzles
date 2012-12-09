using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Puzzles.API.Models
{
    using System.Data.Entity;

    public class SampleData : DropCreateDatabaseIfModelChanges<PuzzlesDbContext>
    {
        protected override void Seed(PuzzlesDbContext context)
        {
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

            var puzzle1 = context.Puzzles.Add(new Puzzle()
                {
                    Author = user1,
                    Created = DateTime.UtcNow.AddHours(-1),
                    Name = "Uloha U", 
                    Definition = "12345",
                    Type = "RushHour"
                });
            
            var puzzle2 = context.Puzzles.Add(new Puzzle()
                {
                    Author = user1,
                    Created = DateTime.UtcNow.AddHours(-2),
                    Name = "Uloha T",
                    Definition = "54321",
                    Type = "RushHour"
                });

            var data1 = context.Data.Add(new UserData()
                {
                    Puzzle = puzzle1, 
                    Received = DateTime.UtcNow.AddMinutes(-10),
                    User = user2,
                    Actions = new List<UserAction>()
                        {
                            new UserAction() { Description = "Open", Timestamp = DateTime.UtcNow.AddMinutes(-11) },
                            new UserAction() { Description = "Finish", Timestamp = DateTime.UtcNow.AddMinutes(-10.5) }
                        }
                });

            base.Seed(context);
        }
    }

}