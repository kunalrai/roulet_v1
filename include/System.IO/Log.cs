using System.IO;
using System.Text;
using System.Threading;

namespace System
{
    public static class Log
    {
        static ConsoleWriter _Warning;
        static ConsoleWriter _Info;
        static ConsoleWriter _Green;

        static Log()
        {
            _Warning = new ConsoleWriter(Console.Out, ConsoleColor.Yellow);
            _Info = new ConsoleWriter(Console.Out, ConsoleColor.White);
            _Green = new ConsoleWriter(Console.Out, ConsoleColor.Green);

            Console.SetOut(
                    new ConsoleWriter(Console.Out, ConsoleColor.Gray));

            Console.SetError(
                    new ConsoleWriter(Console.Error, ConsoleColor.Red));
        }

        public static void Green(string value)
        {
            _Green?.WriteLine(value);
        }

        public static void Info(string value)
        {
            _Info?.WriteLine(value);
        }

        public static void Warning(string value)
        {
            _Warning?.WriteLine(value);
        }

        public static void Error(string value)
        {
            System.Console.Error?.WriteLine(value);
        }
    }
}
