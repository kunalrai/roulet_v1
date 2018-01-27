using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;

namespace crm.Controllers
{
    [AuthorizeUser]
    public class gamesController : Controller
    {
        public ActionResult index()
        {
            return View();
        }

        public ActionResult game(Guid id)
        {

            ViewBag.id = id;
            return View();
        }

    }
}