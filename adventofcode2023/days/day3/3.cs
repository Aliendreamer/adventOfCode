namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	using System.Text.RegularExpressions;

	public static class Day3
	{
		public static void Run1()
		{
			Console.WriteLine("Running Day 3 part 1");
			var lines = Helpers.TaskInput(3, true);
			var lineLength = lines[0].Length;

			var symbolsRegex = new Regex("[^0-9.\r\n]");
			var numbersRegex = new Regex(@"\d+");

			var potentialGears = new Dictionary<string, List<int>>();
			var validPartNumbers = new List<int>();
			var sumOfGears = 0;
			var numbers = lines.SelectMany(
					(line, lineNumber) => numbersRegex.Matches(line)
						.Select(x => new
						{
							Value = int.Parse(x.Value, CultureInfo.InvariantCulture),
							LineNumber = lineNumber,
							StartIndex = x.Index,
							x.Length,
							EndIndex = x.Index - 1 + x.Length
						}));

			var symbols = lines.SelectMany(
							(line, lineNumber) => symbolsRegex.Matches(line)
								.Select(x => new
								{
									symbol = x.Value,
									LineNumber = lineNumber,
									position = x.Index
								}));
			foreach (var symbol in symbols)
			{
				var variants = Helpers.GridMovePatternsAndDiagonals.Select(x => new
				{
					line = symbol.LineNumber + x[0],
					position = symbol.position + x[1]
				});

				var connected = numbers.Where(num => variants.Any(v => v.line == num.LineNumber && (v.position == num.StartIndex || v.position == num.EndIndex)));
				sumOfGears += connected.Select(x => x.Value).Sum();
			}
			Console.WriteLine(sumOfGears);
		}
		public static void Run2()
		{
			Console.WriteLine("Running Day 3 part 2");
			var lines = Helpers.TaskInput(3, true);
			var lineLength = lines[0].Length;

			var starRegex = new Regex("[*]");
			var numbersRegex = new Regex(@"\d+");

			var potentialGears = new Dictionary<string, List<int>>();
			var validPartNumbers = new List<int>();
			var sumOfGears = 0;
			var numbers = lines.SelectMany(
					(line, lineNumber) => numbersRegex.Matches(line)
						.Select(x => new
						{
							Value = int.Parse(x.Value, CultureInfo.InvariantCulture),
							LineNumber = lineNumber,
							StartIndex = x.Index,
							x.Length,
							EndIndex = x.Index - 1 + x.Length
						}));

			var symbols = lines.SelectMany(
							(line, lineNumber) => starRegex.Matches(line)
								.Select(x => new
								{
									symbol = x.Value,
									LineNumber = lineNumber,
									position = x.Index
								}));
			foreach (var symbol in symbols)
			{
				var variants = Helpers.GridMovePatternsAndDiagonals.Select(x => new
				{
					line = symbol.LineNumber + x[0],
					position = symbol.position + x[1]
				});

				var connected = numbers.Where(num => variants.Any(v => v.line == num.LineNumber && (v.position == num.StartIndex || v.position == num.EndIndex))).ToArray();
				if (connected.Length >= 2)
				{
					sumOfGears += connected.Select(x => x.Value).Aggregate((acc, num) => acc * num);
				}
			}
			Console.WriteLine(sumOfGears);

		}
	}
}
