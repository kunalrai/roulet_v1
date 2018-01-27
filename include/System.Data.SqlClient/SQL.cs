namespace System.Data.SqlClient
{
    using Configuration;
    using Collections.Generic;
    using Common;

    public class SQL
    {
        public class _Error : DbException
        {
            public _Error() : base()
            {
            }
            public _Error(string message) : base(message)
            {
            }
        }

        static Dictionary<string, string> _connectionStrings = new Dictionary<string, string>();
        public static string GetConnectionString(string name)
        {
            string connectionString;

            lock (_connectionStrings)
            {
                if (_connectionStrings.TryGetValue(name, out connectionString))
                {
                    return connectionString;
                }
                else
                {
                    ConnectionStringSettings connectionStringSettings = ConfigurationManager.ConnectionStrings[name];
                    if (connectionStringSettings != null)
                    {
                        connectionString = connectionStringSettings.ConnectionString;
                    }
                    if ((connectionString == null) || (connectionString.Length < 1))
                    {
                        throw new ConfigurationErrorsException(string.Format("Connection string \"{0}\" is not found. File: {1}",
                            name,
                            System.AppDomain.CurrentDomain.SetupInformation.ConfigurationFile));
                    }
                    _connectionStrings.Add(
                        name,
                        connectionString);
                }
            }
            return connectionString;
        }
        protected internal virtual string GetConnectionStringName() { return null; }
        string _connectionString;
        public string ConnectionString
        {
            get
            {
                if (string.IsNullOrEmpty(_connectionString))
                {

                    ConnectionStringSettings connectionStringSettings = ConfigurationManager.ConnectionStrings.Count > 0 ?
                      ConfigurationManager.ConnectionStrings["local"] : null;


                    if (connectionStringSettings != null)
                    {
                        _connectionString = connectionStringSettings.ConnectionString;
                    }
                    if ((_connectionString == null) || (_connectionString.Length < 1))
                    {
                        throw new ConfigurationErrorsException(string.Format("Connection string is not found. File: {0}",
                            System.AppDomain.CurrentDomain.SetupInformation.ConfigurationFile));
                    }
                }
                return _connectionString;
            }
            set
            {
                _connectionString = value;
            }
        }
        public string GetConnectionString()
        {
            return _connectionString;
        }
        Dictionary<string, object> _Parameters;
        public Dictionary<string, object> Parameters
        {
            get
            {
                if (_Parameters == null)
                {
                    _Parameters = new Dictionary<string, object>();
                }
                return _Parameters;
            }
        }
        string _CommandText;
        public string CommandText
        {
            get
            {
                if (_CommandText == null)
                {
                    return string.Empty;
                }

                return _CommandText;
            }
            set
            {
                _CommandText = value;
            }
        }
        public SQL(string commandText)
        {
            if (commandText == null)
            {
                throw new ArgumentNullException(commandText);
            }
            _CommandText = commandText;
        }
        public static implicit operator SQL(string commandText)
        {
            return new SQL(commandText);
        }
        public void Clear()
        {
            _CommandText = "";
        }
        public void Append(String fragment)
        {
            if (fragment == null)
            {
                _CommandText += "\r\n";
            }
            else
            {
                _CommandText += fragment;
            }
        }
        public void Execute(Action<int, Newtonsoft.Json.Linq.JObject, object> f, object state = null)
        {
            int k = 0;

            Execute((reader) =>
            {

                Newtonsoft.Json.Linq.JObject j = new Newtonsoft.Json.Linq.JObject();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    String name = reader.GetName(i);

                    switch (reader.GetFieldType(i).Name)
                    {
                        case "DateTime":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetDateTime(i);
                            }

                            break;

                        case "Int16":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = (Int32)reader.GetInt16(i);
                            }

                            break;

                        case "Int32":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetInt32(i);
                            }

                            break;

                        case "Single":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetFloat(i);
                            }

                            break;

                        case "Guid":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetGuid(i).ToString("N");
                            }

                            break;

                        case "Double":

                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetDouble(i);
                            }

                            break;

                        case "String":
                            if (!reader.IsDBNull(i))
                            {
                                j[name] = reader.GetString(i);
                            }

                            break;

                        default:
                            throw new NotImplementedException($"Field not supported: '{reader.GetFieldType(i).Name}'");

                    }
                }

                if (f != null)
                {
                    f(k++, j, state);
                }

            });
        }
        public void Execute(Action<SqlDataReader> f, bool commit = false)
        {
            SqlConnection connection = new SqlConnection(ConnectionString);
            try
            {
                connection.Open();

                IsolationLevel iso = IsolationLevel.ReadCommitted;

                if (!commit)
                {
                    iso = IsolationLevel.ReadUncommitted;
                }

                SqlTransaction transaction = connection.BeginTransaction(iso);
                try
                {
                    SqlCommand command = new SqlCommand(CommandText, connection, transaction);
                    try
                    {
                        foreach (KeyValuePair<string, object> k in Parameters)
                        {
                            Tuple<object, SqlDbType> p = k.Value as Tuple<object, SqlDbType>;
                            if (p == null)
                            {
                                command.Parameters.AddWithValue(k.Key,
                                    k.Value == null ? DBNull.Value : k.Value);
                            }
                            else
                            {
                                command.Parameters.Add(new SqlParameter(k.Key, p.Item2)
                                {
                                    Value = p.Item1 == null ? DBNull.Value : p.Item1
                                });
                            }
                        }

                        SqlDataReader reader = command.ExecuteReader();
                        try
                        {
                            while (reader.Read())
                            {
                                if (f != null)
                                {
                                    f(reader);
                                }
                            }
                        }
                        finally
                        {
                            reader.Close();
                        }

                        if (commit)
                        {
                            transaction.Commit();
                        }

                    }
                    finally
                    {
                        command.Dispose();
                    }
                }
                finally
                {
                    transaction.Dispose();
                }
            }
            finally
            {
                connection.Dispose();
            }
        }

        public int Execute(bool commit = false)
        {
            SqlConnection connection = new SqlConnection(ConnectionString);
            try
            {
                connection.Open();

                IsolationLevel iso = IsolationLevel.ReadCommitted;

                if (!commit)
                {
                    iso = IsolationLevel.ReadUncommitted;
                }

                SqlTransaction transaction = connection.BeginTransaction(iso);
                try
                {
                    SqlCommand command = new SqlCommand(CommandText, connection, transaction);
                    try
                    {
                        foreach (KeyValuePair<string, object> k in Parameters)
                        {
                            Tuple<object, SqlDbType> p = k.Value as Tuple<object, SqlDbType>;
                            if (p == null)
                            {
                                command.Parameters.AddWithValue(k.Key,
                                    k.Value == null ? DBNull.Value : k.Value);
                            }
                            else
                            {
                                command.Parameters.Add(new SqlParameter(k.Key, p.Item2)
                                {
                                    Value = p.Item1 == null ? DBNull.Value : p.Item1
                                });
                            }
                        }

                        int res = command.ExecuteNonQuery();

                        if (commit)
                        {
                            transaction.Commit();
                        }

                        return res;

                    }
                    finally
                    {
                        command.Dispose();
                    }

                }
                finally
                {
                    transaction.Dispose();
                }
            }
            finally
            {
                connection.Dispose();
            }
        }

        public delegate dynamic CallbackDelegate(SqlDataReader reader);

        public T ExecuteQuery<T>(CallbackDelegate callback, bool commit = false)
        { 
            SqlConnection connection = new SqlConnection(ConnectionString);
            try
            {
                connection.Open();

                IsolationLevel iso = IsolationLevel.ReadCommitted;

                if (!commit)
                {
                    iso = IsolationLevel.ReadUncommitted;
                }

                SqlTransaction transaction = connection.BeginTransaction();
                try
                {
                    SqlCommand command = new SqlCommand(CommandText, connection, transaction);
                    try
                    {
                        foreach (KeyValuePair<string, object> k in Parameters)
                        {
                            Tuple<object, SqlDbType> p = k.Value as Tuple<object, SqlDbType>;
                            if (p == null)
                            {
                                command.Parameters.AddWithValue(k.Key,
                                    k.Value == null ? DBNull.Value : k.Value);
                            }
                            else
                            {
                                command.Parameters.Add(new SqlParameter(k.Key, p.Item2)
                                {
                                    Value = p.Item1 == null ? DBNull.Value : p.Item1
                                });
                            }
                        }

                        T result = default(T);

                        SqlDataReader reader = command.ExecuteReader();
                        try
                        {
                            result = callback(reader);
                        }
                        finally
                        {
                            reader.Close();
                        }

                        if (commit)
                        {
                            transaction.Commit();
                        }

                        return result;

                    }
                    finally
                    {
                        command.Dispose();
                    }
                }
                finally
                {
                    transaction.Dispose();
                }
            }
            finally
            {
                connection.Dispose();
            }
        }

    }
}