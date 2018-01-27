using Newtonsoft.Json.Linq;
#if REDIS
using StackExchange.Redis;
#endif
using System.IO;
using System.Text;

namespace System
{
    public static class Config
    {
        public static string RootPath
        {
            get
            {
                String root = null;

                if (root == null)
                {
                    root = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory);

                    if (System.IO.Path.GetDirectoryName(root).EndsWith("bin", StringComparison.OrdinalIgnoreCase) ||
    System.IO.Path.GetDirectoryName(root).EndsWith("bin\\", StringComparison.OrdinalIgnoreCase))
                    {

                        root = System.IO.Path.Combine(root, "..\\");
                    }
                }

                root = System.IO.Path.GetFullPath(root);

                if (!Directory.Exists(root))
                {
                    throw new DirectoryNotFoundException(string.Format("Invalid root directory: {0}", root));
                }

                return root;
            }
        }

        public static string Path(string path)
        {
            return System.IO.Path.Combine(RootPath, path);
        }

        static string StartUp;

        public static void SetConfigFile(string fileName)
        {
            StartUp = fileName;
        }

        public static JObject Load()
        {
            string fileName = StartUp;

            if (string.IsNullOrWhiteSpace(fileName))
            {
                fileName = System.IO.Path.Combine(
                            Config.RootPath
                            , "config.json");
            }

            fileName = System.IO.Path.Combine(RootPath, fileName);

            FileStream stream = null;
            try
            {
                stream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
            }
            catch (FileNotFoundException)
            {
                throw;
            }

            if (stream == null)
            {
                return new JObject();
            }

            try
            {
                StreamReader reader = new StreamReader(stream);
                try
                {
                    String data = reader.ReadToEnd();

                    if (!string.IsNullOrWhiteSpace(data))
                    {
                        return JObject.Parse(data);
                    }

                    return new JObject();

                }
                finally
                {
                    reader.Dispose();
                }
            }
            finally
            {
                stream.Dispose();
            }
        }

        public static JObject LoadStatus() {

            string fileName = System.IO.Path.Combine(
                            Config.RootPath
                            , "config.json");

            fileName = System.IO.Path.Combine(RootPath, fileName);

            FileStream stream = null;
            try{
                stream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
            }
            catch (FileNotFoundException){
                throw;
            }

            if (stream == null){
                return new JObject();
            }

            try{
                StreamReader reader = new StreamReader(stream);
                try{
                    String data = reader.ReadToEnd();
                    if (!string.IsNullOrWhiteSpace(data)){
                        return JObject.Parse(data);
                    }
                    return new JObject();
                }
                finally{
                    reader.Dispose();
                }
            }
            finally{
                stream.Dispose();
            }
        }

#if REDIS
        public static class Redis
        {
            public enum Databases : int
            {
                Scan = 10,
            }

            private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
            {
                Func<string> BuildConnectionString = () =>
                {
                    JObject config = Config.Load();
                    if (config == null)
                    {
                        throw new ApplicationException("Missing 'config.json' file.");
                    }

                    if (!(config["redis"] is JObject))
                        throw new FieldAccessException("'redis' section is not defined in the 'config.json' file.");

                    StringBuilder builder = new StringBuilder();
                    if (!String.IsNullOrWhiteSpace((String)config["redis"]["host"]))
                    {
                        builder.Append((String)config["redis"]["host"]);
                    }
                    if (builder.Length > 0 && !String.IsNullOrWhiteSpace((String)config["redis"]["[port"]))
                    {
                        builder.Append(":");
                        builder.Append((String)config["redis"]["port"]);
                    }

                    if (builder.Length > 0)
                    {
                        builder.Append(",allowAdmin=true");
                    }

                    if (builder.Length > 0 && !String.IsNullOrWhiteSpace((String)config["redis"]["password"]))
                    {
                        builder.Append(",password=");
                        builder.Append((String)config["redis"]["password"]);
                    }

                    if (builder.Length > 0 && !String.IsNullOrWhiteSpace((String)config["redis"]["ssl"]))
                    {
                        builder.Append(",ssl=");
                        builder.Append(((String)config["redis"]["ssl"]).ToLower());
                    }

                    return builder.ToString();
                };

                return ConnectionMultiplexer.Connect(BuildConnectionString());
            });

            public static ConnectionMultiplexer Multiplexer { get { return lazyConnection.Value; } }

            public static ISubscriber PubSub()
            {
                IConnectionMultiplexer multiplexer = Multiplexer;

                if (multiplexer == null)
                {
                    throw new System.Configuration.ConfigurationErrorsException();
                }

                return multiplexer.GetSubscriber();
            }

            public static void FlushAllDatabases()
            {
                IConnectionMultiplexer multiplexer = Multiplexer;

                if (multiplexer == null)
                {
                    throw new System.Configuration.ConfigurationErrorsException();
                }

                var endPoints = multiplexer.GetEndPoints();

                foreach (var i in endPoints)
                {
                    try
                    {
                        IServer server = multiplexer.GetServer(i);
                        if (server != null)
                        {
                            server.FlushAllDatabases();
                        }
                    }
                    catch
                    {
                        throw;
                    }
                }
            }

            public static IDatabase Database(Databases db)
            {
                IConnectionMultiplexer multiplexer = Multiplexer;

                if (multiplexer == null)
                {
                    throw new System.Configuration.ConfigurationErrorsException();
                }

                return multiplexer.GetDatabase((int)db);
            }
        }
#endif

        public static void Show(TextWriter writer = null)
        {
            if (writer == null)
            {
                writer = Console.Out;
            }

            JObject config = Load();

            if (config != null)
            {
                writer.Write(config.ToString(Newtonsoft.Json.Formatting.Indented));
            }
        }
    }
}