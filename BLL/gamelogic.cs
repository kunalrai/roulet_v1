using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crm.BLL
{
    public class gamelogic
    {
        public int WiningLogic(int amount,string betposition,int winningNumber)
        {
            int[] num = Array.ConvertAll(betposition.Split(','), int.Parse);
            if (num.Contains(winningNumber))
                return WinningAmount(amount, num.Length);
            else
                return 0;
        }
        private int WinningAmount(int amount,int betposlength)
        {
            return ((amount * 36) / betposlength);
        }
        public string BoardNumberCorespondingValue(string BoardFramgment)
        {

            string value = string.Empty;
            if(BoardFramgment.ToUpper()=="RED")
            {

                value = "1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36";
            }
            else if (BoardFramgment.ToUpper() == "ODD")
            {

                value = "1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35";
            }
            else if (BoardFramgment.ToUpper() == "EVEN")
            {

                value = "2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36";
            }
            else if (BoardFramgment.ToUpper() == "BLACK")
            {

                value = "2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35";
            }
            return value;
        }
    }
}
