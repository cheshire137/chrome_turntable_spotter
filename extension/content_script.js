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

var turntable_spotter = {
  get_room_tab: function() {
    console.log('get_room_tab');
    var tabs = $('.tabbed-panel .tabbed-panel-tab');
    var room_tab = false;
    tabs.each(function() {
      var tab = $(this);
      if ($('.tab-title', tab).text() == 'Room') {
        room_tab = tab;
        return;
      }
    });
    console.log(room_tab);
    return room_tab;
  },

  load_room_tab: function() {
    console.log('load_room_tab');
    var room_tab = this.get_room_tab();
    console.log($('.tab-item', room_tab));
    $('.tab-item', room_tab).trigger('click');
  },

  load_recent_songs: function() {
    console.log('load_recent_songs');
    this.load_room_tab();
    $('.room-tab .recently-played-link').trigger('click');
  },

  extract_track_list: function() {
    console.log('extract_track_list');
    var song_elements = $('.room-tab .song-list .song');
    console.log(song_elements);
    var tracks = [];
    song_elements.each(function() {
      var song_el = $(this);
      var title = $('.title', song_el).text();
      tracks.push({title: title});
    });
    console.log(tracks);
    return tracks;
  },

  on_popup_opened: function(tab_id, callback) {
    console.log('popup opened');
    this.load_recent_songs();
    callback(this.extract_track_list());
  }
};

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.greeting == 'popup_opened') {
    turntable_spotter.on_popup_opened(request.tab_id, function(data) { sendResponse(data);
    });
  }
});
