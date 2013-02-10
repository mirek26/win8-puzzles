

namespace Puzzles.Puzzle.Sokoban
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    using Newtonsoft.Json;

    public class SokobanDefinition
    {
        public const char Wall = '#';
        public const char Post = '.';
        public const char OutOfMap = '-';
        public const char FreeSpace = ' ';

        /// <summary>
        /// Map. "#": wall, ".": post, "-": out of map, " ": free space in map
        /// </summary>
        [JsonProperty("map")]
        public List<string> Map { get; set; }

        [JsonProperty("position")]
        public int[] StoremanPosition { get; set; }

        [JsonProperty("boxes")]
        public List<int[]> Boxes { get; set; }

        public static SokobanDefinition FromTutor(IList<string> definition) {
            const char Man = '@';
            const char Box = '$';
            const char BoxOnPost = '*';

            var result = new SokobanDefinition();
            result.Map = definition.Where(s => !string.IsNullOrWhiteSpace(s)).ToList();
            result.Boxes = new List<int[]>();

            var maxlength = definition.Select(s => s.Length).Max();
            for (var i = 0; i < result.Map.Count; i++)
            {
                var sb = new StringBuilder(result.Map[i]);
                sb.Replace(FreeSpace, OutOfMap, 0, result.Map[i].IndexOf(Wall));
                for (var j = 0; j < sb.Length; j++)
                {
                    switch (sb[j])
                    {
                        case Man:
                            result.StoremanPosition = new[] { i, j };
                            sb[j] = FreeSpace;
                            break;
                        case Box:
                            result.Boxes.Add(new[] { i, j });
                            sb[j] = FreeSpace;
                            break;
                        case BoxOnPost:
                            result.Boxes.Add(new[] { i, j });
                            sb[j] = Post;
                            break;
                    }
                }
                result.Map[i] = sb.ToString().PadRight(maxlength, OutOfMap);
            }

            return result;
        }
    }
}
