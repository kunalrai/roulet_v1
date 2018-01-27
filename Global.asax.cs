using System;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Threading;

namespace crm
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            RouletBackground.Instance.Start();

        }

    }


    public class RouletBackground : IRegisteredObject
    {
        public static readonly RouletBackground Instance = new RouletBackground();

        private readonly object _lockObject = new object();

        private bool _started;

        private int current_seconds = 15;

        private BackgroundJobServer _backgroundJobServer;

        private RouletBackground()
        {
        }

        public void Start()
        {
            lock (_lockObject)
            {
                if (_started) return;
                   _started = true;

                HostingEnvironment.RegisterObject(this);

                _backgroundJobServer = new BackgroundJobServer();

                RunSeconds();

            }
        }

        public void Stop()
        {
            lock (_lockObject)
            {
                if (_backgroundJobServer != null)
                {
                    //_backgroundJobServer;
                }

                HostingEnvironment.UnregisterObject(this);
            }
        }

        void IRegisteredObject.Stop(bool immediate)
        {
            Stop();
        }

        public int GetSeconds() {

            return this.current_seconds;

        }

        private void RunSeconds() {

            new Thread(() =>
            {
                while (true)
                {

                    Thread.Sleep(1000);

                    if (current_seconds == 0)
                    {
                        current_seconds = 60;
                    }
                    else
                    {
                        this.current_seconds--;
                    }


                }

            }).Start();

        }
    }
}
