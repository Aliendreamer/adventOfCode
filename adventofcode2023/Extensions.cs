namespace adventofcode2023
{
	public static class EnumerableExtensions
	{
		public static ulong Sum(this IEnumerable<ulong> source)
		{
			ArgumentNullException.ThrowIfNull(source);

			ulong sum = 0;
			foreach (var value in source)
			{
				sum += value;
			}
			return sum;
		}
	}

}