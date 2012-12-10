// --------------------------------------------------------------------------------------------------------------------
// <copyright file="User.cs" company="">
//   Copyright (c) Miroslav Klimos, myreggg@gmail.com. 
// </copyright>
// <summary>
//   Basic information about a user.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Puzzles.Contract
{
    /// <summary>
    /// Basic information about a user.
    /// </summary>
    public class User
    {
        /// <summary>
        /// An enumeration representing the highest completed education.
        /// </summary>
        public enum Education
        {
            Elementary,
            Secontary,
            Tertiary
        }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the year of birth of the user.
        /// </summary>
        public int YearOfBirth { get; set; }

        /// <summary>
        /// Gets or sets the highest completed education level of the user.
        /// </summary>
        public Education CompletedEducation { get; set; }
    }
}
