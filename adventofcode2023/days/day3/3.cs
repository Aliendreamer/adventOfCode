namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	using System.Text.RegularExpressions;

	public static class Day3
	{
		public static void Run()
		{
			Console.WriteLine("Running Day 3");
			var lines = Helpers.TaskInput(3, true);
			var lineLength = lines[0].Length;

			var symbolsRegex = new Regex("[^0-9.\r\n]");
			var starRegex = new Regex("[*]");
			var numbersRegex = new Regex(@"\d+");

			var potentialGears = new Dictionary<string, List<int>>();
			var validPartNumbers = new List<int>();

			var numbers = lines.SelectMany(
					(line, lineNumber) => numbersRegex.Matches(line)
						.Select(x => new
						{
							Value = int.Parse(x.Value, CultureInfo.InvariantCulture),
							LineNumber = lineNumber,
							StartIndex = x.Index,
							x.Length,
							EndIndex = x.Index + x.Length
						}));

		}
		public static void Run2()
		{
			string input = Helpers.TaskInput(3);
			Console.WriteLine(input);
		}
	}
}
