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
    var tabs = $('.tabbed-panel .tabbed-panel-tab');
    var room_tab = false;
    tabs.each(function() {
      var tab = $(this);
      if ($('.tab-title', tab).text() == 'Room') {
        room_tab = tab;
        return;
      }
    });
    return room_tab;
  },

  load_room_tab: function() {
    var room_tab = this.get_room_tab();
    $('.tab-item', room_tab).trigger('click');
  },

  load_recent_songs: function() {
    this.load_room_tab();
    $('.room-tab .recently-played-link').trigger('click');
  },

  get_track_title: function(song_el) {
    return $('.title', song_el).text();
  },

  get_track_artist: function(song_el) {
    return $.map($('.details .divider', song_el), function(el) {
      return el.previousSibling.nodeValue;
    }).join(' ');
  },

  extract_track_list: function() {
    var song_elements = $('.room-tab .song-list .song');
    var tracks = [];
    var me = this;
    song_elements.each(function() {
      var song_el = $(this);
      var title = me.get_track_title(song_el);
      var artist = me.get_track_artist(song_el);
      tracks.push({title: title, artist: artist});
    });
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
