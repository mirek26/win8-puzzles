namespace Puzzles.Contract
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Collected data about how a user tried to solve a puzzle.
    /// </summary>
    public class UserData
    {
        /// <summary>
        /// Gets or sets the Id of the user the data comes from.
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets the Id of the puzzle.
        /// </summary>
        public int PuzzleId { get; set; }

        /// <summary>
        /// Gets or sets the date and time receipt of the data.
        /// </summary>
        public DateTime Received { get; set; }

        /// <summary>
        /// The actual data - list of user actions.
        /// </summary>
        public List<UserAction> Actions { get; set; }
    }
}
