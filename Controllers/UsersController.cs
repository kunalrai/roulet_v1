using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Newtonsoft.Json.Linq;
//using crm.Models;

namespace crm.Controllers
{
    [AuthorizeUser]
    public class UsersController : Controller
    {

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(string username, string password, byte remember = 0)
        {
            bool persistent = remember != 0;

            if (Authentication.Login(username, password, persistent)) {

                JObject user = database.Users.FindUser(username, password);

                if (user.Value<Int32>("access_level") == 0) {

                    return  Redirect(Url.Content("~/roulet/index"));

                }

                return Redirect(Url.Content("~/games/index"));

            }

            ViewBag.error = "Login Erorr";
            ViewBag.username = username;
            ViewBag.password = password;

            return View();
        }

        [AllowAnonymous]
        public ActionResult register()
        {
            return View();
        }

        public ActionResult logout() {

            Authentication.LogOut();
          
            return RedirectToAction("login");

        }

        public ActionResult all() {

            return View();

        }

       
        public ActionResult _update(Guid? id = null) {
            
            if(Validator.GetGuid(id) != null) {

                ViewBag.id = id;

                JObject user = database.Users.Find(id);

                if (user["name"] != null){
                    ViewBag.name = user["name"];
                }

                if (user["email"] != null){
                    ViewBag.email = user["email"];
                }

                if (user["access_level"] != null){
                    ViewBag.access_level = user["access_level"];
                }

                if (user["password"] != null){
                    ViewBag.password = user["password"];
                }

                if (user["pin"] != null)
                {
                    ViewBag.pin = user["pin"];
                }



                if (user["phonenumber"] != null)
                {
                    ViewBag.phone = user["phonenumber"];
                }
                if (user["commision"] != null)
                {
                    ViewBag.commission = user["commision"];
                }
                if (user["pointuser"] != null)
                {
                    ViewBag.point = user["pointuser"];
                }
                if (user["address"] != null)
                {
                    ViewBag.address = user["address"];
                }
                if (user["stateid"] != null)
                {
                    ViewBag.stateid = user["stateid"];
                }
                if (user["districtid"] != null)
                {
                    ViewBag.districtid = user["districtid"];
                }

                ViewBag.state = database.Users.GetStates();
            }

            return View("add");
        }

        public ActionResult _update_main(Guid? id = null)
        {

            if (Validator.GetGuid(id) != null)
            {

                ViewBag.id = id;

                JObject user = database.Users.Find(id);

                if (user["name"] != null)
                {
                    ViewBag.name = user["name"];
                }

                if (user["email"] != null)
                {
                    ViewBag.email = user["email"];
                }

                if (user["access_level"] != null)
                {
                    ViewBag.access_level = user["access_level"];
                }

                if (user["password"] != null)
                {
                    ViewBag.password = user["password"];
                }

                if (user["pin"] != null)
                {
                    ViewBag.pin = user["pin"];
                }

                if (user["ref"] != null)
                {
                    ViewBag.manager = user["ref"];
                }

                if (user["main"] != null)
                {
                    ViewBag.main = user["main"];
                }

                if (user["phonenumber"] != null)
                {
                    ViewBag.phone = user["phonenumber"];
                }
                if (user["commision"] != null)
                {
                    ViewBag.commission = user["commision"];
                }
                if (user["pointuser"] != null)
                {
                    ViewBag.point = user["pointuser"];
                }
                if (user["address"] != null)
                {
                    ViewBag.address = user["address"];
                }
                if (user["stateid"] != null)
                {
                    ViewBag.stateid = user["stateid"];
                }
                if (user["districtid"] != null)
                {
                    ViewBag.districtid = user["districtid"];
                }

                ViewBag.state = database.Users.GetStates();

            }

            return View("add");
        }


        public ActionResult _update_user(Guid? id = null)
        {

            if (Validator.GetGuid(id) != null)
            {

                ViewBag.id = id;

                JObject user = database.Users.Find(id);

                if (user["name"] != null)
                {
                    ViewBag.name = user["name"];
                }

                if (user["email"] != null)
                {
                    ViewBag.email = user["email"];
                }

                if (user["access_level"] != null)
                {
                    ViewBag.access_level = user["access_level"];
                }

                if (user["password"] != null)
                {
                    ViewBag.password = user["password"];
                }

                if (user["pin"] != null)
                {
                    ViewBag.pin = user["pin"];
                }

                if (user["ref"] != null)
                {
                    ViewBag.manager = user["ref"];
                }

                if (user["main"] != null)
                {
                    ViewBag.main = user["main"];
                }


                if (user["phonenumber"] != null)
                {
                    ViewBag.phone = user["phonenumber"];
                }
                if (user["commision"] != null)
                {
                    ViewBag.commission = user["commision"];
                }
                if (user["pointuser"] != null)
                {
                    ViewBag.point = user["pointuser"];
                }
                if (user["address"] != null)
                {
                    ViewBag.address = user["address"];
                }
                if (user["stateid"] != null)
                {
                    ViewBag.stateid = user["stateid"];
                }
                if (user["districtid"] != null)
                {
                    ViewBag.districtid = user["districtid"];
                }

                ViewBag.state = database.Users.GetStates();
            }

            return View("add");
        }

        public ActionResult _add(int ? access)
        {

            ViewBag.access = access;
            if(access==0)
            {
                ViewBag.email = "us" + DoWork();
            }

            if (access == 1)
            {
                ViewBag.email = "mn" + DoWork();
            }

            if (access == 2)
            {
                ViewBag.email = "am" + DoWork();
            }

            ViewBag.password = GenRatePassword();
            ViewBag.state = database.Users.GetStates();

            return View("add");
        }
        private static string _numbers = "0123456789";
        Random random = new Random();


        private int DoWork()
        {
            StringBuilder builder = new StringBuilder(6);
            string numberAsString = "";
            int numberAsNumber = 0;
            for (var i = 0; i < 6; i++)
            {
                builder.Append(_numbers[random.Next(0, _numbers.Length)]);
            }
            numberAsString = builder.ToString();
            numberAsNumber = int.Parse(numberAsString);
            return numberAsNumber;
        }
        private int GenRatePassword()
        {
            StringBuilder builder = new StringBuilder(5);
            string numberAsString = "";
            int numberAsNumber = 0;
            for (var i = 0; i < 5; i++)
            {
                builder.Append(_numbers[random.Next(0, _numbers.Length)]);
            }
            numberAsString = builder.ToString();
            numberAsNumber = int.Parse(numberAsString);
            return numberAsNumber;
        }

        public static string CreatePassword()
        {
            string path = System.IO.Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path.Substring(0, 8);
        }

        public ActionResult forgot() {
            return View();
        }

        public ActionResult _binded(Guid? id, int  level) {

            if(id != null) {

                ViewBag.id = id;

                ViewBag.level = level;

            }

            return View("binded");

        }

        public int GetRandomDigit()
        {
            Random random = new Random(6);
            return random.Next();
        }

       
        
    }
}
