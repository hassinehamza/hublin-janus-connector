'use strict';

angular.module('hublin.janus.connector')
  .constant('JANUS_CONSTANTS', {
    join: 'join',
    defaultRoom: 1234,
    publisher: 'publisher',
    serverAddress: 'http://localhost:8088/janus',
    videoroom: 'janus.plugin.videoroom'
  })

  .factory('janusRTCAdapter', function(session, JANUS_CONSTANTS) {

    return {
      connect: connect,
      handleSuccessAttach: handleSuccessAttach
    };

    function connect() {
      Janus.init({
        debug: true,
        callback: function() {
          var janus = new Janus({
            server: JANUS_CONSTANTS.serverAddress,
            success: function() {
              Janus.debug('Session created!');
              janus.attach({
                plugin: JANUS_CONSTANTS.videoroom,
                success: handleSuccessAttach,
                error: function(error) {
                  Janus.debug('Error: ' + error);
                }
              });
            },
            error: function(error) {
              Janus.debug('Error while creating the session: ' + error);
            }
          });
        }
      });
    }

    function handleSuccessAttach(pluginHandle) {
      var username = session.getUsername();
      //The number of the room is the default room used by Janus.
      //It is only used temporarily, until we implement dynamic room creation.
      var register = { request: JANUS_CONSTANTS.join, room: JANUS_CONSTANTS.defaultRoom, ptype: JANUS_CONSTANTS.publisher, display: username };

      pluginHandle.send({ message: register });
    }

  });
