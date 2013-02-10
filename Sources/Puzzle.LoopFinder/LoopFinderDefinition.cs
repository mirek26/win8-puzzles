namespace Puzzles.Puzzle.LoopFinder
{
    using System.Linq;
    using System.Collections.Generic;
    using Newtonsoft.Json;

    public class LoopFinderDefinition: List<string>
    {
        public LoopFinderDefinition(IList<string> definition): base(definition)
        {
            InitialState = new LoopFinderState();
        }

        public static LoopFinderDefinition FromTutor(IList<string> definition) {
            return new LoopFinderDefinition(definition.Skip(1).ToList());
        }

        [JsonIgnore]
        public LoopFinderState InitialState { get; set; }
    }
}
