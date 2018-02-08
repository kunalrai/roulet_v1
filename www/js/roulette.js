$.messages = {
    straight: "This is Straight bet can Win points = Bet X 36",
    rect: "This Rectangle can Win Points = Bet X 18",
    group_cube: "This Square bet can Win points = Bet X 6",
    four_square: "This Rectangle can Win Points = Bet X 9",
    cube: "This cube bet can Win points = Bet X 3",
    even: "This is Even bet can Win Points = Bet X 2",
    odd: "This is Odd bet can Win Points = Bet X 2",
    black: "This is Black bet can Win Points = Bet X 2",
    red: "This is Red bet can Win Points = Bet X 2",
    one_by_two: "This group bet can Win points = Bet X 2",
    one_to_twelve: "This is cube bet can Win Points = Bet X 3",
    row: "This row can Win Points = Bet x 3",
    bet_time_over: "Bet time Over",
    three_square: "This box bet can Win Points = Bet X 12",
    hasenoughpoints: "Score Insufficient",
    asktoplacebet: "Place Bet to start game .Minimum Bet =1",
    wingame: "Congratulations!!! You Win",
    whenrouletterolling: "FOR AMUSEMENT ONLY NO CASH VALUE",
    makebet: "You can either make Bet or Press BETOK Button",
    betaccepted: "Your Bet Has Been Accepted",
    loosegame:"Game Over. Press PreBetOK Button or Make Bet"

}
$.Game = {
    bets: [],

    busy: false,

    prevbet: [],

    mybets: [],

    find: function () {

        var user_id = $("#user_id").val();

        var data = {
            id: user_id
        }

        if (!$.Game.busy) {

            $.Game.busy = true;

            $.ajax({
                type: "POST",
                url: "/games/find/",
                data: JSON.stringify(data),
                success: function (response) {

                    $.Game.busy = false;

                    if (response.must_bet) {

                        $.Roulet.must = response.must_bet;

                        $.Game.init();

                    }

                }
            }).always(function () { $.User.TotalBet(); });

        }


    },

    init: function () {

        var user_id = $("#user_id").val();
        var data = {
            id: user_id
        }

        return $.ajax({
            type: "POST",
            url: "/user/get/",
            data: JSON.stringify(data),
            success: function (response) {
                if (response) {

                    //console.log(response.pointuser);

                    $("#pointuser").text(response.pointuser + ".00");

                    $("#win_score").text(response.Winning_point);

                    if (response.Winning_point && response.Winning_point > 0) {

                        $.User.wincurrentgame = true;

                       
                    }

                   
                }

            }
        });

    },
    calcultepoints: function (must_bet) {


        var user_id = $("#user_id").val();
        $.ajax({
            type: "POST",
            url: "/user/spinroulette/",
            contentType: 'application/json',
            data: JSON.stringify({
                'myArray': $.Game.mybets,
                "must_bet": must_bet,
                "userid": user_id
            })
            
            

        })
            .done(function (response) {

                if (response) {
                    console.log(response);

                    if (Number(response) > 0) {

                        $.User.wincurrentgame = true;

                        $(".betguide").text($.messages.wingame);

                        $.Roulet.winnersound();

                    }


                    $("#win_score").text(response);
                } else if ($.Game.mybets.length > 0){

                    $.User.loosegame = true;

                    $(".betguide").text($.messages.loosegame);

                    $.Roulet.loosesound();

                    $.User.wincurrentgame = false;

                }

            })
            .fail((status, err) => { console.log(status); })
            .always(function () {

            if ($.Game.mybets.length> 0){

                $.Game.prevbet = $.Game.mybets;

            }

            $.User.reset();

            $.Game.mybets = [];
        });
    },

    subscribe: function () {
        setInterval(function () {

            $.Game.find();

            clearInterval($.removetakeinterval);
            
            if (Number($("#win_score").text()) != 0) {

                $.User.wincurrentgame = true;

                $.removetakeinterval = setInterval($.TakeBlinkFunction, $.ui.duration);
            }

        }, 5000)
    },

    start: function () {

        var game_id = $("#game_id").val();
        var user_id = $("#user_id").val();

        var data = {
            game_id: game_id,
            user_id: user_id
        }

        $.ajax({
            type: "POST",
            url: "/games/start/",
            data: JSON.stringify(data),
            success: function (response) {

                $.Game.subscribe();

                var now = new Date();

                var unix = Math.round(+new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()) / 1000);

                if ((unix - response.time) > 1000) {

                    var difference = (unix - response.time) / 1000;

                    var seconds = response.seconds;

                    var startSeconds = seconds - difference;

                    $.Roulet.FirstRun(startSeconds);

                }
                else {

                    $.Roulet.FirstRun(response.seconds);

                }

            }
        });
    },

    Bet: function (bet) {

        $.Game.bets.push(bet);

    },

    MyBet: function (bet) {

        var data = {
            coin: $.Roulet.bet,
            bet_pos: bet
        }

        $.Game.mybets.push(data);
    },

    isExist: function (id) {

        var hidden_bets = $.Game.bets;

        if (hidden_bets.length > 0) {

            for (var i = 0; i < hidden_bets.length; i++) {

                if (id == hidden_bets[i]) {

                    return true;
                }

            }

        }

        return false;
    },

    RemoveBet: function (id) {

        var hidden_bets = $.Game.bets;

        if (hidden_bets.length > 0) {

            for (var i = 0; i < hidden_bets.length; i++) {

                if (id == hidden_bets[i]) {

                    hidden_bets.splice(i, 1);
                }

            }

        }

        $.Game.bets = hidden_bets;

        /* MYBETs remove */

    },

    RemoveMyBet: function (id) {
        var hidden_bets = $.Game.mybets;
        if (hidden_bets.length > 0) {

            for (var i = 0; i < hidden_bets.length; i++) {

                if (id == hidden_bets[i]) {

                    hidden_bets.splice(i, 1);
                }

            }

        }
        $.Game.mybets = hidden_bets;

    },

    TransferWinningPoints: function () {
        var game_id = $("#game_id").val();

        var user_id = $("#user_id").val();

        var data = {

            game_id: game_id,

            user_id: user_id,
        }

        $.ajax({
            type: "POST",
            url: "/user/transferwinningpoints/",
            data: JSON.stringify(data)
        }).
            always(function () {

                $.Game.find();

        });
    }


}

