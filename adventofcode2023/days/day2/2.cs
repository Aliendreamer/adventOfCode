namespace adventofcode2023
{
	using System;
	using System.Globalization;
	using System.Text.RegularExpressions;

	public static class Day2
	{
		public static int ExtractNumber(string input)
		{
			var match = Regex.Match(input, @"\d+"); // Capture the digits
			return match.Success ? int.Parse(match.Value, CultureInfo.InvariantCulture) : 0;
		}
		public static void Run1()
		{

			Console.WriteLine("Running Day 2 part 1");
			int sumOfIds = 0;
			int powerOf = 0;
			string input = (string)Helpers.TaskInput(2);
			string[] games = input.Split("\n");
			int red = 12;
			int green = 13;
			int blue = 14;
			Regex regex = new(@"\d+", RegexOptions.Compiled);
			Regex redR = new(@"(\d+\sred)", RegexOptions.Compiled);
			Regex blueR = new(@"(\d+\sblue)", RegexOptions.Compiled);
			Regex greenR = new(@"(\d+\sgreen)", RegexOptions.Compiled);
			foreach (string game in games)
			{
				int.TryParse(regex.Match(game).Value,
					NumberStyles.Integer,
					CultureInfo.InvariantCulture,
				out int result);
				string[] gameSets = game.Split(":")[1].Split(";");
				bool isPossible = true;
				foreach (string set in gameSets)
				{
					int[] redArray = redR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int[] blueArray = blueR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int[] greenArray = greenR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int redSum = redArray.Sum();
					int blueSum = blueArray.Sum();
					int greenSum = greenArray.Sum();
					if (redSum > red || blueSum > blue || greenSum > green)
					{
						isPossible = false;
						break;
					}

				}
				Console.WriteLine($"Game: {result} is possible: {isPossible}");
				if (isPossible)
				{
					sumOfIds += result;
				}


			}
			Console.WriteLine($"Sum of ids: {sumOfIds}");
			Console.WriteLine($"Sum of powerof: {powerOf}");

		}
		public static void Run2()
		{

			int powerOf = 0;
			string input = (string)Helpers.TaskInput(2);
			string[] games = input.Split("\n");

			Regex regex = new(@"\d+", RegexOptions.Compiled);
			Regex redR = new(@"(\d+\sred)", RegexOptions.Compiled);
			Regex blueR = new(@"(\d+\sblue)", RegexOptions.Compiled);
			Regex greenR = new(@"(\d+\sgreen)", RegexOptions.Compiled);
			foreach (string game in games)
			{
				int lowestRed = int.MinValue;
				int lowestBlue = int.MinValue;
				int lowestGreen = int.MinValue;
				int.TryParse(regex.Match(game).Value,
					NumberStyles.Integer,
					CultureInfo.InvariantCulture,
				out int result);
				string[] gameSets = game.Split(":")[1].Split(";");
				foreach (string set in gameSets)
				{
					int[] redArray = redR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int[] blueArray = blueR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int[] greenArray = greenR.Matches(set).Cast<Match>().Select(m => ExtractNumber(m.Value)).ToArray();
					int redSum = redArray.Sum();
					int blueSum = blueArray.Sum();
					int greenSum = greenArray.Sum();

					if (redSum > lowestRed)
					{
						lowestRed = redSum;
					}
					if (blueSum > lowestBlue)
					{
						lowestBlue = blueSum;
					}
					if (greenSum > lowestGreen)
					{
						lowestGreen = greenSum;
					}
				}
				powerOf += lowestRed * lowestBlue * lowestGreen;

			}
			Console.WriteLine($"Sum of powerof: {powerOf}");
		}
	}
}
