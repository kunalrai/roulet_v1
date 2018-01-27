using System.IO;
using System.Text;
using System.Threading;

namespace System
{
    public class ConsoleWriter : TextWriter
    {
        TextWriter _inner;
        ConsoleColor _color;
        Object _lock;

        public ConsoleWriter(TextWriter inner, ConsoleColor color)
        {
            _inner = inner;
            _color = color;
            _lock = new Object();
        }

        public override void WriteLine(string value)
        {
            lock (_lock)
            {
                ConsoleColor ForegroundColor = Console.ForegroundColor;
                if (Console.ForegroundColor != _color)
                {
                    Console.ForegroundColor = _color;
                }
                _inner.WriteLine(value);
                if (Console.ForegroundColor != ForegroundColor)
                {
                    Console.ForegroundColor = ForegroundColor;
                }
            }
        }

        public override void Write(string value)
        {
            lock (_lock)
            {
                ConsoleColor ForegroundColor = Console.ForegroundColor;
                if (Console.ForegroundColor != _color)
                {
                    Console.ForegroundColor = _color;
                }
                _inner.Write(value);
                if (Console.ForegroundColor != ForegroundColor)
                {
                    Console.ForegroundColor = ForegroundColor;
                }
            }
        }

        public override void Write(char value)
        {
            lock (_lock)
            {
                ConsoleColor ForegroundColor = Console.ForegroundColor;
                if (Console.ForegroundColor != _color)
                {
                    Console.ForegroundColor = _color;
                }
                _inner.Write(value);
                if (Console.ForegroundColor != ForegroundColor)
                {
                    Console.ForegroundColor = ForegroundColor;
                }
            }
        }

        public override Encoding Encoding
        {
            get
            {
                return _inner.Encoding;
            }
        }
    }
}