$.User = {
    IsPrevBetBtn: false,

    wincurrentgame: false,

    betaccepted:false,

    canBet: true,

    loosegame : false,

    reset: function () {

        this.betaccepted = false;

        this.IsPrevBetBtn = false;

        

        this.canBet = true;

        this.loosegame = false

    },

    usercanbet: function (bet) {

        if ($.User.canBet 
            && this.userhasEnoughPoints(bet) && !$.User.wincurrentgame && !$.User.betaccepted) {

            $.ui.blinkbetokbtn();

            return true;
        }
        else {

            return false;
        }


    },

   

    Bet: function () {

        var game_id = $("#game_id").val();
        var user_id = $("#user_id").val();

        var data = {
            game_id: game_id,
            user_id: user_id,
            coin: $.Roulet.bet,
            bets: $.Game.bets,
            mybets: $.Game.mybets
        }

        $.ajax({
            type: "POST",
            url: "/games/bet/",
            data: JSON.stringify(data)
        });
        $.ajax({
            type: "POST",
            url: "/games/updatepoints/",
            data: JSON.stringify(data),

        }).always(function () {

            $.Game.find();
        });
        this.TotalBet();
    },

    CancelBet: function (betsvalue) {
        var game_id = $("#game_id").val();
        var user_id = $("#user_id").val();

        var data = {
            game_id: game_id,
            user_id: user_id,
            coin: $.Roulet.bet,
            bets: $.Game.bets,
            mybets: betsvalue// $.Game.mybets
        }

        $.ajax({
            type: "POST",
            url: "/games/cancelbet/",
            data: JSON.stringify(data),

        }).always(function () {

            $.Game.find();
        });
    },

    TotalBet: function () {
        try {
            var sum = 0;
            $.Game.mybets.forEach((x) => sum = sum + Number(x.coin));
            $(".total_bet").text(sum);
        }
        catch (e) {
            $(".total_bet").text(0);
        }

    },

    userhasEnoughPoints:function (bet) {

    var bal = $("#pointuser").text();

    var balSufficient = Number(bal) >= Number(bet);

    if (!balSufficient) {

        $(".betguide").text($.messages.hasenoughpoints);
    }

    return balSufficient;
}
}

$(window).bind("beforeunload", function () {

    var answer = confirm("Do you really want to close?");

    if (answer) {


        var user_id = $("#user_id").val();

        var data = {
            user_id: user_id
        }

        $.ajax({
            type: "POST",
            url: "/games/end/",
            data: JSON.stringify(data),
            success: function (response) {



            }
        });


    }


});

$.count = 0;

$.TakeBlinkFunction = function () {

    var winscore = Number($("#win_score").text());

    if (winscore > 0) {

        $.ui.takecount++;

        $.ui.blink("takebtn", "take", "takea", $.ui.takecount);

    }

}

