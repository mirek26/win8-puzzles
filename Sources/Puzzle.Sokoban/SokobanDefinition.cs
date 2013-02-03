

namespace Puzzles.Puzzle.Sokoban
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    public class SokobanDefinition: List<string>
    {
        public SokobanDefinition(IList<string> definition): base(definition)
        {
        }

        public static SokobanDefinition FromTutor(IList<string> definition) {
            return new SokobanDefinition(definition.ToList());
        }
    }
}
