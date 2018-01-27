using System;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;

namespace database
{
    public static class Logs
    {
        public static bool Log(JObject args)
        {

            Guid id = Guid.NewGuid();

            SQL query = @"
                INSERT INTO [dbo].[logs](id, gamer_id, coin, type, date)
                VALUES(@id, @user_id, @coin, @type, @date)
            ";

            query.Parameters.Add("id", id);
            query.Parameters.Add("user_id", args.Value<string>("user_id"));
            query.Parameters.Add("coin", args.Value<int>("coin"));
            query.Parameters.Add("type", args.Value<string>("type"));
            query.Parameters.Add("date", crm.Validator.CurentUnixTime());

            return query.Execute(true) > 0 ;

        }

        public static JArray List(int start)
        {

            SQL query = @"

                SELECT l.id, u.name, l.coin, l.type, l.date
                FROM logs as l
	            LEFT JOIN users as u
	            ON l.gamer_id = u.id
                WHERE l.date >= @start AND l.date <= @end

            ";

            int end = start + 86400;

            query.Parameters.Add("start", start);
            query.Parameters.Add("end", end);

            return query.ExecuteQuery<JArray>((reader) => {

                JArray list = new JArray();

                while (reader.Read())
                {

                    JObject user = new JObject();

                    if (!reader.IsDBNull(0))
                    {
                        user["id"] = reader.GetGuid(0);
                    }

                    if (!reader.IsDBNull(1))
                    {
                        user["name"] = reader.GetString(1);
                    }

                    if (!reader.IsDBNull(2))
                    {
                        user["coin"] = reader.GetInt32(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        user["type"] = reader.GetString(3);
                    }

                    if (!reader.IsDBNull(4))
                    {
                        user["date"] = reader.GetInt32(4);
                    }

                    list.Add(user);

                }

                return list;

            });

        }

    }
}
