
namespace Puzzles.API.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Puzzles.Contract;

    public class PuzzlesOldController : ApiController
    {
        // GET api/puzzles
        public IEnumerable<Puzzle> Get(
            string type = null, 
            int top = 0, 
            int skip = 0)
        {
            return new Puzzle[] { 
                new Puzzle
                {
                    Id = 1, 
                    Name = "Sample puzzle",
                    Author = "Myreg",
                    Type = "RushHour",
                    Definition = "1234"
                }, 
                new Puzzle
                {
                    Id = 2, 
                    Name = "Sample puzzle 2",
                    Author = "Myreg",
                    Type = "RushHour",
                    Definition = "123456"
                }
            };
        }

        // GET api/puzzles/5
        public HttpResponseMessage Get(HttpRequestMessage request, int id)
        {
            return request.CreateResponse(HttpStatusCode.OK, new Puzzle
                {
                    Id = id,
                    Name = "Sample puzzle",
                    Author = "Myreg",
                    Type = "RushHour",
                    Definition = "1234"
                });
        }

        // POST api/puzzles
        public HttpResponseMessage Post(HttpRequestMessage request, Puzzle puzzle)
        {
            return request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        // PUT api/puzzles/5
        public HttpResponseMessage Put(HttpRequestMessage request, int id, Puzzle value)
        {
            return request.CreateResponse(HttpStatusCode.NotImplemented);
        }

        // DELETE api/puzzles/5
        public HttpResponseMessage Delete(HttpRequestMessage request, int id)
        {
            return request.CreateResponse(HttpStatusCode.NotImplemented);
        }
    }
}
