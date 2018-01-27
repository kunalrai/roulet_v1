using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Web;

public class Jwt {
    public const string Secret = "Vie_d_artiste";
    public static String Base64UrlEncode(byte[] data)
    {
        if (data == null)
            throw new ArgumentNullException("data");
        String base64Str = System.Convert.ToBase64String(
data);
        StringBuilder base64Url = new System.Text.StringBuilder();
        for (int i = 0; i < base64Str.Length; i++)
        {
            Char c = base64Str[i];
            switch (c)
            {
                case '+':
                    base64Url.Append('-');
                    break;
                case '/':
                    base64Url.Append('_');
                    break;
                case '=':
                    break;
                default:
                    base64Url.Append(c);
                    break;
            }
        }
        return base64Url.ToString();
    }
    public static String Base64UrlEncode(String data) {
        if (data == null) 
            throw new ArgumentNullException("data");
        return Base64UrlEncode(
System.Text.Encoding.UTF8.GetBytes(data));
    }
    public static String Base64UrlDecode(String base64Url) {
        if (base64Url == null)
            throw new ArgumentNullException("base64Url");
        StringBuilder base64Str = new System.Text.StringBuilder();
        for (int i = 0; i < base64Url.Length; i++) {
            Char c = base64Url[i];
            switch (c) {
                case '-':
                    base64Str.Append('+');
                    break;
                case '_':
                    base64Str.Append('/');
                    break;
                default:
                    base64Str.Append(c);
                    break;
            }
        }
        switch (base64Str.Length % 4) {
            case 0: break;
            case 2: base64Str.Append("=="); break;
            case 3: base64Str.Append("="); break;
            default: throw new ArgumentOutOfRangeException("base64Url");
        }
        return System.Text.Encoding.UTF8.GetString(
            System.Convert.FromBase64String(base64Str.ToString()));
    }
    public static string Serialize(Dictionary<string, object> data)
    {
        if (data == null) {
            throw new ArgumentNullException("data");
        }
        if (data == null)
        {
            data = new Dictionary<string, object>();
        }
        return Base64UrlEncode(global::JWT.JsonWebToken.JsonSerializer.Serialize(data));
    }
    public static Dictionary<string, object> Deserialize(String data)
    {
        if (String.IsNullOrWhiteSpace(data))
        {
            return null;
        }
        return global::JWT.JsonWebToken.JsonSerializer.Deserialize<Dictionary<string, object>>(Base64UrlDecode(data));
    }
    public static string Sign(Dictionary<string, object> data, 
Dictionary<string, object> headers = null, string secret = null) {
        if (secret == null) {
            secret = Secret;
        }
        if (headers == null) { 
            headers = new Dictionary<string, object>(); 
        }
        return Base64UrlEncode(global::JWT.JsonWebToken.Encode(
            headers,
            data,
            secret,
            global::JWT.JwtHashAlgorithm.HS256));
    }
    public static Dictionary<string, object> Decode(string token, string secret = null) {
        if (secret == null) {
            secret = Secret;
        }
        Dictionary<string, object> data = null;
        if (!string.IsNullOrWhiteSpace(token)) {
            try {
                data = (Dictionary<string, object>)global::JWT.JsonWebToken.DecodeToObject(Base64UrlDecode(token), secret, true);
                if (data == null) {
                    data = new Dictionary<string, object>();
                }
            } catch {
                return null;
            }
        }
        return data;
    }
#if AspNet
    public static Dictionary<string, object> Decode(System.Web.HttpContext context, string secret = null) {
        String token = context.Authorization();
        if (token == null) {
            token = context.Request.QueryString.Get(".jwt");
        }
        if (token == null) {
            token = context.Request.Cookies.Get(".jwt")?.Value;
        }
        return Jwt.Decode(token, secret);
    }
#endif
    public static bool InRole(Dictionary<string, object> me, params string[] roles)
    {
        bool bOK = false;
        if (roles != null) {
            foreach (var role in roles) 
            {
                bOK = Check(me, role, null);
                if (bOK) {
                    break;
                }
            }
        }
        return bOK;
    }
    public static bool Check(Dictionary<string, object> claims, string role, string ipAddress) {
        if (claims == null) {
            return false;
        }
        if (role != null)
        {
            Scopes.Role roleDesc = Scopes.IsRole(role);
            if (roleDesc == null)
            {
                throw new ArgumentException("Invalid Role", "role");
            }
            string scope = null;
            if (claims.ContainsKey("scope"))
            {
                if (claims["scope"] != null)
                {
                    scope = claims["scope"].ToString();
                }
            }
            if (string.IsNullOrWhiteSpace(scope)
                    || scope.IndexOf(role) < 0
                    || scope.IndexOf("disabled") >= 0)
            {
                return false;
            }
        }
#if Firewall
        if (ipAddress != null) {
            if (roleDesc.firewall) {
                if (!Firewall.is_IPAddressWhiteListed(ipAddress)) {
                    return false;
                }
            }
        }
#endif
        return true;
    }
    public static Dictionary<string, object> Check(string token,
string role, string ipAddress, string secret = null) {
        Dictionary<string, object> me = Decode(token, secret);
        if (Check(me, role, ipAddress)) {
            return me;
        }
        return null;
    }
#if OWIN
    public static Dictionary<string, object> Check(Microsoft.Owin.IOwinContext context, 
string role, string secret = null) {

        String token = context.Request.Query.Get(".jwt");

        if (token == null) {
            token = context.Request.Headers["Authorization"];
            if (token != null)
            {
                if (token.StartsWith("Bearer"))
                {
                    token = token.Remove(0, "Bearer".Length);
                }

                token = token.Trim();
            }
        }

        return Jwt.Check(token, role, context.Request.RemoteIpAddress, secret);
    }
#endif
#if AspNet
    public static Dictionary<string, object> Check(System.Web.HttpContext context, 
string role, string secret = null) {
        String token = context.Authorization();
        if (token == null) {
            token = context.Request.QueryString.Get(".jwt");
        }
        if (token == null) {
            token = context.Request.Cookies.Get(".jwt")?.Value;
        }
        return Jwt.Check(token, role, context.Request.UserHostAddress, secret);
    }
#endif
}