$.ui = {
    duration: 400,

    timercount: 0,

    takecount: 0,

    timerbetok:0,

    timerInterval: 0,

    betokInterval : 0,

    isrunning: false,

    isbetokblinking:false,

    cancelspecificbet: $("#cancelspecificbet"),

    betok: $("#betok"),

    

    onprevbetclick: function () {


        $.User.IsPrevBetBtn = false;

        $.ui.betok.text("Bet Ok");

        var arr = [];

        var sumofcoins = 0;

        $.Game.prevbet.map((value, index, obj) => {

            var data = undefined;
           

            arr.map((v, i, o) => {

                if (v.bet_pos == value.bet_pos) {

                    data = v;

                    data.bet_pos = value.bet_pos;

                    data.coin = Number(data.coin) + Number(value.coin);

                   

                    arr[i] = data;
                }
            });

            if (data == undefined) {

                sumofcoins = sumofcoins + Number(value.coin);

                arr.push(value);
            }
            

        });

        if (!$.User.userhasEnoughPoints(sumofcoins)) {

            console.log("sum of coins: " + sumofcoins);
            $.Game.prevbet = [];
            return;
        }

        arr.map((value, index, obj) => {
            if (Array.isArray(value.bet_pos)) {
               
                if (value.bet_pos.length == 2) {

                    $.Roulet.bet = value.coin;

                    var square = $(".square[data-val='[" + value.bet_pos + "]']");

                    square.trigger("click");

                }
                else if (value.bet_pos.length == 3 || value.bet_pos.length == 4) {

                    $.Roulet.bet = value.coin;

                    var cube = $(".cube[data-val='[" + value.bet_pos + "]']");

                    cube.trigger("click");

                }
                else if (value.bet_pos.length == 6 ) {

                    $.Roulet.bet = value.coin;

                    var group_cube = $(".group_cube[data-val='[" + value.bet_pos + "]']");

                    group_cube.trigger("click");

                } else {

                    var keypadbtn = $(".keypad-button[data-val='[" + value.bet_pos + "]']");

                    $.Roulet.bet = value.coin;

                    keypadbtn.trigger("click");

                }

            }
            else {

                var keypadbtn = $(".keypad-button[data-id='" + value.bet_pos + "']");

                $.Roulet.bet = value.coin;

                keypadbtn.trigger("click");

            }
        });

        $.Roulet.bet = $('.coin.coin-active button').val();
    },

    onbetok: function () {

        if ($.User.IsPrevBetBtn) {

            $.ui.onprevbetclick();

        }

        else {

            $.ui.cleartimerbetok();
            if ($.Game.mybets.length > 0) {

                $.User.betaccepted = true;
            }

            this.isbetokblinking = false;

        }
        
    },

    blinkbetokbtn: function () {

        if (!this.isbetokblinking) {

            this.isbetokblinking = true;

            this.betokInterval = setInterval(() => { this.timerbetok++; $.ui.blink("betok", "bet", "beta", this.timerbetok); }, this.duration);

            $.User.betaccepted = false;
        }

    },

    cleartimerbetok: function () {

        clearInterval(this.betokInterval);

        this.isbetokblinking = false;

        $.User.betaccepted = false;

        this.timerbetok = 0;

        $.ui.blink("betok", "beta", "bet", this.timerbetok); 

      
    },

    blinktimer: function () {

        if (!this.isrunning) {

            this.isrunning = true;

            this.timerInterval = setInterval(() => { this.timercount++; $.ui.blink("timer", "timer", "timera", this.timercount) }, $.ui.duration);

        }
    },

    cleartimerblink: function () {

        if (this.isrunning) {

            this.timercount = 0;

            $.ui.blink("timer", "timera", "timer", this.timercount)

            clearInterval(this.timerInterval);

            this.isrunning = false;
        }

    },

    blink: function (el, normal, hovered, timercount) {

        var btn = $("#" + el);

        if (timercount % 2 == 0) {

            btn.removeClass(normal);

            btn.addClass(hovered);
        }

        else {

            btn.removeClass(hovered);

            btn.addClass(normal);
        }
        
    },

    oncancelspecificbet: function () {
        
        var data = $.Game.mybets.splice(-1, 1);

        if ($.Game.mybets.length == 0) {

            $.ui.cleartimerbetok();

        }

        if (data[0]) {

            $(".bets[data-val='" + data[0].bet_pos + "']").remove();

            $(".bets[data-val='[" + data[0].bet_pos + "]']").remove();

            $.User.CancelBet(data);

            

        }
    },

    attachevents: function () {

        this.cancelspecificbet.click(this.oncancelspecificbet);

        this.betok.click(this.onbetok);
    }
};

