namespace adventofcode2023
{
	using System;
	using System.Globalization;
	using System.Text.RegularExpressions;

	public static class Day1
	{
		public static void Run1()
		{

			Console.WriteLine("Running Day 1 part 1");

			string input = Helpers.TaskInput(1);
			string[] coordinates = input.Split("\n");
			Regex regex = new(@"\d{1}", RegexOptions.Compiled);
			ulong sum = coordinates.Select(x =>
			{
				var matches = regex.Matches(x);
				var allMatches = matches.ToList();
				bool isSingleLineValue = allMatches.Count == 1;
				if (isSingleLineValue)
				{
					var value = allMatches.First().Value;
					int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out int result);
					return (ulong)Helpers.ConcatNumbers(result, result);
				}
				string firstValue = allMatches.First().Value;
				string lastValue = allMatches.Last().Value;
				int.TryParse(firstValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out int firstResult);
				int.TryParse(lastValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out int lastResult);

				return (ulong)Helpers.ConcatNumbers(firstResult, lastResult);

			}).Sum();

			Console.WriteLine($"Sum of input: {sum}");
		}
		public static void Run2()
		{

			Console.WriteLine("Running Day 1 part 2");
			Dictionary<string, int> dict = new()
			{
				{"one",1},
				{"two",2},
				{"three",3},
				{"four",4},
				{"five",5},
				{"six",6},
				{"seven",7},
				{"eight",8},
				{"nine",9}

			};
			string input = Helpers.TaskInput(1);
			string[] coordinates = input.Split("\n");
			Regex regex = new(@"(?=(one|two|three|four|five|six|seven|eight|nine))|\d{1}", RegexOptions.IgnoreCase);

			var sum = coordinates.Select(x =>
			{
				MatchCollection matches = regex.Matches(x);
				var allMatches = matches.ToList();
				bool isSingleLineValue = allMatches.Count == 1;
				if (isSingleLineValue)
				{
					var match = allMatches.First();
					var value = match.Groups[1].Success ? match.Groups[1].Value : match.Value;
					bool parsedInt = int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out int result);
					if (!parsedInt)
					{
						dict.TryGetValue(value!, out int found);
						return Helpers.ConcatNumbers(found, found);
					}
					return Helpers.ConcatNumbers(result, result);
				}
				Match firstMatch = allMatches.First();
				Match secondMatch = allMatches.Last();

				string firstValue = firstMatch.Groups[1].Success ? firstMatch.Groups[1].Value : firstMatch.Value;
				string lastValue = secondMatch.Groups[1].Success ? secondMatch.Groups[1].Value : secondMatch.Value;
				bool firstParse = int.TryParse(firstValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out int firstResult);
				bool secondParse = int.TryParse(lastValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out int lastResult);
				dict.TryGetValue(firstValue, out int firstDict);
				dict.TryGetValue(lastValue, out int secondDict);
				int first = firstParse ? firstResult : firstDict;
				int second = secondParse ? lastResult : secondDict;
				return Helpers.ConcatNumbers(first, second);

			}).Sum();
			Console.WriteLine($"Sum of input: {sum}");
		}
	}
}
