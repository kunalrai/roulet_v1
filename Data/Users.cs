using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.Data.SqlClient;
using Newtonsoft.Json.Linq;
using System.Web.Security;
using System.Web.Mvc;

namespace database
{
    public static class Users
    {
        private static  Dictionary<int, string> access_levels;

        private static Dictionary<int, string> Access_Level {
             get {
                   if(access_levels == null) {
                        access_levels = new Dictionary<int, string>();
                        access_levels.Add(3, "Admin");
                        access_levels.Add(2, "Area Manager");
                        access_levels.Add(1, "Main");
                        access_levels.Add(0, "User");
                }
                return access_levels;
             }
        }

        public static Nullable<Guid> Create(JObject args) {

            Guid id = Guid.NewGuid();


            SQL query = @"
              IF NOT EXISTS(SELECT * FROM [dbo].[users] WHERE [email] = @email)
                BEGIN
                   INSERT INTO [dbo].[users](id, name, email, password, access_level, pin, ref, main,PointUser,PhoneNumber,Commision,Address,StateId,DistrictId,datecreated,createdby)
                                      VALUES(@id, @name, @email, @password , @access_level, @pin, @ref, @main,@pointuser,@phonenumber,@commission,@address,@stateid,@districtid,@datecreated,@createdby)
                END
               exec create_ledger @id,@pointuser,0,0,@access_level;
            ";

            query.Parameters.Add("id", id);
            query.Parameters.Add("name", args.Value<string>("name"));
            query.Parameters.Add("email", args.Value<string>("email"));
            query.Parameters.Add("password", args.Value<string>("password"));
            query.Parameters.Add("access_level", args["access_level"] != null ? args.Value<int>("access_level") : 0);
            query.Parameters.Add("ref", args["ref"] != null ? args.Value<string>("ref") : (object)DBNull.Value);
            query.Parameters.Add("main", args["main"] != null ? args.Value<string>("main") : (object)DBNull.Value);


            query.Parameters.Add("pointuser", args["point"] != null ? args.Value<int>("point") : (object)DBNull.Value);
            query.Parameters.Add("phonenumber", args["phone"] != null ? args.Value<string>("phone") : (object)DBNull.Value);
            if (args["commission"] == null || args["commission"].ToString() == "")
            {
                query.Parameters.Add("commission",  (object)DBNull.Value);
            }
            else
            {
                query.Parameters.Add("commission", args["commission"] != null ? args.Value<string>("commission") : (object)DBNull.Value);
            }
            query.Parameters.Add("address", args["address"] != null ? args.Value<string>("address") : (object)DBNull.Value);
            query.Parameters.Add("stateid", args["ddstate"] != null ? args.Value<string>("ddstate") : (object)DBNull.Value);
            query.Parameters.Add("districtid", args["ddldistrict"] != null ? args.Value<string>("ddldistrict") : (object)DBNull.Value);
            query.Parameters.Add("pin", CreatePin());
            query.Parameters.Add("datecreated", DateTime.UtcNow);
            JObject CurrentUser = Authentication.UserFromCookie();
            query.Parameters.Add("createdby", CurrentUser.Value<string>("id"));
            int result = query.Execute(true);

            if (result > 0){
                return id;
            }

            return null;

        }

