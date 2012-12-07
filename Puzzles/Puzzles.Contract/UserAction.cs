
namespace Puzzles.Contract
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Represents a particular action of a user when solving a puzzle.
    /// </summary>
    public class UserAction
    {
        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of pausing.
        /// </summary>
        public const string Pause = "Pause";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of opening a puzzle.
        /// </summary>
        public const string Open = "Open";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of closing a puzzle (without finishing it).
        /// </summary>
        public const string Close = "Close";

        /// <summary>
        /// The string for the <see cref="Description"/> property that represents the action of finishing a puzzle.
        /// </summary>
        public const string Finished = "Finished";

        /// <summary>
        /// Gets or sets the timestamp of the action.
        /// </summary>
        public DateTime Timestamp { get; set; }

        /// <summary>
        /// Gets the sets the description of the action. Every type of puzzle can use different strings.
        /// </summary>
        public string Description { get; set; }
    }
}
