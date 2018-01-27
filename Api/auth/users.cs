using Microsoft.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using System.Net.Mail;
using crm;
using System.IO;
using System.Web.Mvc;

namespace Auth
{

    public partial class Users
    {
        public static Task List(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            int? level = Convert.ToInt32(ctx.Parametr("level"));

            if (level == null)
            {

                level = 0;

            }

            JObject users = database.Users.List(level);

            return ctx.JSON(users);

        }

        public static Task GetDistrict(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }
            var args = ctx.Parse();

            int stateid = args.Value<Int32>("stateid");


            List<SelectListItem> users = database.Users.GetDistrictByState(stateid);

            return ctx.JSON(users);

        }

        public static Task Binded(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            Guid? id = Validator.GetGuid(ctx.Parametr("id"));

            int? level = Convert.ToInt32(ctx.Parametr("level"));

            JObject users = database.Users.Binded(id, level);

            return ctx.JSON(users);

        }

        public static Task Create(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            Guid? id = database.Users.Create(args);

            if (id != null)
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }


        }

        public static Task Register(IOwinContext ctx)
        {

            var args = ctx.Parse();

            Guid? id = database.Users.Create(args);

            if (id != null)
            {
                return ctx.OK();
            }
            else
            {
                return ctx.Error(400);
            }


        }

        public static Task Update(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["id"]) == null)
            {
                return ctx.Missing("id");
            }

            if (database.Users.Update(args))
            {
                return ctx.OK();
            }

            return ctx.Error();

        }

        public static Task delete(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["id"]) == null)
            {
                return ctx.Missing("id");
            }

            if (database.Users.Delete(args))
            {
                return ctx.OK();
            }

            return ctx.Error();

        }

        public static Task reset(IOwinContext ctx)
        {

            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            var args = ctx.Parse();

            if (Validator.GetGuid(args["id"]) == null)
            {
                return ctx.Missing("id");
            }

            JObject response = database.Users.ResetPin(args);

            if (response != null)
            {
                return ctx.JSON(response);
            }

            return ctx.Error();

        }

        public static string CreatePassword()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path.Substring(0, 8);
        }

        public static Task Filter(IOwinContext ctx)
        {
            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            int? state = Convert.ToInt32(ctx.Parametr("state"));
            int? districtid = Convert.ToInt32(ctx.Parametr("districtid"));
            int? access_level = Convert.ToInt32(ctx.Parametr("access_level"));


            if (state == null)
            {

                state = 0;

            }

            JObject users = database.Users.Filter(state,districtid, access_level);

            return ctx.JSON(users);
        }

        public static Task CreateLedger(IOwinContext ctx)
        {
            if (!Authentication.Check(ctx))
            {
                return ctx.Error(403);
            }

            string userid = Convert.ToString(ctx.Parametr("userid"));
            int credit = Convert.ToInt32(ctx.Parametr("credit"));
            int debit = Convert.ToInt32(ctx.Parametr("debit"));

            var result = database.Users.CreateLedger(userid, credit, debit);


            return ctx.JSON(result);

        }
    }
}