$(document).ready(function () {

    $.Roulet.loadingsound();

    var user_id = $("#user_id").val();

    var betsHTML = function (left, top, value, coin) { return "<div class='bets' style='left:" + left + ";top:" + top + "px;' data-val='[" + value + "]'>" + coin + "</div>"; }

    $.Game.start();

    $.Roulet.init();

    $.Game.init();


    $.fn.maphilight.defaults = {
        fill: true,
        fillColor: '00a900',
        fillOpacity: 1,
        stroke: true,
        strokeColor: '00a900',
        strokeOpacity: 1,
        strokeWidth: 0,
        fade: true,
        alwaysOn: false,
        neverOn: false,
        groupBy: false,
        wrapClass: true,
        shadow: false,
        shadowX: 0,
        shadowY: 0,
        shadowRadius: 6,
        shadowColor: '000000',
        shadowOpacity: 0.8,
        shadowPosition: 'outside',
        shadowFrom: false
    }

    var allAreas = $("#keypad").children();

    $(".keypad").maphilight();

    $(".keypad-button").mouseover(function (event) {

        var area = $(this).attr("data-id")

        $("#" + area).mouseover()
        $(".betguide").text("This is Straight Bet Win Points = Bet x 36");
    });

    $(".keypad-button").mouseout(function (event) {

        var area = $(this).attr("data-id")

        $("#" + area).mouseout()

        $(".betguide").text("");
    });

    $(".betthreesare").mouseover((e) => $(".betguide").text($.messages.cube));



    $("#red").mouseover(function (event) {

        var area = [11, 13, 14, 16, 17, 19, 20, 22, 25, 28, 31, 34, 37, 39, 42, 43, 45, 48];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }


    });


    $(".red").mouseover((e) => $(".betguide").text($.messages.red));

    $(".black").mouseover((e) => $(".betguide").text($.messages.black));

    $(".even").mouseover((e) => $(".betguide").text($.messages.even));

    $(".odd").mouseover((e) => $(".betguide").text($.messages.odd));

    $(".bettwosare").mouseover((e) => $(".betguide").text($.messages.one_by_two));

    $(".cube").mouseover((e) => $(".betguide").text($.messages.cube));

    $(".four_square").mouseover((e) => $(".betguide").text($.messages.four_square));

    $(".group-cube").mouseover((e) => $(".betguide").text($.messages.group_cube));

    $(".three_square").mouseover((e) => $(".betguide").text($.messages.three_square));



    $("#black").mouseover(function (event) {

        var area = [12, 15, 18, 21, 24, 26, 27, 29, 30, 32, 33, 35, 38, 40, 41, 44, 46, 47];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }


    });

    $("#row_1_max").mouseover(function (event) {

        var area = [11, 12, 13, 14, , 15, 16, 17, 18, 19, 20, 21, 22];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();
        }



    });

    $("#row_2_max").mouseover(function (event) {

        var area = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }

    });

    $("#row_3_max").mouseover(function (event) {

        var area = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#one_to_twelve").mouseover(function (event) {

        var area = [11, 12, 13, 14, 24, 25, 26, 27, 37, 38, 39, 40];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#two_to_twelve").mouseover(function (event) {

        var area = [15, 16, 17, 18, 28, 29, 30, 31, 41, 42, 43, 44];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#three_to_twelve").mouseover(function (event) {

        var area = [19, 20, 21, 22, 32, 33, 34, 35, 45, 46, 47, 48];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#one_to_eighteen").mouseover(function (event) {

        var area = [11, 12, 13, 14, 15, 16, 24, 25, 26, 27, 28, 29, 37, 38, 39, 40, 41, 42];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#nineteen_to_thyrtysix").mouseover(function (event) {

        var area = [17, 18, 19, 20, 21, 22, 30, 31, 32, 33, 34, 35, 43, 44, 45, 46, 47, 48];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#even").mouseover(function (event) {

        var area = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 38, 40, 42, 44, 46, 48];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $("#add").mouseover(function (event) {

        var area = [11, 13, 15, 17, 19, 21, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47];

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(area[i]).mouseover();

        }
    });

    $(".square").mouseover(function (event) {

        var area1 = $(this).attr("data-area1") ? parseInt($(this).attr("data-area1")) : null;

        var area2 = $(this).attr("data-area2") ? parseInt($(this).attr("data-area2")) : null;

        var area3 = $(this).attr("data-area3") ? parseInt($(this).attr("data-area3")) : null;



        if (area1 != null) {

            allAreas.eq(area1).mouseover();

        }

        if (area2) {

            allAreas.eq(area2).mouseover();

        }

        if (area3) {

            allAreas.eq(area3).mouseover();

        }


    });

    $(".square").mouseout(function (event) {

        var area1 = $(this).attr("data-area1") ? parseInt($(this).attr("data-area1")) : null;

        var area2 = $(this).attr("data-area2") ? parseInt($(this).attr("data-area2")) : null;

        var area3 = $(this).attr("data-area3") ? parseInt($(this).attr("data-area3")) : null;


        if (area1 != null) {

            allAreas.eq(area1).mouseout();

        }

        if (area2) {

            allAreas.eq(area2).mouseout();

        }

        if (area3) {

            allAreas.eq(area3).mouseout();

        }



    });

    $(".group-cube").mouseover(function (event) {

        var area = $(this).attr("data-area");

        area = area.split(",");

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(parseInt(area[i])).mouseover();

        }


    });

    $(".group-cube").mouseout(function (event) {

        var area = $(this).attr("data-area");

        area = area.split(",");

        for (var i = 0; i < area.length; i++) {

            allAreas.eq(parseInt(area[i])).mouseout();

        }

    });

    $(".cube").mouseover(function (event) {

        var area1 = $(this).attr("data-area1") ? parseInt($(this).attr("data-area1")) : null;

        var area2 = $(this).attr("data-area2") ? parseInt($(this).attr("data-area2")) : null;

        var area3 = $(this).attr("data-area3") ? parseInt($(this).attr("data-area3")) : null;

        var area4 = $(this).attr("data-area4") ? parseInt($(this).attr("data-area4")) : null;


        if (area1 != null) {

            allAreas.eq(area1).mouseover();

        }

        if (area2) {

            allAreas.eq(area2).mouseover();

        }

        if (area3) {

            allAreas.eq(area3).mouseover();

        }

        if (area4) {

            allAreas.eq(area4).mouseover();

        }
    });

    $(".cube").mouseout(function (event) {

        var area1 = $(this).attr("data-area1") ? parseInt($(this).attr("data-area1")) : null;

        var area2 = $(this).attr("data-area2") ? parseInt($(this).attr("data-area2")) : null;

        var area3 = $(this).attr("data-area3") ? parseInt($(this).attr("data-area3")) : null;

        var area4 = $(this).attr("data-area4") ? parseInt($(this).attr("data-area4")) : null;


        if (area1 != null) {

            allAreas.eq(area1).mouseout();

        }

        if (area2) {

            allAreas.eq(area2).mouseout();

        }

        if (area3) {

            allAreas.eq(area3).mouseout();

        }

        if (area4) {

            allAreas.eq(area4).mouseout();

        }



    });

    $(".exit").click(function () {

        var answer = confirm("Do you really want to close?");

        if (answer) {

            $.Roulet.exitsound(ongameexit);
            
        }


    });

    $(".cube").click(function (event) {

        event.preventDefault();
        if ($.User.usercanbet($.Roulet.bet)) {

            var top = parseInt($(this).css("top"));

            var left = parseInt($(this).css("left"));


            if ($(this).attr("data-val") == undefined) {
                return;
            }
            var data_val = JSON.parse($(this).attr("data-val"));

            $.Game.MyBet(data_val);

            var val = [];

            for (var i = 0; i < data_val.length; i++) {

                if (!$.Game.isExist(data_val[i])) {

                    $.Game.Bet(data_val[i]);

                    val.push(data_val[i]);

                }

            }


            var coin = $.Roulet.bet;
            var bets = "<div class='bets' style='left:" + (left - 27.5) + "px;top:" + (top - 22.5) + "px;' data-val='[" + data_val + "]'>" + coin + "</div>"

            if (betelementexists(data_val, bets)) {
                return;
            }

            $.User.Bet();

            $.Roulet.betclicksound();

        }
    });

    $(".square").click(function (e) {

        e.preventDefault();
        if ($.User.usercanbet($.Roulet.bet)) {



            var top = parseInt($(this).css("top"));

            var left = parseInt($(this).css("left"));

            if ($(this).attr("data-val") == undefined) {
                return;
            }

            var data_val = JSON.parse($(this).attr("data-val"));

            var val = [];


            for (var i = 0; i < data_val.length; i++) {

                if (!$.Game.isExist(data_val[i])) {

                    $.Game.Bet(data_val[i]);

                    val.push(data_val[i]);

                }

            }
            var coin = $.Roulet.bet;

            var bets = "<div class='bets betssquare' style='left:" + (left - 14.5) + "px;top:" + (top - 5.5) + "px;' data-val='[" + data_val + "]'>" + coin + "</div>"

            if (betelementexists(data_val, bets)) {
                return;
            }

            $.User.Bet();

            $.Game.MyBet(data_val);

            $.Roulet.betclicksound();
        }
    })

    $(".keypad-button").click(function (event) {
        event.preventDefault()




        var value;

        var top = parseInt($(this).css("top"));

        var left = $(this).css("left");

        var coin = $.Roulet.bet;

        var bets;

        if ($(this).hasClass("not-button")) {

            if ($(this).attr("data-val") == undefined) {
                return;
            }

            value = JSON.parse($(this).attr("data-val"));

            var className = "";

            if ($(this).hasClass("group-number")) {

                className = "betononetotwelve";

            }

            if ($(this).hasClass("group-small")) {

                className = "betononetoeighteen";
            }

            if ($(this).hasClass("even") || $(this).hasClass("odd") || $(this).hasClass("red") || $(this).hasClass("black")) {

                className = "beteven";
            }

            bets = "<div class='bets " + className + "' style='left:" + left + ";top:" + top + "px;' data-val='[" + value + "]'>" + coin + "</div>"

        }
        else {

            if ($(this).attr("data-id") == undefined) {
                return;
            }
            value = parseInt($(this).attr("data-id"));

            bets = "<div class='bets' style='left:" + left + ";top:" + top + "px;' data-val='" + value + "'>" + coin + "</div>"
        }

        if ($.User.usercanbet($.Roulet.bet)) {

            $.Game.Bet(value);

            $.Game.MyBet(value);

            $(".keyboard").prepend(bets);

            $.User.Bet();

            $.Roulet.betclicksound();
        }


    });

    $(document).on("click", ".bets", function () {

        value = JSON.parse($(this).attr("data-val"));

        if ($.User.usercanbet($.Roulet.bet)) {

            $.Game.MyBet(value);

            var coin = Number($.Roulet.bet) + Number($(this).text());

            if (Number(coin) <= 5000) {

                $(this).text(coin);

                $.User.Bet();

                $.Roulet.betclicksound();
            }


        }

    });

    $(".group-cube").click(function (e) {

        e.preventDefault();

        if ($.User.usercanbet($.Roulet.bet)) {

            var top = parseInt($(this).css("top"));

            var left = parseInt($(this).css("left"));

            if ($(this).attr("data-val") == undefined) {

                return;
            }

            var data_val = JSON.parse($(this).attr("data-val"));

            var val = [];

            var coin = $.Roulet.bet;

            var bets = "<div class='bets' style='left:" + (left - 27.5) + "px;top:" + (top - 19.5) + "px;' data-val='[" + data_val + "]'>" + coin + "</div>"

            if (betelementexists(data_val, bets)) return;

            $.Game.MyBet(data_val);

            $.User.Bet();

            $.Roulet.betclicksound();
        }
    });

    $(".cancel-bet").click(function (e) {

        e.preventDefault();

        if (!$.User.canBet) return;

        $.User.CancelBet($.Game.mybets);

        $.Game.mybets = [];

        $(".bets").remove();

        $.ui.cleartimerbetok();
    })

    $("#takebtn").click(function () {
        $(".bets").remove();
        clearInterval($.removetakeinterval);

        $.count = 0;

        $("#takebtn").removeClass("takea");

        $("#takebtn").addClass("take");

        var winScore = $("#win_score").text();

        var i = Number(winScore);

        var interval = setInterval(function () {

            var i = Number($("#win_score").text());

            if (i > 0) {
               
                if (i > 1000) {

                    i = i - 100;

                }
                   
                else if (i > 100)
                {
                    i = i - 10;
                }
                else {
                    i = i - 1;
                }

                $("#win_score").text(i);
            }
            else {
                clearInterval(interval);

                $.Game.TransferWinningPoints();

                $.Roulet.takesound();

                $.User.wincurrentgame = false;
            }

        }, 1)


    })

    $(".coin button").click(function (e) {

        e.preventDefault();
        $.Game.find();
        var hidden_bets = $("#hidden_bets").val();

        if (hidden_bets) {

            hidden_bets = JSON.parse(hidden_bets);

        } else {

            hidden_bets = [];

        }

        $(".coin").removeClass("coin-active");

        $(this).parent().addClass("coin-active");

        var value = $(this).val();

        $.Roulet.bet = value;

        var game_id = $("#game_id").val();
        var user_id = $("#user_id").val();

        var data = {
            game_id: game_id,
            user_id: user_id,
            coin: value,
            bets: JSON.stringify(hidden_bets)
        }

        $.ajax({
            type: "POST",
            url: "/games/bet/",
            data: JSON.stringify(data)
        });

    });


    $.ui.attachevents();

    function ongameexit() {

       

        var user_id = $("#user_id").val();

        var data = {
            user_id: user_id
        }

        $.ajax({
            type: "POST",
            url: "/games/end/",
            data: JSON.stringify(data),
            success: function (response) {

                location.href = "/roulet/index/";

            }
        });
    }

    function betelementexists(data_val, bets) {

        var bets_el = $(".bets[data-val='[" + data_val + "]']");

        if (bets_el.length > 0) {

            bets_el.trigger("click");

            return true;
        }
        else {

            $(".keyboard").prepend(bets);
            return false;
        }
    }

    
});


