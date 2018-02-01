var Bets = {
    "0": {
        coin: null,
        bets : null
    },
    "1": {
        coin: null,
        bets: null
    },
    "2": {
        coin: null,
        bets: null
    },
    "3": {
        coin: null,
        bets: null
    },
    "4": {
        coin: null,
        bets: null
    },
    "5": {
        coin: null,
        bets: null
    },
    "6": {
        coin: null,
        bets: null
    },
    "7": {
        coin: null,
        bets: null
    },
    "8": {
        coin: null,
        bets: null
    },
    "9": {
        coin: null,
        bets: null
    },
    "10": {
        coin: null,
        bets: null
    },
    "11": {
        coin: null,
        bets: null
    },
    "12": {
        coin: null,
        bets: null
    },
    "13": {
        coin: null,
        bets: null
    },
    "14": {
        coin: null,
        bets: null
    },
    "15": {
        coin: null,
        bets: null
    },
    "16": {
        coin: null,
        bets: null
    },
    "17": {
        coin: null,
        bets: null
    },
    "18": {
        coin: null,
        bets: null
    },
    "19": {
        coin: null,
        bets: null
    },
    "20": {
        coin: null,
        bets: null
    },
    "21": {
        coin: null,
        bets: null
    },
    "22": {
        coin: null,
        bets: null
    },
    "23": {
        coin: null,
        bets: null
    },
    "24": {
        coin: null,
        bets: null
    },
    "25": {
        coin: null,
        bets: null
    },
    "26": {
        coin: null,
        bets: null
    },
    "27": {
        coin: null,
        bets: null
    },
    "28": {
        coin: null,
        bets: null
    },
    "29": {
        coin: null,
        bets: null
    },
    "30": {
        coin: null,
        bets: null
    },
    "31": {
        coin: null,
        bets: null
    },
    "32": {
        coin: null,
        bets: null
    },
    "33": {
        coin: null,
        bets: null
    },
    "34": {
        coin: null,
        bets: null
    },
    "35": {
        coin: null,
        bets: null
    },
    "36": {
        coin: null,
        bets: null
    }

}


function RestBets() {

    Bets = {
        "0": {
            coin: null,
            bets: null
        },
        "1": {
            coin: null,
            bets: null
        },
        "2": {
            coin: null,
            bets: null
        },
        "3": {
            coin: null,
            bets: null
        },
        "4": {
            coin: null,
            bets: null
        },
        "5": {
            coin: null,
            bets: null
        },
        "6": {
            coin: null,
            bets: null
        },
        "7": {
            coin: null,
            bets: null
        },
        "8": {
            coin: null,
            bets: null
        },
        "9": {
            coin: null,
            bets: null
        },
        "10": {
            coin: null,
            bets: null
        },
        "11": {
            coin: null,
            bets: null
        },
        "12": {
            coin: null,
            bets: null
        },
        "13": {
            coin: null,
            bets: null
        },
        "14": {
            coin: null,
            bets: null
        },
        "15": {
            coin: null,
            bets: null
        },
        "16": {
            coin: null,
            bets: null
        },
        "17": {
            coin: null,
            bets: null
        },
        "18": {
            coin: null,
            bets: null
        },
        "19": {
            coin: null,
            bets: null
        },
        "20": {
            coin: null,
            bets: null
        },
        "21": {
            coin: null,
            bets: null
        },
        "22": {
            coin: null,
            bets: null
        },
        "23": {
            coin: null,
            bets: null
        },
        "24": {
            coin: null,
            bets: null
        },
        "25": {
            coin: null,
            bets: null
        },
        "26": {
            coin: null,
            bets: null
        },
        "27": {
            coin: null,
            bets: null
        },
        "28": {
            coin: null,
            bets: null
        },
        "29": {
            coin: null,
            bets: null
        },
        "30": {
            coin: null,
            bets: null
        },
        "31": {
            coin: null,
            bets: null
        },
        "32": {
            coin: null,
            bets: null
        },
        "33": {
            coin: null,
            bets: null
        },
        "34": {
            coin: null,
            bets: null
        },
        "35": {
            coin: null,
            bets: null
        },
        "36": {
            coin: null,
            bets: null
        }

    }
}

