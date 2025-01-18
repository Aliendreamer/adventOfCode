namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	public static class Day4
	{
		private static readonly char[] separator = [' '];

		public static void Run1()
		{
			Console.WriteLine("Running Day 4 part 1");
			var lines = (string[])Helpers.TaskInput(4, InputFormat.Multiline);
			var winnings = 0;
			foreach (var line in lines)
			{
				var input = line.Split("|");
				var numbers = input[0].Split(":", StringSplitOptions.RemoveEmptyEntries)
										.Last()
										.Split(separator, StringSplitOptions.RemoveEmptyEntries)
										.Select(x => int.Parse(x, CultureInfo.InvariantCulture))
										.ToArray();
				var sequence = input[1].Split(separator, StringSplitOptions.RemoveEmptyEntries)
										.Select(x => int.Parse(x, CultureInfo.InvariantCulture))
										.ToArray();

				var matches = numbers.Intersect(sequence).ToArray();
				if (matches.Length == 0)
				{
					continue;
				}
				winnings += matches.Length > 1 ? (int)Math.Pow(2, matches.Length - 1) : 1;
			}
			Console.WriteLine(winnings);

		}

		private static void CalculateScratchCards(string line, List<string> lines, Dictionary<string, int> cards)
		{
			if (cards.ContainsKey(line))
			{
				cards[line] += 1;

			}
			else
			{
				cards[line] = 1;
			}

			var input = line.Split("|");
			var numbers = input[0].Split(":", StringSplitOptions.RemoveEmptyEntries)
									.Last()
									.Split(separator, StringSplitOptions.RemoveEmptyEntries)
									.Select(x => int.Parse(x, CultureInfo.InvariantCulture))
									.ToArray();
			var sequence = input[1].Split(separator, StringSplitOptions.RemoveEmptyEntries)
									.Select(x => int.Parse(x, CultureInfo.InvariantCulture))
									.ToArray();
			var matches = numbers.Intersect(sequence).ToArray();
			if (matches.Length == 0)
			{
				return;
			}
			var newLines = lines.Skip(lines.IndexOf(line) + 1).Take(matches.Length).ToList();

			foreach (var copiedLine in newLines)
			{
				CalculateScratchCards(copiedLine, lines, cards);
			}
			return;
		}
		public static void Run2()
		{
			Console.WriteLine("Running Day 4 part 2");
			var lines = (string[])Helpers.TaskInput(4, InputFormat.Multiline);
			var cards = new Dictionary<string, int>();
			foreach (var item in lines)
			{
				CalculateScratchCards(item, [.. lines], cards);
			}

			int copies = cards.Values.Sum();
			Console.WriteLine(copies);

		}
	}
}