$.Roulet = {
    wheelStartEnd: function () {
        var first = new Audio('/sound/wheelStart.wav');

        var second = new Audio('/sound/wheelEnd.wav');

        first.addEventListener('ended', function () {

            setTimeout(() => second.play(), 1000);

        });
        //first.play();
    },

    betclicksound: function () {

        var betsound = new Audio('/sound/bet.wav');

        betsound.play();
    },

    takesound: function () {

        var betsound = new Audio('/sound/take.wav');

        betsound.play();
    },

    exitsound: function (callback) {

        var exit = new Audio('/sound/exit.wav');

        exit.play();

        exit.addEventListener('ended', callback);
    },

    winnersound: function () {

       
        var win = new Audio('/sound/win.wav');

        win.play();
    },

    loosesound: function () {

        var loose = new Audio('/sound/lose.wav');

        loose.play();
    },

    loadingsound: function () {

        var loading = new Audio('/sound/loading.wav');

        loading.play();
    },

    init: function () {
        var game_id = $("#game_id").val();

        var data = {
            id: game_id
        }

        $.ajax({
            type: "POST",
            url: "/games/find-game/",
            data: JSON.stringify(data)
        }).then(function (data, textStatus, jqXHR) {

            console.log(data.data[0]);
            if (data.data[0])
                $.Roulet.last = data.data[0].last_five_must_bet.slice(0, 5);
            showlastfivetext();
            // $.Roulet.last

        }, function (jqXHR, textStatus, errorThrown) {

            console.log(errorThrown);

        });
    }
}

