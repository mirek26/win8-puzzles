// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzlesController.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzlesController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Configuration;

namespace Puzzles.API.Webrole.WebRole.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Validation;
    using System.Data.Entity.Infrastructure;
    using System.Diagnostics;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Contract = Puzzles.API.Contract;
    using Models;
    using Newtonsoft.Json;

    public class PuzzlesController : ApiController
    {
        private PuzzlesDb db = new PuzzlesDb();

        // GET api/puzzles
        public IEnumerable<Contract.PuzzleType> GetPuzzles()
        {
            try
            {
                return this.db.PuzzleTypes.Select(puzzle => new Contract.PuzzleType
                {
                    Id = puzzle.Id,
                    Title = puzzle.Title,
                    Training = puzzle.TrainingPuzzleId,
                    Subtitle = puzzle.Subtitle,
                    Rules = puzzle.Rules
                });
            }
            catch (DataException dbEx)
            {
                foreach (var validationErrors in (dbEx.InnerException as DbEntityValidationException).EntityValidationErrors)
                {
                    foreach (var validationError in validationErrors.ValidationErrors)
                    {
                        Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                    }
                }
            }
            return null;
        }

        // GET api/puzzles/rushHour
        public IEnumerable<Contract.Puzzle> GetPuzzles(
            string id)
        {
            return this.db.Puzzles
                    .Where(p => p.Type.Id == id && !p.Hidden)
                    .Select(puzzle => new Contract.Puzzle
                    {
                            Id = puzzle.Id, 
                            Type = puzzle.TypeId, 
                            Title = puzzle.Title, 
                            Solved = false, 
                            ExpectedTime = puzzle.MedianTime,
                            SpendTime = null, 
                    })
                    .OrderBy(p => p.ExpectedTime);
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}