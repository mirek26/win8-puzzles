namespace Puzzles.Puzzle.LoopFinder
{
    using System.Linq;
    using System.Collections.Generic;

    public class LoopFinderDefinition: List<string>
    {
        public LoopFinderDefinition(IList<string> definition): base(definition)
        {
        }

        public static LoopFinderDefinition FromTutor(IList<string> definition) {
            return new LoopFinderDefinition(definition.Skip(1).ToList());
        }
    }
}
