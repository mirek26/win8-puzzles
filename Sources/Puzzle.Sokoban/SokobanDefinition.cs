

namespace Puzzles.Puzzle.Sokoban
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    using Newtonsoft.Json;

    public class SokobanDefinition: List<string>
    {
        public const char Wall = '#';
        public const char Post = '.';
        public const char OutOfMap = '-';
        public const char FreeSpace = ' ';

        public SokobanDefinition(List<string> list)
            : base(list)
        { 
        }
       
        public static SokobanDefinition FromTutor(IList<string> definition) {
            const char Man = '@';
            const char ManOnPost = '+';
            const char Box = '$';
            const char BoxOnPost = '*';

            var result = new SokobanDefinition(definition.Where(s => !string.IsNullOrWhiteSpace(s)).ToList());
            result.InitialState = new SokobanState
                {
                    Boxes = new List<int[]>()
                };

            int posts = 0;
            var maxlength = definition.Select(s => s.Length).Max();
            for (var i = 0; i < result.Count; i++)
            {
                var sb = new StringBuilder(result[i]);
                sb.Replace(FreeSpace, OutOfMap, 0, result[i].IndexOf(Wall));
                for (var j = 0; j < sb.Length; j++)
                {
                    var c = sb[j];
                    if (c == Man || c == ManOnPost) {
                        Debug.Assert(result.InitialState.Man == null, "More than one workman in the map.");
                        result.InitialState.Man = new[] { i, j };
                        sb[j] = FreeSpace;
                    }
                    
                    if (c == Box || c == BoxOnPost) {
                        result.InitialState.Boxes.Add(new[] { i, j });
                        sb[j] = c == Box ? FreeSpace : Post;
                    }

                    if (c == Post || c == BoxOnPost || c == ManOnPost)
                    {
                        posts++;
                    }
                }
                result[i] = sb.ToString().PadRight(maxlength, OutOfMap);
            }
            Debug.Assert(result.InitialState.Man != null, "No workman found in the map.");
            Debug.Assert(posts == result.InitialState.Boxes.Count, "The number of boxes doesn't match the number of posts.");
            return result;
        }

        [JsonIgnore]
        public SokobanState InitialState { get; set; }
    }
}