        public static bool Update(JObject args)
        {

            SQL query = @"
             IF  EXISTS(SELECT * FROM [dbo].[users] WHERE [email] = @email AND [id] = @id)
                BEGIN
                    UPDATE [dbo].[users] 
                    SET [name] = @name
                   ,[email] = @email
                   ,[access_level] = @access_level
                   ,[password] = @password
                   ,[ref] = @ref
                   ,[main] = @main
                   ,pointuser=@pointuser
                   ,phonenumber=@phonenumber
                   ,commision=@commission
                   ,address=@address
                   ,stateid=@stateid
                   ,districtid=@districtid,datecreated = @datecreated,createdby= @createdby
                   WHERE [id] = @id

                END
               
            ";

            query.Parameters.Add("id", Guid.Parse(args.Value<string>("id")));
            query.Parameters.Add("name", args.Value<string>("name"));
            query.Parameters.Add("email", args.Value<string>("email"));
            query.Parameters.Add("access_level", args.Value<int>("access_level"));
            query.Parameters.Add("pin", args.Value<int>("pin"));
            query.Parameters.Add("password", args["password"] != null ? args.Value<string>("password") : (object)DBNull.Value);
            query.Parameters.Add("ref", args["ref"] != null ? args.Value<string>("ref") : (object)DBNull.Value);
            query.Parameters.Add("main", args["main"] != null ? args.Value<string>("main") : (object)DBNull.Value);
            query.Parameters.Add("pointuser", args["point"] != null ? args.Value<string>("point") : (object)DBNull.Value);
            query.Parameters.Add("phonenumber", args["phone"] != null ? args.Value<string>("phone") : (object)DBNull.Value);
            query.Parameters.Add("commission", args["commission"] != null ? args.Value<string>("commission") : (object)DBNull.Value);
            query.Parameters.Add("address", args["address"] != null ? args.Value<string>("address") : (object)DBNull.Value);
            query.Parameters.Add("stateid", args["ddstate"] != null ? args.Value<string>("ddstate") : (object)DBNull.Value);
            query.Parameters.Add("districtid", args["ddldistrict"] != null ? args.Value<string>("ddldistrict") : (object)DBNull.Value);
            query.Parameters.Add("datecreated", DateTime.UtcNow);
            JObject CurrentUser = Authentication.UserFromCookie();
            query.Parameters.Add("createdby", CurrentUser.Value<string>("id"));
            int result = query.Execute(true);

            if (result > 0){
                return true;
            }

            return false;

        }

        public static JObject ResetPin(JObject args)
        {

            string password = CreatePassword();
            int pin = CreatePin();

            SQL query = @"
               UPDATE [dbo].[users] 
               SET [pin] = @pin,
               [password] = @password
               WHERE [id] = @id
            ";

            query.Parameters.Add("id", Guid.Parse(args.Value<string>("id")));
            query.Parameters.Add("password", password);
            query.Parameters.Add("pin", pin);

            int result = query.Execute(true);

            if (result > 0)
            {
                JObject response = new JObject();

                response["password"] = password;
                response["pin"] = pin;

                return response;

            }

            return null;

        }

        public static JObject ChangePassword(JObject args)
        {

            string password = args.Value<string>("newpwd");
            

            SQL query = @"
               UPDATE [dbo].[users] 
               SET [password] = @password
               WHERE [id] = @id
            ";

            query.Parameters.Add("id", Guid.Parse(args.Value<string>("id")));
            query.Parameters.Add("password", password);

            int result = query.Execute(true);

            if (result > 0)
            {
                JObject response = new JObject();

                response["password"] = password;

                return response;

            }

            return null;

        }
        

        public static JObject List(int ? level) {

            SQL query = @"
                SELECT [id]
               ,[name]
               ,[email]
               ,[access_level]
               FROM [dbo].[users]
               WHERE [access_level] = @access_level
                order by [datecreated] desc
            ";

            query.Parameters.Add("access_level", level);

            return  query.ExecuteQuery<JObject>((reader) => {

                JObject usersResponse = new JObject();

                JArray usersList = new JArray();

                while (reader.Read()){

                    JObject user = new JObject();

                    if(!reader.IsDBNull(0)) {
                        user["id"] = reader.GetGuid(0);
                    }

                    if (!reader.IsDBNull(1)){
                        user["name"] = reader.GetString(1);
                    }

                    if (!reader.IsDBNull(2)){
                        user["email"] = reader.GetString(2);
                    }

                    if (!reader.IsDBNull(3)){
                        user["access_level"] = Access_Level[reader.GetInt32(3)];
                    }


                    usersList.Add(user);

                }

                usersResponse["data"] = usersList;

                return usersResponse;

            });
        }



