using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using Microsoft.Owin;
using Newtonsoft.Json.Linq;

namespace System.Web.Security {
    public static class Authentication
    {
        private const string CookieName = "_Autorize";

        public static bool Login(string userName, string Password, bool isPersistent)
        {

            JObject user = database.Users.FindUser(userName, Password);

            if (user != null)
            {
                CreateCookie(user, isPersistent);
                return true;

            }

            return false;

        }

        private static void CreateCookie(JObject user, bool isPersistent = false)
        {

            Dictionary<string, object> userData = user.ToObject<Dictionary<string, object>>();

            string jwt = Jwt.Sign(userData);

            HttpCookie cookie = new HttpCookie(CookieName, jwt);

            cookie.Expires = DateTime.UtcNow.AddMonths(1);

            HttpContext.Current.Response.Cookies.Add(cookie);


        }

        public static JObject UserFromCookie(){
      
           if (HttpContext.Current.Request.Cookies["_Autorize"] != null) {
               JObject user = new JObject();
               string cookie = HttpContext.Current.Request.Cookies["_Autorize"].Value;
               if (String.IsNullOrEmpty(cookie)){
                  return null;
               }
               Dictionary<string, object> claims = Jwt.Decode(cookie);
               object id;
               if (claims.TryGetValue("id", out id)){
                  user["id"] = id.ToString();
               }
               object name;
               if (claims.TryGetValue("name", out name)){
                  user["name"] = name.ToString();
               }
               object access_level;
               if (claims.TryGetValue("access_level", out access_level)){
                  user["access_level"] = Convert.ToInt32(access_level);
               }
              return user;
           }
           return null;
        }

        public static Guid CurrentUserId() {
             string cookie = HttpContext.Current.Request.Cookies["_Autorize"].Value;
             Dictionary<string, object> claims = Jwt.Decode(cookie);
             object id;
             if (claims.TryGetValue("id", out id)){
                return Guid.Parse(id.ToString());
             }
            return Guid.NewGuid();
        }

        public static void LogOut(){

            var httpCookie = HttpContext.Current.Response.Cookies[CookieName];

            if (httpCookie != null){

                httpCookie.Value = string.Empty;
            }

        }

        public static bool Check(IOwinContext ctx){

            if (ctx.Request.Headers["_Autorize"] != null)
            {
                string[] base_path = ctx.Request.PathBase.ToString().Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);
                if (base_path.Length < 2)
                {
                    return false;
                }
                string jwt = ctx.Request.Headers["_Autorize"].ToString();
                if (String.IsNullOrEmpty(jwt))
                {
                    return false;
                }
                Dictionary<string, object> claims = Jwt.Decode(jwt);
                if (claims == null)
                {
                    return false;
                }
                if (Jwt.Check(claims, null, null))
                {

                    return true;
                    
                }
            }
            return true;
        }
    }


}
  
