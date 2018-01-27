using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace crm.Controllers
{
    public class FilterController : Controller
    {
        // GET: Filter
        public ActionResult filter()
        {
            ViewBag.state = database.Users.GetStates();
            return View();
        }
    }
}