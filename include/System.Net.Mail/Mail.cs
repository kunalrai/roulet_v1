using System.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using System.IO;

namespace System.Net.Mail
{
    public static class _Mail
    {
        private static String api_key;
        private static String Api_Key
        {
            get
            {
                if (api_key == null)
                {
                    api_key = ConfigSetting<String>("Send_Grid_Key");
                }
                return api_key;
            }
        }

        private static T ConfigSetting<T>(string key)
        {
            object value = ConfigurationManager.AppSettings[key];
            return (T)Convert.ChangeType(value, typeof(T));
        }

        public static async Task Send(string subjectStr, string body, string toEmail)
        {

            var client = new SendGridClient(Api_Key);
            var from = new EmailAddress("admin@quality-containers.com", "Admin quality-containers");
            var subject = subjectStr;
            var to = new EmailAddress(toEmail);
            var htmlContent = CreateMailHtml(body);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlContent);
            var response = client.SendEmailAsync(msg);


        }

        public static string CreateMailHtml(string body)
        {

            string fileName = System.IO.Path.Combine(
                          Config.RootPath, "Views", "Mail"
                          , "EmailTemplate.html");

            fileName = System.IO.Path.Combine("", fileName);

            FileStream stream = null;
            try
            {
                stream = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.Read);
            }
            catch (FileNotFoundException)
            {
                throw;
            }

            try
            {
                StreamReader reader = new StreamReader(stream);
                try
                {
                    String html = reader.ReadToEnd();
                    return html.Replace("@body", body);
                }
                finally
                {
                    reader.Dispose();
                }
            }
            finally
            {
                stream.Dispose();
            }
        }
    }
}