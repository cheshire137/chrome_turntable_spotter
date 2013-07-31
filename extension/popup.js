/*
 * Copyright 2013 Sarah Vessels
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42849115-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

var turntable_spotter_popup = {
  get_spotify_track_search_url: function(query) {
    return 'http://ws.spotify.com/search/1/track.json?q=' +
            encodeURIComponent(query);
  },

  get_spotify_trackset_url: function(name, track_ids) {
    var joined_ids = track_ids.join(',');
    return 'spotify:trackset:' + name + ':' + joined_ids;
  },

  set_trackset_link: function() {
    var link = $('a[href="#open-tracklist"]');
    var track_ids = [];
    $('#track-list .track-link').each(function() {
      var track_id = $(this).attr('href').split('spotify:track:')[1];
      track_ids.push(track_id);
    });
    var trackset_url = this.get_spotify_trackset_url('Turntable.fm', track_ids);
    link.click(function() {
      chrome.tabs.create({url: trackset_url});
      return false;
    });
    link.parent().show();
  },

  get_track_list_item: function(track) {
    var title = this.strip_quotes(track.title);
    var artist = this.strip_quotes(track.artist);
    return $('#track-list li[data-title="' + title + '"][data-artist="' +
             artist + '"]');
  },

  set_track_link: function(track, is_last) {
    var query = track.title + ' ' + track.artist;
    var url = this.get_spotify_track_search_url(query);
    var me = this;
    $.getJSON(url, function(data) {
      if (data && data.info && data.info.num_results > 0) {
        var spotify_url = data.tracks[0].href;
        var list_item = me.get_track_list_item(track);
        var spotify_link = $('<a href="' + spotify_url +
                             '" class="track-link"></a>');
        spotify_link.click(function() {
          chrome.tabs.create({url: spotify_url});
          return false;
        });
        spotify_link.append(list_item.children().detach());
        list_item.append(spotify_link);
      }
      if (is_last) {
        me.set_trackset_link();
      }
    });
  },

  set_spotify_links: function(tracks) {
    var num_tracks = tracks.length;
    for (var i=0; i<num_tracks; i++) {
      this.set_track_link(tracks[i], i == num_tracks - 1);
    }
  },

  strip_quotes: function(str) {
    return str.replace(/"/, "'");
  },

  populate_track_list: function(tracks) {
    var track_list = $('#track-list');
    track_list.empty();
    for (var i=0; i<tracks.length; i++) {
      var track = tracks[i];
      var li = $('<li></li>');
      var title_span = $('<span class="title"></span>');
      title_span.text(track.title);
      li.append(title_span);
      var artist_span = $('<span class="artist"></span>');
      artist_span.text(track.artist);
      li.append(artist_span);
      li.attr('data-artist', this.strip_quotes(track.artist));
      li.attr('data-title', this.strip_quotes(track.title));
      track_list.append(li);
    }
  },

  populate_popup: function(tracks) {
    this.set_spotify_links(tracks);
    this.populate_track_list(tracks);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(
      tab.id,
      {greeting: 'popup_opened', tab_id: tab.id},
      function(tracks) {
        turntable_spotter_popup.populate_popup(tracks);
      }
    );
  });
});
