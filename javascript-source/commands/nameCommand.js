/*
 * nameCommand.js
 *
 * This module returns a random name that was active in the last 10 minutes
 */
(function() {
    var ACTIVITY_DELAY_TIME_MS = 10 * 60 * 1000;

    $.bind('ircChannelMessage', function(event) {
        var sender = event.getSender().toLowerCase();
        var time_ms = $.systemTime();
        if(sender == $.botName.toLowerCase() || sender == $.channelName.toLowerCase() || sender == $.ownerName.toLowerCase())
            return;
        $.inidb.SetLong('name_lastmsg', '', sender, time_ms);
    });

    $.bind('command', function(event) {
        var i, command = event.getCommand();

        if (command.equalsIgnoreCase('name')) {
            var min_time = $.systemTime() - ACTIVITY_DELAY_TIME_MS;
            var ulist = $.inidb.GetKeyList('name_lastmsg', '');
            var flist = [];
            $.inidb.setAutoCommit(false);
            try {
                for(i in ulist) {
                    var utime = $.inidb.GetLong('name_lastmsg', '', ulist[i]);
                    if(utime >= min_time) {
                        flist.push(ulist[i]);
                    } else {
                        $.inidb.del('name_lastmsg', ulist[i]);
                    }
                }
            } finally {
                $.inidb.setAutoCommit(true);
            }
            $.say('Poor soul that\'s about to die violently: ' + $.username.resolve($.randElement(flist)));
        }
    });

    $.bind('initReady', function() {
        $.registerChatCommand('./commands/nameCommand.js', 'name', 2);
    });
})();
