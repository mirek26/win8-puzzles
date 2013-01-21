// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzlesController.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzlesController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using System.Configuration;

namespace TestAPI.WebRole.Controllers
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
        public IEnumerable<Contract.Puzzle> GetPuzzles(
            string type = null,
            int top = 0,
            int skip = 0)
        {
            var q = this.db.Puzzles.AsQueryable();
            if (type != null)
            {
                q = q.Where(p => p.Type.Id == type);
            }

            q = q.OrderBy(p => p.Id).Skip(skip);
            if (top != 0)
            {
                q = q.Take(top);
            }

            return q.AsEnumerable().Select(puzzle => new Contract.Puzzle
                    {
                            Id = puzzle.Id, 
                            Type = puzzle.TypeId, 
                            Name = puzzle.Name, 
                            Solved = false, 
                            ExpectedTime = TimeSpan.FromSeconds(123),
                            SpendTime = null, 
                    });
        }

        // GET api/puzzles/1234
        public Contract.PuzzleDetails GetPuzzle(int id)
        {
            var puzzle = this.db.Puzzles.Find(id);
            if (puzzle == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return new Contract.PuzzleDetails()
                    {
                            Id = puzzle.Id, 
                            Type = puzzle.TypeId, 
                            Name = puzzle.Name,
                            AuthorId = puzzle.AuthorId,
                            Solved = false, 
                            Definition = JsonConvert.DeserializeObject(puzzle.Definition),
                            State = null,
                            ExpectedTime = TimeSpan.FromSeconds(123),
                            SpendTime = null, 
                    };
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}