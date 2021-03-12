/* eslint-disable default-case */
// eslint-disable-next-line import/named
import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup } from './lib/map';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const data = await fetchEarthquakes(urlParams.get('type'), urlParams.get('period'));
  const earthquakes = data.data.features;

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  const parent = loading.parentNode;
  parent.removeChild(loading);

  if (!earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  }

  const ul = document.querySelector('.earthquakes');
  const map = document.querySelector('.map');

  let earthquakeInfoText = '';
  switch (urlParams.get('type')) {
    case 'significant':
      earthquakeInfoText += 'Verulegir jarðskjálftar, ';
      break;
    case '4.5':
      earthquakeInfoText += '4,5+ á richter jarðskjálftar, ';
      break;
    case '2.5':
      earthquakeInfoText += '2,5+ á richter jarðskjálftar, ';
      break;
    case '1.0':
      earthquakeInfoText += '1,0+ á richter jarðskjálftar, ';
      break;
    case 'all':
      earthquakeInfoText += 'Allir jarðskjálftar, ';
      break;
  }
  switch (urlParams.get('period')) {
    case 'hour':
      earthquakeInfoText += 'seinustu klukkustund';
      break;
    case 'day':
      earthquakeInfoText += 'seinasta dag';
      break;
    case 'week':
      earthquakeInfoText += 'seinustu viku';
      break;
    case 'month':
      earthquakeInfoText += 'seinasta mánuð';
      break;
  }

  const earthquakeInfo = document.querySelector('h1');
  earthquakeInfo.innerHTML = earthquakeInfoText;

  let cacheInfoText = '';
  if (data.info.cached) {
    cacheInfoText += 'Gögn eru í cache. ';
  } else {
    cacheInfoText += 'Gögn eru ekki í cache. ';
  }
  cacheInfoText += `Fyrirspurn tók ${data.info.elapsed}  sek.`;
  const cacheInfo = document.querySelector('.cache');
  cacheInfo.innerHTML = cacheInfoText;

  init(map);

  earthquakes.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
});
