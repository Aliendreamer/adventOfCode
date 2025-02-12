namespace adventofcode2023
{
	using System;
	using System.Data;
	using System.Globalization;
	using System.Linq;
	public static class Day6
	{
		public static void Run1()
		{
			Console.WriteLine("Running Day 6 part 1");
			var input = (string[])Helpers.TaskInput(6, InputFormat.Multiline);

			Console.WriteLine($"\nLowest location among seeds:{0}");
		}



		public static void Run2()
		{
			Console.WriteLine("Running Day 6 Part 2");

			var lines = (string[])Helpers.TaskInput(6, InputFormat.Multiline);

			Console.WriteLine($"\nLowest location among all seeds: {0}");
		}
	}
}