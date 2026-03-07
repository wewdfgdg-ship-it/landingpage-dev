// ============================================================
// 트래킹 스크립트 — 배포된 HTML에 삽입되는 인라인 JS
// Code Engine(⑩)에서 assembleHtml 시 <script>로 주입
// ============================================================

export function generateTrackingScript(projectId: string, versionId?: string): string {
  return `
<script>
(function(){
  var PID="${projectId}";
  var VID=${versionId ? `"${versionId}"` : 'null'};
  var SID=Math.random().toString(36).slice(2)+Date.now().toString(36);
  var API="/api/track";
  var device=window.innerWidth<768?"mobile":window.innerWidth<1024?"tablet":"desktop";
  var sent={};

  function send(type,payload){
    var key=type+(payload.sectionId||"")+(payload.scrollPercent||"");
    if(sent[key])return;
    sent[key]=1;
    var body={projectId:PID,eventType:type,sessionId:SID,payload:Object.assign({device:device,timestamp:Date.now(),referrer:document.referrer},payload)};
    if(VID)body.versionId=VID;
    navigator.sendBeacon?navigator.sendBeacon(API,JSON.stringify(body)):fetch(API,{method:"POST",body:JSON.stringify(body),keepalive:true});
  }

  // page_view
  send("page_view",{});

  // scroll tracking (25%, 50%, 75%, 100%)
  var scrollMarks=[25,50,75,100];
  var docH=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)-window.innerHeight};
  window.addEventListener("scroll",function(){
    var pct=Math.round(window.scrollY/docH()*100);
    scrollMarks.forEach(function(m){if(pct>=m)send("scroll_depth",{scrollPercent:m})});
  },{passive:true});

  // section tracking (IntersectionObserver)
  if(window.IntersectionObserver){
    var sectionTimes={};
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var sid=e.target.dataset.sectionId;
        if(!sid)return;
        if(e.isIntersecting){
          sectionTimes[sid]=Date.now();
          send("section_view",{sectionId:sid,sectionOrder:parseInt(e.target.dataset.sectionOrder||"0")});
        }else if(sectionTimes[sid]){
          send("section_dwell",{sectionId:sid,dwellTimeMs:Date.now()-sectionTimes[sid]});
          delete sectionTimes[sid];
        }
      });
    },{threshold:0.3});
    document.querySelectorAll("[data-section-id]").forEach(function(el){obs.observe(el)});
  }

  // CTA click tracking
  document.addEventListener("click",function(e){
    var btn=e.target.closest("[data-cta]");
    if(btn){
      var sec=btn.closest("[data-section-id]");
      send("cta_click",{
        ctaLabel:btn.textContent.trim().slice(0,50),
        sectionId:sec?sec.dataset.sectionId:undefined
      });
    }
  });

  // bounce detection (떠날 때 30초 미만이면 bounce)
  var startTime=Date.now();
  window.addEventListener("beforeunload",function(){
    if(Date.now()-startTime<30000)send("bounce",{});
  });

  // conversion tracking (외부에서 호출 가능)
  window.__trackConversion=function(){send("conversion",{})};
})();
</script>`;
}