$.Roulet.last = [];

$.Roulet.PushLast = function (id) {

    if ($.Roulet.last.length == 5) {

        $.Roulet.last = $.Roulet.last.splice(0, 1);

    }

    if ($.Roulet.last.length == 0) {

        $.Roulet.last[0] = id;

    } else {

        $.Roulet.last[$.Roulet.last.length] = id

    }

    $.Roulet.UpdateLastFive($.Roulet.last);


    showlastfivetext();

}


function setcolor(val, btn) {

    var red = $(".red").attr("data-val").replace("[", "").replace("]", "").split(',');

    var black = $(".black").attr("data-val").replace("[", "").replace("]", "").split(',');


    var r = red.find((element) => { return element == val; }) ? true : false;

    var b = black.find((element) => { return element == val; }) ? true : false;


    if (r) {

        $("#" + btn).css("color", "red");
    }
    else if (b) {

        $("#" + btn).css("color", "white");

    }
    else {
        $("#" + btn).css("color", "green");

    }
}

function showlastfivetext() {


    var reversed = $.Roulet.last.reverse();

    var j = 5;

    for (var i = 0; i < 5; i++) {

        if (reversed[i] != null) {

            var btn = "last_button_" + j;

            var val = reversed[i] < 0 ? "00" : reversed[i];

            $("#" + btn).text(val);

            setcolor(val, btn)

        }
        j--;
    }


}

