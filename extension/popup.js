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
  populate_popup: function(tracks) {
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
      track_list.append(li);
    }
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
