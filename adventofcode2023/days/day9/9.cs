
using Microsoft.VisualBasic;

namespace adventofcode2023;

public class Day9
{
    public static void Run1()
    {
        Console.WriteLine("Running Day 9 part 1");
        var inputLines = (string[])Helpers.TaskInput(9, InputFormat.Multiline);
        var values = new List<long>();
        foreach (var line in inputLines)
        {
            var coordinates = line.Split(" ").Select(long.Parse).ToList();
            var history = GetAllDiffLevelsStack(coordinates);
            var newAddValue = CalculateLineAddition(history);
            values.Add(newAddValue);
            Console.WriteLine("debugging");
        }
        Console.WriteLine("Total sum:{0} ", values.Sum());
    }
    private static long CalculateLineAddition(Stack<List<long>> lines)
    {
        List<long> previous = [0];
        long calculate = 0;
        while (lines.Count != 0)
        {
            var current = lines.Pop();
            if (current.All(x => x == 0))
            {
                previous = current;
                continue;
            }
            calculate = current.Last() + previous.Last();
            current.Add(calculate);
            previous = current;
        }

        return calculate;
    }

    private static long ExtrapolatePreviousValue(Stack<List<long>> stack)
    {
        long prev = 0;

        while (stack.Count > 0)
        {
            var level = stack.Pop();
            prev = level[0] - prev; // difference going backward
        }

        return prev;
    }

    private static Stack<List<long>> GetAllDiffLevelsStack(List<long> input)
    {
        var stack = new Stack<List<long>>();
        var current = new List<long>(input);

        while (true)
        {
            stack.Push(new List<long>(current));

            // Stop only if the current line is all zeroes
            if (current.All(x => x == 0))
                break;

            //Compute next diff (even if current.Count == 1)
            var next = new List<long>();
            for (int i = 1; i < current.Count; i++)
            {
                next.Add(current[i] - current[i - 1]);
            }

            current = next.Count == 0 ? new List<long> { 0 } : next;
        }

        return stack;
    }

    public static void Run2()
    {
        Console.WriteLine("Running Day 9 Part 2");
        var inputLines = (string[])Helpers.TaskInput(9, InputFormat.Multiline);
        var values = new List<long>();
        foreach (var line in inputLines)
        {
            var coordinates = line.Split(" ").Select(long.Parse).ToList();
            var history = GetAllDiffLevelsStack(coordinates);
            var newAddValue = ExtrapolatePreviousValue(history);
            values.Add(newAddValue);
            Console.WriteLine("debugging");
        }
        Console.WriteLine("Total sum:{0} ", values.Sum());
    }
}
