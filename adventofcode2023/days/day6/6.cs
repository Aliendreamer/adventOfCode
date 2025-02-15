namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	public static class Day6
	{
		public static long CalculateValues(long T, long R)
		{
			double discriminant = T * T - 4.0 * R;
			double sqrtDisc = Math.Sqrt(discriminant);
			double r1 = (T - sqrtDisc) / 2.0;
			double r2 = (T + sqrtDisc) / 2.0;
			long lowCandidate = (long)Math.Ceiling(r1 + 1e-9);
			long highCandidate = (long)Math.Floor(r2 - 1e-9);
			long count = Math.Max(0, highCandidate - lowCandidate + 1);
			return count;
		}
		public static void Run1()
		{
			Console.WriteLine("Running Day 6 part 1");
			var inputLines = (string[])Helpers.TaskInput(6, InputFormat.Multiline);

			// Parse the input.
			var durations = inputLines[0]
				.Split(' ', StringSplitOptions.RemoveEmptyEntries)
				.Skip(1)
				.Select(s => long.Parse(s, CultureInfo.InvariantCulture))
				.ToArray();
			var records = inputLines[1]
				.Split(' ', StringSplitOptions.RemoveEmptyEntries)
				.Skip(1)
				.Select(s => long.Parse(s, CultureInfo.InvariantCulture))
				.ToArray();

			long product = 1;
			for (int i = 0; i < durations.Length; i++)
			{
				long count = CalculateValues(durations[i], records[i]);
				product *= count;
			}
			Console.WriteLine($"\nProduct of ways for all races: {product}");
		}

		public static void Run2()
		{
			Console.WriteLine("Running Day 6 Part 2");

			var inputLines = (string[])Helpers.TaskInput(6, InputFormat.Multiline);

			var duration = long.Parse(string.Join("", inputLines[0]
				.Split(' ', StringSplitOptions.RemoveEmptyEntries)
				.Skip(1)
				.ToArray()), CultureInfo.InvariantCulture);
			var record = long.Parse(string.Join("", inputLines[1]
				.Split(' ', StringSplitOptions.RemoveEmptyEntries)
				.Skip(1)
				.ToArray()), CultureInfo.InvariantCulture);
			long product = CalculateValues(duration, record);
			Console.WriteLine($"\nProduct of ways for all races: {product}");
		}
	}
}