$.Roulet.must = 00;

$.Roulet.bet = 1;

$.Roulet.randomInteger = function (min, max) {

    var rand = min + Math.random() * (max - min)

    rand = Math.round(rand);

    return rand;

}

$.Roulet.sections = [{ "id": 2, "min": 0, "max": 9.47 }, { "id": 14, "min": 9.47, "max": 18.94 }, { "id": 35, "min": 18.94, "max": 28.410000000000004 }, { "id": 23, "min": 28.410000000000004, "max": 37.88 }, { "id": 4, "min": 37.88, "max": 47.35 }, { "id": 16, "min": 47.35, "max": 56.82 }, { "id": 33, "min": 56.82, "max": 66.29 }, { "id": 21, "min": 66.29, "max": 75.76 }, { "id": 6, "min": 75.76, "max": 85.23 }, { "id": 18, "min": 85.23, "max": 94.7 }, { "id": 31, "min": 94.7, "max": 104.17 }, { "id": 19, "min": 104.17, "max": 113.64 }, { "id": 8, "min": 113.64, "max": 123.11 }, { "id": 12, "min": 123.11, "max": 132.58 }, { "id": 29, "min": 132.58, "max": 142.05 }, { "id": 25, "min": 142.05, "max": 151.52 }, { "id": 10, "min": 151.52, "max": 160.99 }, { "id": 27, "min": 160.99, "max": 170.46 }, { "id": "00", "min": 170.46, "max": 179.93 }, { "id": 1, "min": 179.93, "max": 189.4 }, { "id": 13, "min": 189.4, "max": 198.87 }, { "id": 36, "min": 198.87, "max": 208.34 }, { "id": 24, "min": 208.34, "max": 217.81 }, { "id": 3, "min": 217.81, "max": 227.28 }, { "id": 15, "min": 227.28, "max": 236.75 }, { "id": 34, "min": 236.75, "max": 246.22 }, { "id": 22, "min": 246.22, "max": 255.69 }, { "id": 5, "min": 255.69, "max": 265.16 }, { "id": 17, "min": 265.16, "max": 274.63000000000005 }, { "id": 32, "min": 274.63000000000005, "max": 284.1000000000001 }, { "id": 20, "min": 284.1000000000001, "max": 293.5700000000001 }, { "id": 7, "min": 293.5700000000001, "max": 303.04000000000013 }, { "id": 11, "min": 303.04000000000013, "max": 312.51000000000016 }, { "id": 30, "min": 312.51000000000016, "max": 321.9800000000002 }, { "id": 26, "min": 321.9800000000002, "max": 331.4500000000002 }, { "id": 9, "min": 331.4500000000002, "max": 340.92000000000024 }, { "id": 28, "min": 340.92000000000024, "max": 350.39000000000027 }, { "id": 0, "min": 350.39000000000027, "max": 359.8600000000003 }];
$.Roulet.SaveDrawDetails = function (drawno) {

    var gameid = $("#game_id").val();

    var userid = $("#user_id").val();

    var data = {
        gameid: gameid,
        userid: userid,
        drawno: drawno,
    }

    $.ajax({
        type: "POST",
        url: "/games/drawdetails",
        data: JSON.stringify(data)
    });

}

$.Roulet.UpdateLastFive = function (last) {

    var gameid = $("#game_id").val();

    var userid = $("#user_id").val();

    var data = {
        gameid: gameid,
        userid: userid,
        last: last,
    }

    $.ajax({
        type: "POST",
        url: " /games/updatelastfive",
        data: JSON.stringify(data)
    });
    console.log("save last five");
}
$.Roulet.Higlite = function (id) {

    $.Roulet.PushLast(id);

    var overed = false;

    var button = $("#" + id);

    if ($.Game.isExist(id)) {

        var game_id = $("#game_id").val();

        var data = {
            user_id: game_id,
            coin: $.Roulet.bet,
            type: "win"
        }

        $.ajax({
            type: "POST",
            url: "/logs/log/",
            data: JSON.stringify(data)
        });

        


    }
    else {

        var game_id = $("#game_id").val();

        var data = {
            user_id: game_id,
            coin: $.Roulet.bet,
            type: "loose"
        }

        $.ajax({
            type: "POST",
            url: "/logs/log/",
            data: JSON.stringify(data)
        });
        $(".bets").remove();
    }

    this.SaveDrawDetails(id);

    if ($.Game.mybets.length > 0) {

        $.Game.prevbet = $.Game.mybets;


    }

    $.Game.bets = [];

   

    for (var i = 1; i <= 20; i++) {

        (function (index) {

            setTimeout(function () {

                if (overed) {

                    overed = false;

                    button.mouseout();

                } else {

                    overed = true;

                    button.mouseover();

                }

            }, i * 500);

        })(i);
    }

    setTimeout(function () {

        $("#keyboard_overlay").hide();

    }, 10000);




}

