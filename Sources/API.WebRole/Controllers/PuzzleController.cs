// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzleController.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzlesController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Webrole.WebRole.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Models;
    using Newtonsoft.Json;
    using Contract = Puzzles.API.Contract;

    public class PuzzleController : ApiController
    {
        private PuzzlesDb db = new PuzzlesDb();

        // GET api/puzzle/1234
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
                            Title = puzzle.Title,
                            Solved = false, 
                            Definition = JsonConvert.DeserializeObject(puzzle.Definition),
                            InitialState = JsonConvert.DeserializeObject(puzzle.InitialState),
                            State = null,
                            ExpectedTime = puzzle.MedianTime,
                            SpendTime = null, 
                            MeanTime = puzzle.MeanTime, 
                            MedianTime = puzzle.MedianTime,
                            Histogram = puzzle.Histogram != null ? JsonConvert.DeserializeObject<Puzzles.API.Contract.Histogram>(puzzle.Histogram) : null
                    };
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}