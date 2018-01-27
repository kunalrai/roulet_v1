using System;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Linq;
using System.Collections.Generic;

namespace database
{
    public static class Games
    {

        public static bool Start(JObject args)
        {

            Guid game_id = Guid.Parse(args.Value<string>("game_id"));
            Guid user_id = Guid.Parse(args.Value<string>("user_id"));

            SQL query = @"

                 IF NOT EXISTS (SELECT * FROM bets WHERE [user_id] = @user_id)
                    BEGIN
                          INSERT INTO [dbo].[bets]([id],[user_id], [current_bet],[game_id],[bets],[end], [time])
                                      VALUES(NEWID(), @user_id, NULL ,@game_id, NULL, @end, @time)
                    END
                 ELSE
                    BEGIN
                          UPDATE [dbo].[bets] 
                          SET [end] = @end,
                          [time] = @time
                          WHERE [user_id] = @user_id
                    END
            ";

            query.Parameters.Add("game_id", game_id);
            query.Parameters.Add("user_id", user_id);
            query.Parameters.Add("end", (byte)0);
            query.Parameters.Add("time", UnixTimeNow());


            return query.Execute(true) > 0;

        }

        public static bool Update(JObject args)
        {

            SQL query = @"

                   UPDATE [dbo].[games] 
                   SET [must_bet] = @must_bet
                   WHERE [id] = '07fe02e9-5ba8-4bd1-8f72-b1dd4336418c'

            ";

            query.Parameters.Add("must_bet", args.Value<int>("must_bet"));

            return query.Execute(true) > 0;

        }

        public static bool RandomUpdate(int must_bet)
        {

            SQL query = @"

                   UPDATE [dbo].[games] 
                   SET [must_bet] = @must_bet
                   WHERE [id] = '07fe02e9-5ba8-4bd1-8f72-b1dd4336418c'

            ";

            query.Parameters.Add("must_bet", must_bet);

            return query.Execute(true) > 0;

        }

        public static bool End(JObject args)
        {

            Guid user_id = Guid.Parse(args.Value<string>("user_id"));

            SQL query = @"
                  UPDATE [dbo].[bets] 
                  SET [end] = @end
                  WHERE [user_id] = @user_id
            ";

            query.Parameters.Add("user_id", user_id);
            query.Parameters.Add("end", (byte)1);
            query.Parameters.Add("time", UnixTimeNow());

            return query.Execute(true) > 0;

        }

        public static bool Bet(JObject args)
        {

            Guid game_id = Guid.Parse(args.Value<string>("game_id"));
            Guid user_id = Guid.Parse(args.Value<string>("user_id"));
           

            SQL query = @"

                 IF NOT EXISTS (SELECT * FROM bets WHERE [user_id] = @user_id)
                    BEGIN
                          INSERT INTO [dbo].[bets]([id],[user_id], [current_bet],[game_id],[bets],[time])
                                      VALUES(NEWID(), @user_id, @current_bet,@game_id,@bets, @time)
                    END
                 ELSE
                    BEGIN
                          UPDATE [dbo].[bets] 
                          SET [current_bet] = @current_bet,
                          [bets] = @bets,
                          [time] = @time
                          WHERE [user_id] = @user_id
                    END
              

                
            ";

            query.Parameters.Add("game_id", game_id);
            query.Parameters.Add("user_id", user_id);
            query.Parameters.Add("current_bet", args["coin"] != null ?  args.Value<int>("coin") : 1);
            query.Parameters.Add("bets", args["bets"] != null ? args["bets"].ToString() : "[]");
            query.Parameters.Add("time", UnixTimeNow());
           
            return query.Execute(true) > 0;

        }


        public static bool UpdatePoints(JObject args)
        {

            Guid user_id = Guid.Parse(args.Value<string>("user_id"));
            var data = JsonConvert.DeserializeObject<RootObject>(args.ToString());
            var coin = data.coin;

            SQL query = @"
              
                update users set pointuser=
                (select isnull(pointuser,0)  as pointuser  from users  where id = @user_id)- @coin where  id =  @user_id
                
            ";

            query.Parameters.Add("user_id", user_id);

            query.Parameters.Add("coin", coin);
            return query.Execute(true) > 0;

        }