$.Roulet.GetNumber = function (gradus) {

    var section = null;

    for (var i = 0; i < $.Roulet.sections.length; i++) {

        if ($.Roulet.sections[i].id == $.Roulet.must) {

            section = $.Roulet.sections[i];

        }

    }
    if ($.Roulet.must == -1) {
        section = $.Roulet.sections[18]; //"00" waala section highlight
    }

    var min = section["min"];

    var max = section["max"];

    var midle = min + ((max - min) / 2);

    $("#roulet").css({ "transform": "rotate(" + midle + "deg)" });

    $.Roulet.Higlite(section.id);

    $.Game.calcultepoints($.Roulet.must);

}

$.Roulet.RunBall = function () {

    setTimeout(function () {

        $("#ball").removeClass("ball-animated");

        setTimeout(function () {

            $("#ball").addClass("ball-animated");

        }, 300)

    }, 200);

    $("#keyboard_overlay").show();

    var duration = 700;

    var rotation = function () {

        if (duration > 2400) {

            $("#roulet").stopRotate();

            $("#ballWrapper").stopRotate();

            $.Roulet.GetNumber($("#roulet").getRotateAngle()[0]);

            return;

        }

        var random = $.Roulet.randomInteger(450, 600);

        duration += random;

        $("#ballWrapper").rotate({
            angle: -1,
            animateTo: -360,
            callback: rotation,
            duration: duration,
            easing: function (x, t, b, c, d) {
                return c * (t / d) + b;
            }
        });


    }


    rotation();

}

$.Roulet.RunRullet = function () {

    var duration = 400;

    var rotationRullet = function () {

        if (duration > 2800) {

            return;

        }

        var random = $.Roulet.randomInteger(400, 500);

        duration += random;

        rotationRulletObj = $("#roulet").rotate({
            angle: 0,
            animateTo: 360,
            callback: rotationRullet,
            duration: duration,
            easing: function (x, t, b, c, d) {
                return c * (t / d) + b;
            }
        });
    }

    rotationRullet();

}

$.Roulet.RunRound = function () {

    this.wheelStartEnd();

    $.Roulet.RunBall();

    $.Roulet.RunRullet();

}

$.Roulet.FirstRun = function (seconds) {

    var d = new Date(99, 5, 24, 11, 33, 59, 0);

    var now = new Date();

    var current_sec = d.getSeconds() - now.getSeconds();

    var timerInterval = setInterval(function () {

        if (current_sec > (0)) {

            current_sec--;

            current_sec = current_sec.toString().length == 1 ? "0" + current_sec : current_sec;

            $("#timer_text").text("0:" + current_sec);

            $.Roulet.showmessage(current_sec);

        } else {

            clearInterval(timerInterval);

            $.Roulet.Run();

            $.Roulet.RunRound();



        }

    }, 1000);

}

$.Roulet.showmessage = function (current_sec) {

    current_sec = Number(current_sec);

    if ($.User.wincurrentgame) {

        $(".betguide").text($.messages.wingame);

    }



    else if ($.User.betaccepted) {

        $(".betguide").text($.messages.betaccepted);

    }

    else if (current_sec <= 10 || current_sec >= 50) {

        $.User.canBet = false;

        if ($.User.betaccepted) {

            $(".betguide").text($.messages.betaccepted);

        }
        else {

            $(".betguide").text($.messages.bet_time_over);

            if ($.Game.mybets.length > 0) {


                $(".betguide").text($.messages.betaccepted);

            }

        }
        

        if (current_sec >= 50) {

            $(".betguide").text($.messages.whenrouletterolling);

        }

        $.ui.cleartimerbetok();

    }

    else {

        $.User.canBet = true;

        if ($.User.userhasEnoughPoints($.Roulet.bet)) {

            $(".betguide").text($.messages.makebet);

        }
        else {

            $(".betguide").text($.messages.hasenoughpoints);
        }

        if ($.Game.mybets.length > 0) {

            $.User.IsPrevBetBtn = false;

            $.ui.betok.text("Bet Ok");

            

        }
        else if ($.Game.prevbet.length> 0 ) {

            $.User.IsPrevBetBtn = true;

            $.ui.betok.text("Prev Bet");

            $.ui.blinkbetokbtn();
        }

    }

    //console.log(current_sec);


    if (current_sec <= 15 && current_sec >= 10) {

        $.ui.blinktimer();

    }
    else {

        $.ui.cleartimerblink();
    }
}

$.Roulet.Run = function () {

    var current_sec = 60;

    var timerInterval = setInterval(function () {

        if (current_sec > (0)) {

            current_sec--;

            current_sec = current_sec.toString().length == 1 ? "0" + current_sec : current_sec;

            $("#timer_text").text("0:" + current_sec);

            $.Roulet.showmessage(current_sec);

        } else {

            clearInterval(timerInterval);

            $.Roulet.Run();

            $.Roulet.RunRound();


        }

    }, 1000);

}

