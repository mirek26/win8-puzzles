// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzlesDbContext.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzleDbContext type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Webrole.WebRole.Models
{
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;

    public class PuzzlesDb : DbContext
    {
        public DbSet<PuzzleType> PuzzleTypes { get; set; }

        public DbSet<Puzzle> Puzzles { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Status> Statuses { get; set; }

        public DbSet<ActionLog> ActionLogs { get; set; }

        //protected override void OnModelCreating(DbModelBuilder modelBuilder)
        //{
        //    //modelBuilder.Entity<Puzzle>()
        //    //            .HasRequired(p => p.Author)
        //    //            .WithMany()
        //    //            .WillCascadeOnDelete(false);

        //    //modelBuilder.Entity<UserData>()
        //    //            .HasRequired(p => p.User)
        //    //            .WithMany()
        //    //            .WillCascadeOnDelete(false);

        //    //modelBuilder.Conventions.Remove<IncludeMetadataConvention>();
        //}
    }
}