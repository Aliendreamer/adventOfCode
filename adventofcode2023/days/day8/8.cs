namespace adventofcode2023
{
	using System;
	using System.Text.RegularExpressions;

	public static class Day8
	{
		public static void Run1()
		{
			Console.WriteLine("Running Day 8 part 1");
			var dictionary = new Dictionary<string, string[]>();
			var pattern = new Regex(@"\w+");
			var currentKey = "AAA";
			string finishPattern = "ZZZ";
			var inputLines = (string[])Helpers.TaskInput(8, InputFormat.Multiline);
			var commands = inputLines[0].ToCharArray();
			var input = inputLines.Skip(2);

			foreach (var line in input)
			{
				var values = pattern.Matches(line);
				dictionary.Add(values[0].Value, [values[1].Value, values[2].Value]);
				Console.WriteLine("Total Winnings: ");
			}
			Boolean run = true;
			int rounds = 0;
			int index = -1;
			while (run)
			{
				rounds++;
				var isInRange = index + 1 < commands.Length;
				var curIndex = isInRange ? index + 1 : 0;
				index = isInRange ? index + 1 : 0;
				var currentCommand = commands[curIndex];
				if (currentCommand == 82)
				{
					dictionary.TryGetValue(currentKey, out string[]? current);
					if (current is null) break;
					var newCurrentKey = current[1];
					Console.WriteLine($"FROM {currentKey} to {newCurrentKey}");
					currentKey = newCurrentKey;
				}
				if (currentCommand == 76)
				{
					dictionary.TryGetValue(currentKey, out string[]? current);
					if (current is null) break;
					var newCurrentKey = current[0];
					Console.WriteLine($"FROM {currentKey} to {newCurrentKey}");
					currentKey = newCurrentKey;
				}
				run = currentKey != finishPattern;
			}
			Console.WriteLine("Total rounds: " + rounds);

		}

		public static void Run2()
		{
			Console.WriteLine("Running Day 8 Part 2");
			var dictionary = new Dictionary<string, string[]>();
			var pattern = new Regex(@"\w+");
			var currentKey = "AAA";
			string finishPattern = "ZZZ";
			var inputLines = (string[])Helpers.TaskInput(8, InputFormat.Multiline);
			var commands = inputLines[0].ToCharArray();
			var input = inputLines.Skip(2);

			foreach (var line in input)
			{
				var values = pattern.Matches(line);
				dictionary.Add(values[0].Value, [values[1].Value, values[2].Value]);
				Console.WriteLine("Total Winnings: ");
			}
			Boolean run = true;
			int rounds = 0;
			int index = -1;
			var allAKeys = dictionary.Keys.Where(k => k.Contains('A'));
			Console.WriteLine("Total rounds: " + rounds);
		}
	}
}