using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json.Linq;

namespace crm
{
    public static class Validator
    {
        public static int PAGE_SIZE = 128;
        
        public static Nullable<Guid> GetGuid(object id) {
              if(id == null) {
                return null;
              }
              Guid guid;
              if (Guid.TryParse(id.ToString(), out guid)){
                return guid;
              }
            return null;
        }

        public static Nullable<DateTime> GetDateTime(string dateStr) {
            if (dateStr == null){
                return null;
            }
            DateTime date;
            if (DateTime.TryParse(dateStr.ToString(), out date)){
                return date;
            }
            return null;
        }

        public static String UnixTimeToPacific(int unixTimeStamp) {

            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);

            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();

            DateTime dt = new DateTime(dtDateTime.Ticks, DateTimeKind.Utc);

            return  String.Format("{0:yyyy-MM-dd H:mm}", dt);

        }

        public static String ToPacific(DateTime utc)
        {
            DateTime dt = new DateTime(utc.Ticks, DateTimeKind.Utc);

            dt = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(dt, "Pacific Standard Time");
            return String.Format("{0:yyyy-MM-dd HH:mm}", dt);

        }

        public static Nullable<Decimal> Money(object moneyObj) {
            if (moneyObj == null){
                return null;
            }
            Decimal money;
            if(Decimal.TryParse(moneyObj.ToString(), out  money)) {
               return  money;
            }
            return null;
        }

        public static Int32 CurentUnixTime() {

            return (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;

        }

        public static String LimitedString(object textObj, int length){
            string text = textObj.ToString();
            if(text.Length  <= length) {
                return text;
            }
            return text.Remove(length, (text.Length - length));
        }

        public static bool CreditCardNo(object no) {

            if(no == null) {
                return false;
            }

            string String_no = no.ToString().Trim();

            if(String.IsNullOrEmpty(String_no)) {
                return false;
            }

            if(String_no.Length <= 0) {
                return false;
            }

            if(String_no.IndexOf('*') >= 0) {
                return false;
            }

            return true;

        }

        public static Int32? GetPage(Int32? page)
        {
            if ((page == null)) {
                page = 0;
             }
                        
            if (page < 1) { page = 0; }
            
            page++;
            
            return ((page - 1) * PAGE_SIZE);

        }

    }
}
