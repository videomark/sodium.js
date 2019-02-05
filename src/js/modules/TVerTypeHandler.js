export default class TVerTypeHandler {

    static get_duration() {
        const duration = videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .duration();

        return !duration || Number.isNaN(duration) ? -1 : duration;
    }

    static get_video_width() {
        // eslint-disable-next-line no-underscore-dangle
        const play_list = videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .tech_.hls.selectPlaylist();

        const { attributes: { RESOLUTION: { width } } } = play_list;

        return width;
    }

    static get_video_height() {
        // eslint-disable-next-line no-underscore-dangle
        const play_list = videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .tech_.hls.selectPlaylist();

        const { attributes: { RESOLUTION: { height } } } = play_list;

        return height;
    }

    static get_bitrate() {
        // eslint-disable-next-line no-underscore-dangle
        return videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .tech_.hls.selectPlaylist().attributes.BANDWIDTH;
    }

    static get_receive_buffer() {
        return videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .bufferedEnd();
    }

    static get_framerate() {
        return -1;
    }

    static get_segment_domain() {
        // eslint-disable-next-line no-underscore-dangle
        const play_list = videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .tech_.hls.selectPlaylist();

        const { segments } = play_list;
        if (!segments)
            return null;

        const last = segments[segments.length - 1];

        return new URL(last.resolvedUri).hostname;
    }

    static get_current_time(video) {
        if (!TVerTypeHandler.is_main_video(video))
            return -1;

        return videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]]
            .currentTime();
    }

    static is_main_video(video) {
        return !videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].ima3.el.contains(video);
    }

    static is_tver_type() {
        try {
            if (videojs &&
                videojs.getPlayers instanceof Function &&
                Object.keys(videojs.getPlayers()).length !== 0 &&
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].ima3 &&
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].ima3.el &&
                // eslint-disable-next-line no-underscore-dangle
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].tech_ &&
                // eslint-disable-next-line no-underscore-dangle
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].tech_.hls &&
                // eslint-disable-next-line no-underscore-dangle
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].tech_.hls.selectPlaylist instanceof Function &&
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].bufferedEnd instanceof Function &&
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].duration instanceof Function &&
                videojs.getPlayers()[Object.keys(videojs.getPlayers())[0]].currentTime instanceof Function)
                return true;

            return false;
        } catch (e) {
            return false;
        }
    }
}
