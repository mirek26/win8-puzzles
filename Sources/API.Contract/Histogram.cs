
namespace Puzzles.API.Contract
{
    using System;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public class Histogram
    {
        [JsonProperty("len")]
        public int Length { get; set; }

        [JsonProperty("values")]
        public IList<int> Values { get; set; } 
    }
}
