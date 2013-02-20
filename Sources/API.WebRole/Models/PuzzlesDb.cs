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

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Puzzle>()
                .HasRequired(t => t.Type).WithMany().HasForeignKey(p => p.TypeId).WillCascadeOnDelete(false);
            //modelBuilder.Entity<PuzzleType>()
            //    .HasOptional(p => p.TrainingPuzzle).WillCascadeOnDelete(false);
            //modelBuilder.Entity<PuzzleType>().HasRequired(p => p.TrainingPuzzle).WithRequiredPrincipal().WillCascadeOnDelete(false);
        }
    }
}