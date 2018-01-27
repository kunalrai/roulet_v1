using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace crm
{
    public class gamekedo
    {

        private static readonly Dictionary<string, Dictionary<int,List<int>>> PointTable = new Dictionary<string, Dictionary<int,List<int>>>

        {
            { "1to12", new Dictionary<int, List<int>>{ { 3, new List<int>{ 1, 2, 3,4,5,6,7,8,9,10,11,12 } } } } ,
            { "2to12", new Dictionary<int, List<int>>{ { 3, new List<int>{ 13, 14, 15,16,17,18,19,20,21,22,23,24 } } } } ,
            { "3to12", new Dictionary<int, List<int>>{ { 3, new List<int>{ 25,26,27,28,29,30,31,32,33,34,35,36 } } } } ,
            { "1to2", new Dictionary<int, List<int>>{ { 3, new List<int>{ 3, 6, 9,12,15,18,21,24,27,30,33,36 } } } } ,
            { "2to2", new Dictionary<int, List<int>>{ { 3, new List<int>{ 2, 5, 8,11,14,17,20,23,26,29,32,35 } } } } ,
            { "3to2", new Dictionary<int, List<int>>{ { 3, new List<int>{ 1, 4, 7,10,13,16,19,22,25,28,31,34 } } } } ,
            { "1to18", new Dictionary<int, List<int>>{ { 3, new List<int>{ 1, 2, 3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18 } } } } ,
            { "even", new Dictionary<int, List<int>>{ { 3, new List<int>{  2, 4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36 } } } } ,
            { "odd", new Dictionary<int, List<int>>{ { 3, new List<int>{ 1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35 } } } } ,
            { "red", new Dictionary<int, List<int>>{ { 3, new List<int>{ 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36 } } } } ,
            { "black", new Dictionary<int, List<int>>{ { 3, new List<int>{ 2,4,6, 8,10,11,13,15,17,20,22,24,26,28,29,31,33,35 } } } } ,
            { "19to36", new Dictionary<int, List<int>>{ { 3, new List<int>{ 19,20,21,22,23,24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36 } } } } ,
            
        };

        void Eval(List<Dictionary<string, int>> bet, int winNum)
        {
            foreach (var item in bet)
            {  var key = item.First().Key;
            
                if (key.Split(',').Length == 1)
                {
                    var pointInfo =   PointTable[key];
                    var point = pointInfo.First().Key;
                    var isContainValue = pointInfo.First().Value.Contains(item.First().Value);

                }
                else
                {

                }
            }
           
           //return points;
            return;
        }
    }


}