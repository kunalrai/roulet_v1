using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using crm.BLL;

namespace crm.Controllers
{
    [AuthorizeUser]
    public class rouletController : Controller
    {
        // GET: Roulet
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Game() {
          

            return View();

        }

        public ActionResult UserProfile(string userid)
        {
            return View();
        }

        public ActionResult Managepoints(string userid)
        {
            return View();
        }

        public ActionResult ChangePassword(string userid)
        {
            return View();
        }
        public ActionResult ChangePin(string userid)
        {
            return View();
        }
        public ActionResult DrawDetails(string userid)
        {
            return View();
        }
    }
}