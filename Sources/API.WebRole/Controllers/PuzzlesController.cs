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
    using System.Data.Entity.Infrastructure;
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
            return this.db.PuzzleTypes.AsEnumerable().Select(puzzle => new Contract.PuzzleType
            {
                Id = puzzle.Id,
                Title = puzzle.Title, 
                Subtitle = puzzle.Subtitle, 
                JsFile = puzzle.JsFile, 
                Rules = puzzle.Rules
            }); 
        }

        // GET api/puzzles/rushHour
        public IEnumerable<Contract.Puzzle> GetPuzzles(
            string id,
            int top = 0,
            int skip = 0)
        {
            var q = this.db.Puzzles.Where(p => p.Type.Id == id);
            
            q = q.OrderBy(p => p.Id).Skip(skip);
            if (top != 0)
            {
                q = q.Take(top);
            }

            return q.AsEnumerable().Select(puzzle => new Contract.Puzzle
                    {
                            Id = puzzle.Id, 
                            Type = puzzle.TypeId, 
                            Title = puzzle.Title, 
                            Solved = false, 
                            ExpectedTime = TimeSpan.FromSeconds(123),
                            SpendTime = null, 
                    });
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}