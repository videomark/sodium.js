// eslint-disable-next-line import/no-unresolved
import uuidv4 from "uuid/v4";
import Config from "./modules/Config";
import UI from "./modules/UI";
import SessionData from "./modules/SessionData";
import YouTubeTypeHandler from "./modules/YouTubeTypeHandler";
import { version } from "../../package.json";

// --- New Session --- //
const session = new SessionData(uuidv4(), version);

// --- UI --- //
const ui = new UI(Config.get_ui_target());

/**
 * video の検索と保持しているvideoの更新
 */
function video_search() {
  const video_elms = document.getElementsByTagName("video");
  session.set_video_elms(video_elms);
  // ビデオが利用できないとき (YouTube でのビデオ切替時やCM再生中などにも発生)
  if (!session.get_video_availability()) {
    ui.remove_element();
  }
}

(() => {
  // --- support --- //
  if (/*  !performance || */ !document || !window) {
    // eslint-disable-next-line no-console
    console.warn("VIDEOMARK: NOT supported");
    return;
  }

  /*
  // --- resouce buffer --- //
  let res_buf_full_cnt = 0;

  performance.onresourcetimingbufferfull = () => {
    // eslint-disable-next-line no-console
    console.warn('VIDEOMARK: Resource Timing Buffer is FULL!');
    if (performance.setResourceTimingBufferSize instanceof Function) {
      // eslint-disable-next-line no-console
      console.log('VIDEOMARK: ... Performance.setResourceTimingBufferSize() = supported');
      res_buf_full_cnt += 1;
      performance.setResourceTimingBufferSize(res_buf_full_cnt * Config.get_DEFAULT_RESOURCE_BUFFER_SIZE());
    } else {
      // eslint-disable-next-line no-console
      console.warn('VIDEOMARK: ... Performance.setResourceTimingBufferSize() = NOT supported');
    }
  };
  */

  // eslint-disable-next-line no-console
  console.log(
    `VIDEOMARK: New Session start Session ID[${session.get_session_id()}]`
  );

  // --- YouTube Hook --- //
  YouTubeTypeHandler.hook_loadVideoByPlayerVars();

  // --- video list --- //
  video_search();

  // --- update video list --- //
  window.setInterval(() => {
    // --- update video list --- //
    video_search();
  }, Config.get_search_video_interval());

  // --- update latest qoe view element --- //
  window.setInterval(() => {
    // --- update quality info --- //
    session.update_quality_info();

    if (!session.get_video_availability()) return;

    // --- show status  --- //
    ui.update_status({
      sessionId: session.get_session_id(),
      video: session.get_main_video()
    });
  }, Config.get_collect_interval());

  // --- main loop --- //
  session.start();
})();