        public static JObject Filter(int? state,int? districtid, int? access_level)
        {

            SQL query = @"
                    SELECT u.[id]
          ,[name]
          ,[email]
          ,[access_level],(Select name from Users  uu where uu.id = u.ref) as ManagerName,
			current_bal,balance_date,
          (Select name from Users  uu where uu.id = u.main) as Main
          FROM [dbo].[users] u

			left join (select * from
			( select   ROW_NUMBER() OVER(PARTITION BY userid ORDER BY balance_date desc) 
				AS Rownum , * from ledger  ) t
				Where 
				rownum =1) l 
			on l.userid = u.id
           where stateid = @state and districtid = @districtid and access_level = @access_level
           order by balance_date desc
            ";

            query.Parameters.Add("state", state);
            query.Parameters.Add("districtid", districtid);
            query.Parameters.Add("access_level", access_level);

            return query.ExecuteQuery<JObject>((reader) => {

                JObject usersResponse = new JObject();

                JArray usersList = new JArray();

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
                        user["email"] = reader.GetString(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        user["access_level"] = Access_Level[reader.GetInt32(3)];
                    }
                    if (!reader.IsDBNull(4))
                    {
                        user["ManagerName"] = reader.GetString(4);
                    }
                    if (!reader.IsDBNull(5))
                    {
                        user["current_bal"] = reader.GetInt32(5);
                    }
                    if (!reader.IsDBNull(7))
                    {
                        user["Main"] = reader.GetString(7);
                    }

                    usersList.Add(user);

                }

                usersResponse["data"] = usersList;

                return usersResponse;

            });
        }

