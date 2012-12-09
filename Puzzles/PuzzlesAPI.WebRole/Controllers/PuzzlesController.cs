// --------------------------------------------------------------------------------------------------------------------
// <copyright file="PuzzlesController.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the PuzzlesController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.API.Controllers
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

    using Puzzles.API.Models;

    public class PuzzlesController : ApiController
    {
        private PuzzlesDbContext db = new PuzzlesDbContext();

        // GET api/puzzles
        public IEnumerable<Puzzle> GetPuzzles(
            string type = null,
            int top = 0,
            int skip = 0)
        {
            var q = this.db.Puzzles.AsQueryable();
            if (type != null)
            {
                q = q.Where(p => p.Type == type);
            }

            q = q.OrderBy(p => p.Id).Skip(skip);
            if (top != 0)
            {
                q = q.Take(top);
            }

            return q.AsEnumerable();
        }

        // GET api/puzzles/1234
        public Puzzle GetPuzzle(int id)
        {
            var puzzle = this.db.Puzzles.Find(id);
            if (puzzle == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return puzzle;
        }

        // PUT api/puzzles/5
        public HttpResponseMessage PutPuzzle(int id, Puzzle puzzle)
        {
            if (puzzle == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid input object.");
            }

            if (!ModelState.IsValid || id != puzzle.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            this.db.Entry(puzzle).State = EntityState.Modified;

            try
            {
                this.db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/puzzles
        public HttpResponseMessage PostPuzzle(Puzzle puzzle)
        {
            if (puzzle == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid input object.");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            this.db.Puzzles.Add(puzzle);
            this.db.SaveChanges();

            var response = Request.CreateResponse(HttpStatusCode.Created, puzzle);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = puzzle.Id }));
            return response;
        }

        // DELETE api/puzzles
        public HttpResponseMessage DeletePuzzle(int id)
        {
            var puzzle = this.db.Puzzles.Find(id);
            if (puzzle == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            this.db.Puzzles.Remove(puzzle);

            try
            {
                this.db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, puzzle);
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}