        public static JObject Find(Nullable<Guid> id)
        {

            SQL query = @"

                UPDATE [dbo].[bets] 
                SET [time] = @time
                WHERE [user_id] = @id

                select g.id, u.name, g.current_bet, g.must_bet
                from games as g
	            left join users as u
	            on g.id = u.id
                where g.id = '07fe02e9-5ba8-4bd1-8f72-b1dd4336418c'
            ";

            int time = UnixTimeNow();

            query.Parameters.Add("id", id);
            query.Parameters.Add("time", time);

            return query.ExecuteQuery<JObject>((reader) => {

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
                        user["current_bet"] = reader.GetInt32(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        user["must_bet"] = reader.GetInt32(3);
                    }

                    return user;

                }

                return null;

            });

        }

        internal static bool Cancelbet(JObject args)
        {
            Guid user_id = Guid.Parse(args.Value<string>("user_id"));
            var data = JsonConvert.DeserializeObject<RootObject>(args.ToString());
            var coin = data.mybets.Sum(x=>x.coin);

            SQL query = @"
              
                update users set pointuser=
                (select isnull(pointuser,0)  as pointuser  from users  where id = @user_id)+ @coin where  id =  @user_id
                
            ";

            query.Parameters.Add("user_id", user_id);

            query.Parameters.Add("coin", coin);
            return query.Execute(true) > 0;
        }

        public static JArray FindGame(Nullable<Guid> id)
        {

            SQL query = @"
                select  u.name,  g.must_bet , b.current_bet, b.bets
                from games as g
                join bets as b
                on g.id = b.game_id
	            join users as u
	            on b.user_id = u.id
                WHERE b.[time] >= @start AND b.[time] <= @end
            ";

            int start = UnixTimeNow() - 60;

            int end = UnixTimeNow() + 60;

            query.Parameters.Add("start", start);
            query.Parameters.Add("end", end);

            return query.ExecuteQuery<JArray>((reader) => {

                JArray list = new JArray();

                while (reader.Read())
                {

                    JObject game = new JObject();

                    if (!reader.IsDBNull(0))
                    {
                        game["name"] = reader.GetString(0);
                    }

                    if (!reader.IsDBNull(1))
                    {
                        game["must_bet"] = reader.GetInt32(1);
                    }
                    if (!reader.IsDBNull(2))
                    {
                        game["current_bet"] = reader.GetInt32(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        game["bets"] = JArray.Parse(reader.GetString(3));
                    }

                    list.Add(game);

                }

                return list;

            });

        }

        internal static void UpdateWiningPoints(int totalamount, string user_id)
        {
            SQL query = @"
                update bets set Winning_point=@totalamount+isnull(Winning_point,0) where user_id=@user_id

            ";
            query.Parameters.Add("totalamount", totalamount);
            query.Parameters.Add("user_id", user_id);
            query.Execute(true);
           
        }
        internal static void TransferWiningPoints(string user_id)
        {
            SQL query = @"
                update users set pointuser= (select Winning_point from  bets where user_id = @user_id)+pointuser where 
                id = @user_id
                
                update bets set Winning_point=0 where user_id=@user_id
                
            ";
            query.Parameters.Add("user_id", user_id);
            query.Execute(true);

        }

        public static JArray List()
        {

            SQL query = @"
                select g.id, u.name, g.current_bet, g.must_bet
                from games as g
	            left join users as u
	            on g.id = u.id
            ";

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
                        user["current_bet"] = reader.GetInt32(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        user["must_bet"] = reader.GetInt32(3);
                    }

                    list.Add(user);


                }

                return list;

            });

        }

        public static int UnixTimeNow()
        {
            return crm.Validator.CurentUnixTime();
        }

        public class Mybet
        {
            public int coin { get; set; }
            public object bet_pos { get; set; }
        }

        public class RootObject
        {
            public string game_id { get; set; }
            public string user_id { get; set; }
            public string coin { get; set; }
            public List<object> bets { get; set; }
            public List<Mybet> mybets { get; set; }
        }

    }
}
