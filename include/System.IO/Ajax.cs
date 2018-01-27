using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;

public class Ajax
{
    public static string _Ajax(string host, string path, string method, string data) {

        Exception e; String r = _Ajax(host, path, method, data, out e);

        if (e != null)
        {
            return null;
        }

        if (r == null)
        {
            return String.Empty;
        }

        return r;
    }

    public static string _Ajax(string host, string path, string method, string data, out Exception e, ICredentials credentials = null)
    {
#if DIAGNOSTICS
        Stopwatch timer = new Stopwatch();
#endif        
        String url = host;

        e = null;

        while (url != null && url.EndsWith("/"))
        {
            url = url.Remove(url.Length - 1);
        }

        try
        {

#if DIAGNOSTICS
            timer.Start();
#endif

            if (path != null)
            {
                path = path.Trim();
            }

            if (String.IsNullOrWhiteSpace(path))
            {
                throw new ArgumentNullException(nameof(path));
            }

            while (path != null && path.StartsWith("/"))
            {
                path = path.Remove(0, 1);
            }

            var bytes = data != null ? Encoding.UTF8.GetBytes(data) : null;

            string full_url = url + path;

            var request = (HttpWebRequest)WebRequest.Create(full_url);

            if (credentials != null)
            {
                request.Credentials = credentials;
            }

            request.Method = method;

            //request.ContentType = "application/json";

            if (bytes != null && bytes.Length > 0)
            {
                request.ContentLength = bytes.Length;

                using (var stream = request.GetRequestStream())
                {
                    stream.Write(bytes, 0, bytes.Length);
                }
            }
            else
            {
                request.ContentLength = 0;
            }

            var response = (HttpWebResponse)request.GetResponse();

            try
            {
                using (var stream = response.GetResponseStream())
                {
                    using (var reader = new StreamReader(stream))
                    {

                        data = reader.ReadToEnd();

#if DIAGNOSTICS
#if VERBOSE
                        Console.Out?.WriteLine(url + "/" + path + $" ({timer.ElapsedMilliseconds}ms)");
#endif
#else
#if VERBOSE
                        Console.Out?.WriteLine(url + "/" + path);
#endif
#endif

                        if (data == null)
                        {
                            return String.Empty;
                        }

                        e = null;

                        return data;
                    }
                }
            }
            finally
            {
                response.Dispose();
            }

        }
        catch (Exception innerError)
        {
#if VERBOSE
            Console.Error?.WriteLine(url + "/" + path);
#endif
            e = innerError;

            try
            {
                if (e is WebException)
                {
                    using (Stream stream = ((WebException)e).Response.GetResponseStream())
                    {
                        using (var reader = new StreamReader(stream))
                        {
                            string msg = reader.ReadToEnd();
#if VERBOSE
                            Console.Error?.WriteLine(msg);
#endif
                            if (!string.IsNullOrWhiteSpace(msg)) 
                            {
                                e = new WebException(
                                    msg,
                                    e,
                                    ((WebException)e).Status,
                                    ((WebException)e).Response
                                );
                            }
                        }
                    }
                }
            }
#if VERBOSE
            catch (Exception silentError)
#else
            catch
#endif
            {
#if VERBOSE
                Console.Error?.WriteLine(silentError.ToString());
#endif
            }

            return null;
        }
    }
}