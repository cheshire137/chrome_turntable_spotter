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

var turntable_spotter_popup = {
  get_spotify_track_search_url: function(query) {
    return 'http://ws.spotify.com/search/1/track.json?q=' +
            encodeURIComponent(query);
  },

  get_spotify_trackset_url: function(name, track_ids) {
    var joined_ids = track_ids.join(',');
    return 'spotify:trackset:' + name + ':' + joined_ids;
  },

  update_trackset_url: function() {
    var link = $('a[href="#open-tracklist"]');
  },

  get_track_list_item: function(track) {
    var title = this.strip_quotes(track.title);
    var artist = this.strip_quotes(track.artist);
    return $('#track-list li[data-title="' + title + '"][data-artist="' +
             artist + '"]');
  },

  set_spotify_link: function(track) {
    var query = track.title + ' ' + track.artist;
    var url = this.get_spotify_track_search_url(query);
    var me = this;
    $.getJSON(url, function(data) {
      console.log(url);
      console.log(data);
      if (data && data.info && data.info.num_results > 0) {
        var spotify_url = data.tracks[0].href;
        console.log(spotify_url);
        var list_item = me.get_track_list_item(track);
        console.log(list_item);
        var spotify_link = $('<a href="#open-track"></a>');
        spotify_link.click(function() {
          chrome.tabs.create({url: spotify_url});
          return false;
        });
        spotify_link.append(list_item.children().detach());
        list_item.append(spotify_link);
      }
    });
  },

  set_spotify_links: function(tracks) {
    // this.get_spotify_track_ids(tracks, function(track_ids) {
    //   var trackset_url = this.get_spotify_trackset_url('Turntable.fm',
    //                                                    track_ids);
    //   link.click(function() {
    //     chrome.tabs.create({url: trackset_url});
    //     return false;
    //   });
    //   link.parent().show();
    // });
    for (var i=0; i<tracks.length; i++) {
      this.set_spotify_link(tracks[i]);
    }
  },

  strip_quotes: function(str) {
    return str.replace(/"/, "'");
  },

  populate_track_list: function(tracks) {
    var track_list = $('#track-list');
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
