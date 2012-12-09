
namespace Puzzles.API.Models
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web;

    using System.Data.Entity;
    using Puzzles.Contract;

    public class PuzzleDbContext : DbContext
    {
        public DbSet<Puzzle> Puzzles { get; set; }
    }
}