#if AspNet
namespace System.Web
{
    public static partial class Extensions
    {
        public static bool IsPost(this HttpRequestBase req)
        {
            if (req != null && req.RequestType.ToUpper() == "POST")
            {
                return true;
            }
            return false;
        }
        public static bool IsPost(this HttpContext context)
        {
            if (context != null && context.Request.RequestType.ToUpper() == "POST")
            {
                return true;
            }
            return false;
        }
        public static bool IsOptions(this HttpContext context)
        {
            if (context != null && context.Request.RequestType.ToUpper() == "OPTIONS")
            {
                return true;
            }
            return false;
        }
        public static bool IsOptions(this HttpRequestBase req)
        {
            if (req != null && req.RequestType.ToUpper() == "OPTIONS")
            {
                return true;
            }
            return false;
        }
        public static bool IsGet(this HttpContext context)
        {
            if (context != null && context.Request.RequestType.ToUpper() == "GET")
            {
                return true;
            }
            return false;
        }
        public static bool IsGet(this HttpRequestBase req)
        {
            if (req != null && req.RequestType.ToUpper() == "GET")
            {
                return true;
            }
            return false;
        }
        public static String Authorization(this HttpRequestBase req)
        {
            string[] headers = req.Headers.GetValues("Authorization");
            if (headers != null)
            {
                foreach (string value in headers)
                {
                    if (value != null && value.StartsWith("Bearer"))
                    {
                        return value.Substring("Bearer".Length).Trim();
                    }
                    if (!String.IsNullOrWhiteSpace(value))
                    {
                        return value.Trim();
                    }
                }
            }
            return null;
        }
        public static String Authorization(this HttpContext context)
        {
            return Authorization(new HttpRequestWrapper(context.Request));
        }
        public static String UserHostAddress(this HttpContext context)
        {
            return context.Request.UserHostAddress;
        }
        public static String Param(this HttpContext context, String name)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }
            if (name == null)
            {
                throw new ArgumentNullException("name");
            }
            return context.Request.Params.Get(name);
        }
        public static Newtonsoft.Json.Linq.JObject Parse(this HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }
            HttpRequest req = context.Request;
            if (req.ContentType == "application/x-www-form-urlencoded")
            {
                Newtonsoft.Json.Linq.JObject data = new Newtonsoft.Json.Linq.JObject();

                for (int i = 0; i < req.Form.Count; i++)
                {
                    data[req.Form.Keys[i]] = req.Form[i];
                }

                return data;
            }
            else if (String.Compare("POST", req.HttpMethod, true) == 0)
            {
                IO.StreamReader reader = new IO.StreamReader(req.InputStream);
                try
                {
                    try
                    {
                        string data = reader.ReadToEnd();

                        if (!string.IsNullOrWhiteSpace(data))
                        {
                            return Newtonsoft.Json.Linq.JObject.Parse(data);
                        }

                        return new Newtonsoft.Json.Linq.JObject();
                    }
                    catch
                    {
                        return null;
                    }
                } 
                finally
                {
                    reader.Dispose();
                }
            }
            else
            {
                return new Newtonsoft.Json.Linq.JObject();
            }
        }
    }
}
#endif