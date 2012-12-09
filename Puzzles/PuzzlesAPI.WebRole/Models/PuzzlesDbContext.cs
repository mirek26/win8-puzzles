// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzlesDbContext.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzleDbContext type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Models
{
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;

    public class PuzzlesDbContext : DbContext
    {
        public DbSet<Puzzle> Puzzles { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<UserData> Data { get; set; }

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