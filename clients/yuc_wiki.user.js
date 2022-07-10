// ==UserScript==
// @name         OBS 直播標記動漫 - yuc.wiki
// @namespace    https://github.com/wang48372162/obs-animes-markup
// @version      0.1.0
// @description  OBS 直播標記動漫 - yuc.wiki
// @author       wang48372162
// @match        https://yuc.wiki/*
// @icon         https://yuc.wiki/images/32x32.png
// ==/UserScript==

(function () {
  'use strict';

  const mainList = document.querySelector('.post-body > div:last-child')

  Array.from(mainList.children).forEach(el => {
    if (el.tagName.toLowerCase() !== 'div') return
    if (el.style.float === 'left') return
    if (el.style.clear === 'both') return

    const titleBlockEl = el.querySelector('.title_main, .title_main_br')
    const titleEl = el.querySelector('.title_main > p:first-child, .title_main_br > p:first-child')
    const title = titleEl.textContent

    titleBlockEl.addEventListener('dblclick', () => {
      console.log(title)

      const ws = new WebSocket('ws://localhost:2233')
      ws.onopen = () => {
        ws.send(title)
        ws.close()
      }

      if (!titleBlockEl.querySelector('.checked-anime')) {
        const el = document.createElement('div')
        el.classList.add('checked-anime')
        el.style.position = 'absolute'
        el.style.top = '2px'
        el.style.right = '2px'
        el.textContent = '✅'
        titleBlockEl.style.position = 'relative'
        titleBlockEl.append(el)
      }
    })
  })

})();
