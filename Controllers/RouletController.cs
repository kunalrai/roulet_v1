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
        public ActionResult index()
        {
            return View();
        }

        public ActionResult game() {
          

            return View();

        }

        public ActionResult profile(string userid)
        {
            return View();
        }
    }
}