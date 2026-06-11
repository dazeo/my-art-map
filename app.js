// ============================================================
//  エリア制限の設定
//  中津川第一発電所周辺に地図を制限する
// ============================================================
const AREA = {
  center: [36.9345, 138.6715],
  minZoom: 13,   // これ以上引けない
  maxZoom: 18,   // これ以上寄れない
  // 移動できる範囲（南西・北東の座標）
  bounds: L.latLngBounds(
    [36.89, 138.62],  // 南西
    [36.98, 138.73]   // 北東
  )
};

// ============================================================
//  作品・スポットデータ
// ============================================================
const artworks = [
  {
    id: 1,
    title: "中津川第一発電所",
    artist: "設計：信越電力株式会社",
    category: "産業遺産・建築",
    year: 1924,
    desc: "大正13年（1924年）竣工の水力発電所。秘境・秋山郷の入口、穴藤（けっとう）に位置する。切明で取り入れた水を約400mの高さから落下させ、最大3万8,950kWを発電。100年を超えた今も現役で稼働し続けている近代化遺産。",
    image: "https://picsum.photos/seed/power1/800/400",
    lat: 36.9340,
    lng: 138.6720
  },
  {
    id: 2,
    title: "穴藤ダム（高野山ダム）",
    artist: "東京電力リニューアブルパワー",
    category: "ダム・土木構造物",
    year: 1924,
    desc: "中津川第一発電所の調整池として建設されたダム。上流面をアスファルトで覆うアスファルトフェイシングフィルダムという珍しい型式。天端は車道として利用されている。",
    image: "https://picsum.photos/seed/dam1/800/400",
    lat: 36.9360,
    lng: 138.6700
  },
  {
    id: 3,
    title: "鉄管路（ペンストック）",
    artist: "信越電力株式会社",
    category: "産業遺産・構造物",
    year: 1924,
    desc: "山肌を急傾斜で走る大型の鉄管。高所から水を導いて発電タービンを回す。周囲の山林と対比するその姿は、大正時代の土木技術の迫力を今に伝える。",
    image: "https://picsum.photos/seed/pipe1/800/400",
    lat: 36.9380,
    lng: 138.6690
  },
  {
    id: 4,
    title: "秋山郷入口・中津川沿い遊歩道",
    artist: "",
    category: "景観・自然",
    year: null,
    desc: "中津川第一発電所周辺は、秘境・秋山郷の玄関口。川沿いの遊歩道から発電所建屋と鉄管路を一望できる。紅葉シーズン（10〜11月）には特に見応えがある。",
    image: "https://picsum.photos/seed/river1/800/400",
    lat: 36.9320,
    lng: 138.6740
  }
];

// ============================================================
//  地図の初期化（エリア制限あり）
// ============================================================
const map = L.map('map', {
  center: AREA.center,
  zoom: 15,
  minZoom: AREA.minZoom,
  maxZoom: AREA.maxZoom,
  maxBounds: AREA.bounds,        // この範囲外にスクロールできない
  maxBoundsViscosity: 1.0,       // 境界で完全に止まる（0〜1）
  zoomControl: false
});

L.control.zoom({ position: 'bottomleft' }).addTo(map);

// OpenStreetMapタイル
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

// ============================================================
//  カスタムピンアイコン
// ============================================================
const artIcon = L.divIcon({
  className: '',
  html: '<div class="art-pin"></div>',
  iconSize: [36, 36],
  iconAnchor: [10, 36],
  popupAnchor: [8, -36]
});

// ============================================================
//  ピンを地図に配置
// ============================================================
artworks.forEach(art => {
  const marker = L.marker([art.lat, art.lng], { icon: artIcon }).addTo(map);
  marker.on('click', () => openPanel(art));
});

// ============================================================
//  詳細パネルの開閉
// ============================================================
const panel         = document.getElementById('panel');
const panelClose    = document.getElementById('panelClose');
const panelImage    = document.getElementById('panelImage');
const panelCategory = document.getElementById('panelCategory');
const panelTitle    = document.getElementById('panelTitle');
const panelArtist   = document.getElementById('panelArtist');
const panelDesc     = document.getElementById('panelDesc');
const panelYear     = document.getElementById('panelYear');

function openPanel(art) {
  panelImage.src            = art.image;
  panelImage.alt            = art.title;
  panelCategory.textContent = art.category;
  panelTitle.textContent    = art.title;
  panelArtist.textContent   = art.artist;
  panelDesc.textContent     = art.desc;
  panelYear.textContent     = art.year ? art.year + '年' : '';
  panel.classList.remove('panel--hidden');
  map.panTo([art.lat, art.lng]);
}

function closePanel() {
  panel.classList.add('panel--hidden');
}

panelClose.addEventListener('click', closePanel);
map.on('click', closePanel);

// ============================================================
//  現在地ボタン
//  ── 現在地を青丸で表示するが、地図の中心は移動しない
//  ── エリア外の場合はメッセージを表示
// ============================================================
const locateBtn = document.getElementById('locateBtn');
let userMarker = null;

locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('このブラウザは現在地取得に対応していません');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      const userLatLng = L.latLng(latitude, longitude);

      // 既存の現在地マーカーを削除
      if (userMarker) map.removeLayer(userMarker);

      // 現在地マーカー（青い丸）を追加
      userMarker = L.circleMarker(userLatLng, {
        radius: 10,
        fillColor: '#4a90e2',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9
      }).addTo(map);

      // エリア内なら現在地へ移動、エリア外なら通知のみ
      if (AREA.bounds.contains(userLatLng)) {
        map.setView(userLatLng, 16);
      } else {
        // エリア外：地図は動かさず、マーカーだけ記録
        userMarker.bindPopup(
          '<div style="font-size:13px;color:#333">現在地はエリア外です<br>発電所周辺の地図を表示しています</div>'
        ).openPopup();
      }
    },
    () => alert('現在地を取得できませんでした。\n位置情報の許可を確認してください。')
  );
});

// ============================================================
//  PWA：Service Worker登録
// ============================================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
