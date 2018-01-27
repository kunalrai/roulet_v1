
using Microsoft.Owin;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using System.Web.Security;

namespace crm
{
    public static partial class Logs
    {
        public static Task Log(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if(Validator.GetGuid(args["user_id"]) == null) 
            {
                return ctx.Error(401);
            }

            if (args["coin"] == null)
            {
                return ctx.Error(401);
            }

            if (args["type"] == null)
            {
                return ctx.Error(401);
            }

            if (database.Logs.Log(args))
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

            int start = Validator.CurentUnixTime();

            if(ctx.Parametr("start") != null) {

                start = Convert.ToInt32(ctx.Parametr("start"));
            }

            JArray list = database.Logs.List(start);

            JObject response = new JObject();

            response["data"] = list;

            return ctx.JSON(response);
            
        }

    }
}