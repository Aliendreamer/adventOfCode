namespace adventofcode2023
{
	using System.Diagnostics;
	using System.Globalization;
	public static class Helpers
	{
		public static string TaskInput(int day)
		{
			string inputFileName = "input.txt";
			string currentDirectory = Directory.GetCurrentDirectory();
			string dirc = string.Format(CultureInfo.InvariantCulture, "day{0}", day);
			string inputFilePath = Path.Combine(currentDirectory, "days", dirc, inputFileName);
			string input = File.ReadAllText(inputFilePath);
			return input;
		}

		public static void BenchmarkDay(Action func)
		{
			Stopwatch stopwatch = Stopwatch.StartNew();
			func();
			stopwatch.Stop();
			Console.WriteLine($"Day  solution executed in: {stopwatch.ElapsedMilliseconds} ms");
		}
	}
}
