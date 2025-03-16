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
			bool run = true;
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
			var inputLines = (string[])Helpers.TaskInput(8, InputFormat.Multiline);
			var commands = inputLines[0].ToCharArray();
			var input = inputLines.Skip(2);

			foreach (var line in input)
			{
				var values = pattern.Matches(line);
				dictionary.Add(values[0].Value, [values[1].Value, values[2].Value]);
			}

			var allAKeys = dictionary.Keys.Where(k => k.EndsWith('A')).ToList();
			List<long> roundValues = []; // Use long to prevent overflow

			// Process each starting key
			foreach (var startKey in allAKeys)
			{
				bool run = true;
				long rounds = 0;
				int index = 0; // Start from index 0
				var currentKey = startKey;

				while (run)
				{
					rounds++;
					var currentCommand = commands[index];
					dictionary.TryGetValue(currentKey, out string[]? current);
					if (current is null) break;

					// Move based on command
					currentKey = currentCommand == 'R' ? current[1] : current[0];

					// Cycle through commands
					index = (index + 1) % commands.Length;

					// Stop when reaching a node ending with 'Z'
					run = !currentKey.EndsWith('Z');
				}
				roundValues.Add(rounds);
			}

			long total = LCMOfArray([.. roundValues]);

			Console.WriteLine("Total rounds: " + total);
		}

		// Helper function to calculate LCM of an array
		static long GCD(long a, long b)
		{
			while (b != 0)
			{
				long temp = b;
				b = a % b;
				a = temp;
			}
			return a;
		}

		static long LCM(long a, long b) => (a / GCD(a, b)) * b;

		static long LCMOfArray(long[] numbers)
		{
			long result = numbers[0];
			for (int i = 1; i < numbers.Length; i++)
			{
				result = LCM(result, numbers[i]);
			}
			return result;
		}

	}
}