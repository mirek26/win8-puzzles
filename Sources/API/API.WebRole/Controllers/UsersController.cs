// --------------------------------------------------------------------------------------------------------------------
// <copyright file="UsersController.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Defines the UsersController type.
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

    using Models;

    public class UsersController : ApiController
    {
        private PuzzlesDbContext db = new PuzzlesDbContext();

        // GET api/users
        public IEnumerable<User> GetUsers()
        {
            return this.db.Users.AsEnumerable();
        }

        // GET api/users/1234
        public User GetUser(int id)
        {
            var user = this.db.Users.Find(id);
            if (user == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return user;
        }

        protected override void Dispose(bool disposing)
        {
            this.db.Dispose();
            base.Dispose(disposing);
        }
    }
}