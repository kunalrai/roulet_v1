using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;

namespace Microsoft.Owin
{
    public static partial class OwinContext
    {
        public static String Read(Stream body)
        {
            StreamReader reader = new StreamReader(body);
            try
            {
                return reader.ReadToEnd();
            }
            catch
            {
                throw;
            } finally
            {
                reader.Dispose();
            }
        }

        public static JObject Parse(Stream body)
        {
            StreamReader reader = new StreamReader(body);
            try
            {
                String data = reader.ReadToEnd();

                if (String.IsNullOrWhiteSpace(data))
                {
                    return new JObject();
                }

                return JObject.Parse(data);
            }
            catch
            {
                throw;
            } finally
            {
                reader.Dispose();
            }
        }

        public static JObject Parse(this Microsoft.Owin.IOwinContext ctx)
        {
            return Parse(ctx.Request.Body);
        }

        public static object Parametr(this Microsoft.Owin.IOwinContext ctx, string parametr) {
            try {
                System.Collections.Specialized.NameValueCollection parametrs = HttpUtility.ParseQueryString(ctx.Request.QueryString.ToString());
                foreach(string key in parametrs) {
                    if (key == parametr){
                        return parametrs.Get(parametr);
                    }
                }
                return null;
            }
            catch {
                return null;
            }
        }

        public static Int32 ? ParametrInteger(this Microsoft.Owin.IOwinContext ctx, string parametr)
        {
            try
            {
                System.Collections.Specialized.NameValueCollection parametrs = HttpUtility.ParseQueryString(ctx.Request.QueryString.ToString());
                foreach (string key in parametrs)
                {
                    if (key == parametr)
                    {
                        int i;
                        if (int.TryParse(parametrs.Get(parametr), out i)) {
                            return i;
                        }
                    }
                }
                return  null;
            }
            catch
            {
                return null;
            }
        }

        public static String Read(this Microsoft.Owin.IOwinContext ctx)
        {
            return Read(ctx.Request.Body);
        }

        public static Task NotAuthorized(this Microsoft.Owin.IOwinContext ctx, string message = null)
        {
            ctx.Response.StatusCode = 403;

            if (!string.IsNullOrWhiteSpace(message))
            {
                ctx.Response.Write(message);
            }

            return Task.CompletedTask;
        }

        public static Task NotFound(this Microsoft.Owin.IOwinContext ctx)
        {
            ctx.Response.StatusCode = 404;

            return Task.CompletedTask;
        }

        public static Task Error(this Microsoft.Owin.IOwinContext ctx, Exception e)
        {
            if (e != null)
            {
                System.Log.Error(e.ToString());
            }

            ctx.Response.StatusCode = 500;

            if (e != null)
            {

                return ctx.Response.WriteAsync(
                    e.ToString()
                );
            }

            return Task.CompletedTask;
        }

        public static Task Error(this Microsoft.Owin.IOwinContext ctx, int code, string description)
        {
            ctx.Response.StatusCode = code;

            ctx.Response.Write(description);

            return Task.CompletedTask;
        }

        public static Task OK(this Microsoft.Owin.IOwinContext ctx)
        {
            ctx.Response.StatusCode = 200;

            return Task.CompletedTask;
        }

        public static Task Text(this Microsoft.Owin.IOwinContext ctx, string content)
        {
            ctx.Response.StatusCode = 200;

            ctx.Response.ContentType = "text/plain";

            return ctx.Response.WriteAsync(content);
        }

        public static Task JSON(this Microsoft.Owin.IOwinContext ctx, object content)
        {
            ctx.Response.StatusCode = 200;

            ctx.Response.ContentType = "application/json";

            return ctx.Response.WriteAsync(JsonConvert.SerializeObject(content));
        }

        public static Task Error(this Microsoft.Owin.IOwinContext ctx, int error = 500)
        {
            if (error == 200)
            {
                error = 500;
            }

            ctx.Response.StatusCode = error;

            return Task.CompletedTask;
        }

        public static Task Status(this Microsoft.Owin.IOwinContext ctx, int status)
        {
            ctx.Response.StatusCode = status;

            return Task.CompletedTask;
        }

        public static Task Invalid(this Microsoft.Owin.IOwinContext ctx)
        {
            ctx.Response.StatusCode = 400;

            return Task.CompletedTask;
        }

        public static Task Invalid(this Microsoft.Owin.IOwinContext ctx, string name)
        {
            ctx.Response.StatusCode = 401;

            return ctx.Response.WriteAsync(
                $"Parameter '{name}' is invalid."
            );
        }

        public static Task Missing(this Microsoft.Owin.IOwinContext ctx, string name)
        {
            ctx.Response.StatusCode = 401;

            return ctx.Response.WriteAsync(
                $"Parameter '{name}' is not specified."
            );
        }
    }
}
