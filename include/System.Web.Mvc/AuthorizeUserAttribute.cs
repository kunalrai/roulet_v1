﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using Newtonsoft.Json.Linq;
using Auth;

namespace System.Web.Mvc
{
    public class AuthorizeUserAttribute : AuthorizeAttribute
    {
        private string role;

        public string Role { 
            get {
                return role;
             } 
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {

            if (httpContext.Request.Cookies["_Autorize"] == null) {
                return false;
            }

            string jwt = httpContext.Request.Cookies["_Autorize"].Value;

            if (String.IsNullOrEmpty(jwt)) {
                return false;
            }

            Dictionary<string, object> claims = Jwt.Decode(jwt);

            if(claims == null) {
                return false;
            }

            if (Jwt.Check(claims, this.Role, null))
            {


                string[] base_path = httpContext.Request.Url.AbsolutePath.ToString().Split(new char[] { '/' }, StringSplitOptions.RemoveEmptyEntries);

                string controller = String.Empty;
                string action = "";

                if (base_path.Length == 0)
                {
                    controller = "roulet";
                }
                else
                {
                    controller = base_path[0];
                    action = base_path[1];
                }

                object user_access_level;

                if (!claims.TryGetValue("access_level", out user_access_level))
                {
                    return false;
                }

                if ((controller == "roulet") && (Convert.ToInt32(user_access_level) == 0 ||
                     Convert.ToInt32(user_access_level) == 1 ||
                    Convert.ToInt32(user_access_level) == 2))

                {
                    return true;

                }
                else if ((controller == "games") && 
                  (Convert.ToInt32(user_access_level) ==(int)AccessLevel.Admin))
                {

                    return true;

                }
                else if ((controller == "logs") && (Convert.ToInt32(user_access_level) == 3))
                {

                    return true;

                }
                else if ((controller == "users") && (Convert.ToInt32(user_access_level) == 3))
                {

                    return true;

                }

                else if ((controller == "roulet" && action == "managepoints")) {

                   return true;
                }

                else if ((controller == "games" && action == "managepoints"))
                {

                    return true;
                }



                return false;


            }
            

            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectToRouteResult(
                                       new RouteValueDictionary( new {
                                         controller = "users",
                                         action = "login"
                                       })
                                   );
        }
    }
}