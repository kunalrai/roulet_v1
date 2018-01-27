
using crm.BLL;
using Microsoft.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Security;
using System.Linq;
using System.Threading;

namespace crm
{
    public static partial class Games
    {
        public static Task Start(IOwinContext ctx)
        {
            t.Change(0, 1000 * 60 * 1);

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();


            if (database.Games.Start(args))
            {

                JObject response = new JObject();

                response["seconds"] = crm.RouletBackground.Instance.GetSeconds();

                response["time"] = Validator.CurentUnixTime();

                return ctx.JSON(response);

            }
            else
            {
                return ctx.Error(400);
            }

           
                

        }

        public static Task End(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["user_id"]) == null)
            {
                return ctx.Error(401);
            }

            if (database.Games.End(args))
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }

        }

        public static Task Find(IOwinContext ctx) {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            Guid? id = Validator.GetGuid(args["id"]);

            JObject game = database.Games.Find(id);

            return ctx.JSON(game);

        }

        public static Task FindInfo(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            Guid? id = Validator.GetGuid(args["id"]);

            JArray game = database.Games.FindGame(id);

            JObject response = new JObject();

            response["data"] = game;

            response["seconds"] = crm.RouletBackground.Instance.GetSeconds();

            response["time"] = Validator.CurentUnixTime();

            return ctx.JSON(response);

        }

        public static Task Update(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (args["must_bet"] == null)
            {
                return ctx.Error(401);
            }

            if (database.Games.Update(args))
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }

        }

        public static Task Bet(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["game_id"]) == null)
            {
                return ctx.Error(401);
            }

            if (Validator.GetGuid(args["user_id"]) == null)
            {
                return ctx.Error(401);
            }


            if (args["coin"] == null)
            {
                return ctx.Error(401);
            }

          
            if (database.Games.Bet(args))
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }

        }

        public static Task UpdatePoints(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["game_id"]) == null)
            {
                return ctx.Error(401);
            }

            if (Validator.GetGuid(args["user_id"]) == null)
            {
                return ctx.Error(401);
            }


            if (args["coin"] == null)
            {
                return ctx.Error(401);
            }


            if (database.Games.UpdatePoints(args))
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }

        }

        public static Task CancelBet(IOwinContext ctx)
        {
            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["game_id"]) == null)
            {
                return ctx.Error(401);
            }

            if (Validator.GetGuid(args["user_id"]) == null)
            {
                return ctx.Error(401);
            }


            if (args["coin"] == null)
            {
                return ctx.Error(401);
            }


            if (database.Games.Cancelbet(args))
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }
        }

        public static Task List(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            JArray games = database.Games.List();

            return ctx.JSON(games);

        }

        public static Task Get(IOwinContext ctx)
        {

            //if (!Authentication.Check(ctx))
            //{
            //    return ctx.Error(403);
            //}
            var args = ctx.Parse();
            if (Validator.GetGuid(args["id"]) == null)
            {
                return ctx.Error(401);
            }

            var userid = Guid.Parse(args["id"].ToString());


            JObject user = database.Users.Find(userid);

            return ctx.JSON(user);

        }

        public static Task SpinRoulette(IOwinContext ctx)
        {

            //if (!Authentication.Check(ctx))
            //{
            //    return ctx.Error(403);
            //}
            var args = ctx.Parse();
            gamelogic bll = new gamelogic();
            var data = JsonConvert.DeserializeObject<RootObject>(args.ToString());

            int amount = data.must_bet;
            int totalamount = 0;
            int betamount = 0;

            foreach (var item in data.myArray)
            {
                string bet = item.bet_pos.ToString();
                if(item.bet_pos.GetType() == typeof(JArray))
                {
                     bet =   String.Join(",", ((JArray)item.bet_pos).Select(x => (string)x));
                }
                

                betamount = betamount + item.coin;
                totalamount = totalamount + bll.WiningLogic(item.coin, bet, data.must_bet);


            }

            var userid = args["userid"].ToString();

            database.Games.UpdateWiningPoints(totalamount,userid);
            return ctx.JSON(totalamount);

        }

        public static Task TransferWinningPoints(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }
            var args = ctx.Parse();
            var userid = args["user_id"].ToString();
            

           
            database.Games.TransferWiningPoints(userid);
            return ctx.JSON(true);

        }

        public class MyArray
        {
            public int coin { get; set; }
            public object bet_pos { get; set; }
        }

        public class RootObject
        {
            public List<MyArray> myArray { get; set; }
            public int must_bet { get; set; }
            public string userid { get; set; }
        }


        private static Timer t = new Timer(RandonUpdate);

        
        private static readonly Random getrandom = new Random();
        private static readonly object syncLock = new object();
        public static void RandonUpdate(object state)
        {
            lock (syncLock)
            { // synchronize
                int must_bet = getrandom.Next(-1, 36);
                database.Games.RandomUpdate(must_bet);
            }
            
        }
    }
}