        public static JObject Binded(Guid ? id, int ? level)
        {

            SQL query = @"
                SELECT [id]
               ,[name]
               ,[email]
               ,[access_level]
               FROM [dbo].[users]
               WHERE ([ref] = @id OR [main] = @id) AND ([access_level] = @level)
                order by [name]
            ";

            query.Parameters.Add("id", id);
            query.Parameters.Add("level", level);

            return query.ExecuteQuery<JObject>((reader) => {

                JObject usersResponse = new JObject();

                JArray usersList = new JArray();

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
                        user["email"] = reader.GetString(2);
                    }

                    if (!reader.IsDBNull(3))
                    {
                        user["access_level"] = Access_Level[reader.GetInt32(3)];
                    }


                    usersList.Add(user);

                }

                usersResponse["data"] = usersList;

                return usersResponse;

            });
        }

        public static JObject Find(Nullable<Guid> id)
        {

            SQL query = @"
                SELECT u.[id]
               ,[name]
               ,[email]
               ,[access_level]
               ,[password]
               ,[pin]
               ,[ref]
               ,[main]
               ,[phonenumber]
               ,[commision]
               ,[pointuser]
               ,[address]
               ,[stateid]
               ,[districtid],
               b.Winning_point
               FROM [dbo].[users] u

               left Join Bets b
                on b.user_id = u.id

               WHERE u.[id]=@id
            ";

            query.Parameters.Add("id", id);

            return query.ExecuteQuery<JObject>((reader) => {

                while (reader.Read()){

                    JObject user = new JObject();

                    if (!reader.IsDBNull(0)) { 
                        user["id"] = reader.GetGuid(0);
                    }

                    if (!reader.IsDBNull(1)){
                        user["name"] = reader.GetString(1);
                    }

                    if (!reader.IsDBNull(2)){
                        user["email"] = reader.GetString(2);
                    }

                    if (!reader.IsDBNull(3)){
                        user["access_level"] = reader.GetInt32(3);
                    }

                    if (!reader.IsDBNull(4))
                    {
                        user["password"] = reader.GetString(4);
                    }

                    if (!reader.IsDBNull(5))
                    {
                        user["pin"] = reader.GetInt32(5);
                    }

                    if (!reader.IsDBNull(6))
                    {
                        user["ref"] = reader.GetGuid(6);
                    }

                    if (!reader.IsDBNull(7))
                    {
                        user["main"] = reader.GetGuid(7);
                    }
                    if (!reader.IsDBNull(8))
                    {
                        user["phonenumber"] = reader.GetString(8);
                    }
                    if (!reader.IsDBNull(9))
                    {
                        user["commision"] = reader.GetDecimal(9);
                    }
                    if (!reader.IsDBNull(10))
                    {
                        user["pointuser"] = reader.GetInt32(10);
                    }
                    if (!reader.IsDBNull(11))
                    {
                        user["address"] = reader.GetString(11);
                    }

                    if (!reader.IsDBNull(12))
                    {
                        user["stateid"] = reader.GetInt32(12);
                    }
                    if (!reader.IsDBNull(13))
                    {
                        user["districtid"] = reader.GetInt32(13);
                    }

                    if (!reader.IsDBNull(14))
                    {
                        user["Winning_point"] = reader.GetInt32(14);
                    }


                    return user;

                }

                return null;

            });
        }

        public static JObject FindUser(string email, string password) {

            SQL query = @"
                SELECT [id]
               ,[name]
               ,[email]
               ,[access_level]
               FROM [dbo].[users]
                WHERE [email]=@email AND [password] = @password
            ";

            query.Parameters.Add("email", email);
            query.Parameters.Add("password", password);

            
            return query.ExecuteQuery<JObject>((reader) => {

                while (reader.Read())
                {

                    JObject user = new JObject();

                    if (!reader.IsDBNull(0)){
                        user["id"] = reader.GetGuid(0);
                    }

                    if (!reader.IsDBNull(1)){
                        user["name"] = reader.GetString(1);
                    }

                    if (!reader.IsDBNull(2)){
                        user["email"] = reader.GetString(2);
                    }

                    if (!reader.IsDBNull(3)){
                        user["access_level"] = reader.GetInt32(3);
                    }

                    return user;

                }

                return null;

            });
        }

        public static bool Delete(JObject args)
        {

            SQL query = @"
              DELETE FROM users WHERE id = @id
           
            ";

            query.Parameters.Add("id", Guid.Parse(args.Value<string>("id")));

            int result = query.Execute(true);

            if (result > 0)
            {
                return true;
            }

            return false;

        }

        public static int CreatePin() {

            Random r = new Random();

            var x = r.Next(0, 10000);

            string s = x.ToString("0000");

            return Convert.ToInt32(s);

        }

        public static string CreatePassword()
        {
            string path = System.IO.Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path.Substring(0, 8);
        }

        public static List<SelectListItem> GetStates()
        {
            SQL query = @"
                select state_id ,state_name from states
                order by [state_name]
            ";
          return  query.ExecuteQuery<List<SelectListItem>>((reader) => {
              
                List<SelectListItem> list = new List<SelectListItem>();
                SelectListItem item = new SelectListItem();             
                while (reader.Read())
                {

                    item = new SelectListItem();

                    if (!reader.IsDBNull(0))
                    {
                       item.Value = reader.GetInt32(0).ToString();
                    }

                    if (!reader.IsDBNull(1))
                    {
                        item.Text = reader.GetString(1);
                    }
                    list.Add(item);
                }
              
              return list;
            });
        }

        public static List<SelectListItem> GetDistrictByState(int stateid)
        {
            SQL query = @"
                select districtid,stateid,district from adminchik.district where stateid=@stateid
            ";
            query.Parameters.Add("stateid", stateid);

            return query.ExecuteQuery<List<SelectListItem>>((reader) => {
               
                List<SelectListItem> list = new List<SelectListItem>();
                SelectListItem item = new SelectListItem();
                while (reader.Read())
                {

                    item = new SelectListItem();

                    if (!reader.IsDBNull(0))
                    {
                        item.Value = reader.GetInt32(0).ToString();
                    }

                    if (!reader.IsDBNull(1))
                    {
                        item.Text = reader.GetString(2);
                    }
                    list.Add(item);
                }
               
                return list;
            });
        }


        public static bool CreateLedger(string userid,int credit,int debit,int access_level)
        {
            SQL query = @"exec create_ledger @userid,@credit,@debit,0,@access_level;
                    Update [dbo].[users]
                    set  pointUSer = (select top 1 current_bal from ledger where userid = @userid
                    order by balance_date desc)
                    where id = @userid
                ";
            query.Parameters.Add("userid", userid);
            query.Parameters.Add("credit", credit);
            query.Parameters.Add("debit", debit);
            query.Parameters.Add("access_level", access_level);


            int result = query.Execute(true);

            return true;

        }



    }


}
