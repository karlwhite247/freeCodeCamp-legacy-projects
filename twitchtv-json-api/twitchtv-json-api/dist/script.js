$(function () {
  var channels = [
    "ESL_SC2",
    "OgamingSC2",
    "freecodecamp",
    "whiterubber",
    "syndicate",
    "LIRIK",
    "Ninja",
    "Grimmmz"
  ]; // Your favourite channels ;)
  var placeholder =
    "https://images.unsplash.com/photo-1487621167305-5d248087c724?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80"; // placeholder when channel dont have a logo

  function channel_online(channel) {
    // Function for online channels

    $.ajax({
      url: "https://wind-bow.gomix.me/twitch-api/streams/" + channel,
      dataType: "jsonp",
      success: function (data) {
        if (data.stream != null) {
          // If user is online

          if (data.stream.channel.logo === null) {
            // Channel without logo
            $(".streamers").append(
              "<a class='onlineChannels'" +
                "href='https://www.twitch.tv/" +
                data.stream.channel.name +
                "' " +
                "target='_blank'><p><img id='logo' src=" +
                "'" +
                placeholder +
                "'" +
                ">" +
                "<strong id='channel_name'>" +
                data.stream.channel.display_name +
                "</strong>" +
                "<br>" +
                "<i>" +
                "<strong>" +
                data.stream.game +
                ": " +
                "</strong>" +
                data.stream.channel.status +
                "<i>" +
                "</p></a>"
            );
            $(".streamers p").css("backgroundColor", "#b3ffb3");
          } else {
            // Channel with logo
            $(".streamers").append(
              "<a class='onlineChannels'" +
                "href='https://www.twitch.tv/" +
                data.stream.channel.name +
                "' " +
                "target='_blank'><p><img id='logo' src=" +
                "'" +
                data.stream.channel.logo +
                "'" +
                ">" +
                "<strong id='channel_name'>" +
                data.stream.channel.display_name +
                "</strong>" +
                "<br>" +
                "<i>" +
                "<strong>" +
                data.stream.game +
                ": " +
                "</strong>" +
                data.stream.channel.status +
                "<i>" +
                "</p></a>"
            );
            $(".streamers p").css("backgroundColor", "#6441a5");
          }
        } else if (data.status === 422) {
          // If users account is closed
          $(".streamers").append(
            "<a class='offlineChannels'" +
              "href='https://www.twitch.tv/" +
              channel +
              "' target='_blank'><p><img id='logo' src='" +
              placeholder +
              "'><strong id='channel_name'>" +
              channel +
              "</strong><br><i class='offline'>Account closed<i></p></a>"
          );
        } else {
          // If user is offline
          channel_offline(channel);
        }
      } // End of AJAX success function!
    }); // End of AJAX call!
  } // End of channel_online(channel)!

  function channel_offline(channel) {
    // Function for offline channels

    $.ajax({
      url: "https://wind-bow.gomix.me/twitch-api/channels/" + channel, // When channel is offline, we need use 'channels' instead of 'streams'
      dataType: "jsonp",
      success: function (data) {
        $(".streamers").append(
          "<a class='offlineChannels'" +
            "href='https://www.twitch.tv/" +
            data.name +
            "' " +
            "target='_blank'><p><img id='logo' src=" +
            "'" +
            data.logo +
            "'" +
            ">" +
            "<strong id='channel_name'>" +
            data.display_name +
            "</strong><br><i class='offline'>Offline<i></p></a>"
        );
      } // End of AJAX success function!
    }); // End of AJAX call!
  } // End of channel_offline(channel)!

  $(".switch-field input").on("change", function () {
    // Radio buttons

    if ($(this).val() === "online") {
      $(".offlineChannels").addClass("hidden");
      $(".onlineChannels").removeClass("hidden");
    } else if ($(this).val() === "offline") {
      $(".onlineChannels").addClass("hidden");
      $(".offlineChannels").removeClass("hidden");
    } else {
      $(".onlineChannels").removeClass("hidden");
      $(".offlineChannels").removeClass("hidden");
    }
  }); // End of radio buttons function!

  for (var i = 0; i < channels.length; i++) {
    // And final, FOR LOOP to display all your channels
    channel_online(channels[i]);
  }
}); // End of READY function!