var seconds = null;
var timerInterval;

function Timer(seconds, time) {

    if (timerInterval) {
        return;
    }

    var d = new Date(99, 5, 24, 11, 33, 59, 0);

    var now = new Date();

    var current_sec = d.getSeconds() - now.getSeconds();


    timerInterval = setInterval(function(){

        if(current_sec > (0)){

            current_sec--;

            current_sec = current_sec.toString().length == 1 ? "0" + current_sec : current_sec;

            $("#timer_text").text("0:" + current_sec);

        }else{

            current_sec = 60;

        }

    },1000);

}

$.Game = {
    
    busy: false,
    find: function () {

        var game_id = $("#game_id").val();

        var data = {
            id: game_id
        }

        if (!$.Game.busy) {

            $.Game.busy = true;

            $.ajax({
                type: "POST",
                url: "/games/find-game/",
                data: JSON.stringify(data),
                success: function (responseData) {
                   
                    var response = responseData.data;

                    if (!seconds) {

                       Timer(8);
                      
                    }

                    $.Game.busy = false;

                    if (response) {

                        var first = response[0];

                       
                        if ((first) && (first.must_bet)) {

                            var musts = $(".must");

                            musts.removeClass("must_active");

                            musts.each(function () {

                                if (parseInt($(this).text()) == first.must_bet) {

                                    $(this).addClass("must_active");
                                }

                            });

                            $.Game.last_five = first.last_five_must_bet;

                        }


                        for (var i = 0; i < response.length; i++) {
                             
                            var player = response[i];

                            if (player.bets) {

                                var bets = player.bets;

                                for (var s = 0; s < bets.length; s++) {

                                    var value = bets[s];

                                    if (Array.isArray(value)){

                                        $.each(value, function (key, value) {

                                            assignbets(value,player);

                                        });

                                    }
                                    else {

                                        assignbets(value,player);
                                        
                                    }
                                    

                                }

                            }

                        }


                    }

                    


                    $.each(Bets, function (key, value) {
                        
                        var value = value;

                        $("#" + key + "-" + value.coin).text(value.bets)
                       
                    });

                    RestBets();
                 
                
      
            }
            });

        }

        
    },
    subscribe: function () {

        setInterval(function () {

            $.Game.find();

        }, 5000)

    },
    must_bet: function (number) {

        var game_id = $("#game_id").val();

        var data = {
            id: game_id,
            must_bet: number,
            last:this.last_five
        }

        $.Game.busy = true;

        $.ajax({
            type: "POST",
            url: "/games/update/",
            data: JSON.stringify(data),
            success: function (response) {

                $.Game.busy = false;

            }
        });


    },
    last_five: [],
    SetLastFiveBets: function (number) {
        
        if (this.last_five.length == 6) {
            this.last_five.shift();
            this.last_five.push(number);
        }
        else {
            this.last_five.push(number);
        }
      
      
    }
}

function assignbets(value,player) {

    var current = Bets[value.toString()];

    var new_data = { coin: null, bets: null };

    if (current) {

        new_data = {
            coin: player.current_bet,
            bets: current.bets + player.current_bet
        }
    }

    Bets[value.toString()] = new_data;

}

jQuery(document).ready(function () {

    $.Game.subscribe();

    $(".must").on("click", function () {

        var number = 0;
        if ($(this).text() == "00") {
            number = -1;
        }
        else {

             number = parseInt($(this).text());
        }
        var musts = $(".must");

        musts.removeClass("must_active");

        $(this).addClass("must_active");

        $.Game.SetLastFiveBets(number);

        $.Game.must_bet(number);

        
    });

});
