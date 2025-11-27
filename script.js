// ===== CẤU HÌNH =====
const MOVIES_PER_PAGE = 8;

const MOVIES = [
  {id:1, title:'Avatar Phần 3', year:2025, genre:'Hành động', rating:9.0, duration:'150 phút', poster:'images/avatar-phan-3.jpg', desc:'Hành trình tiếp theo của tộc Na\'vi.', director:'James Cameron', actors:'Sam Worthington, Zoe Saldana', trailer:'videos/avatar-phan-3.mp4'},
  {id:2, title:'Cúc Zăng Của Ngoại', year:2024, genre:'Hài', rating:7.1, duration:'110 phút', poster:'images/cuc-vang-cua-ngoai.jpg', desc:'Bộ phim vui nhộn nhẹ nhàng.', director:'Vũ Ngọc Phượng', actors:'Thái Hòa, Thu Trang', trailer:'videos/cuc-zang-cua-ngoai.mp4'},
  {id:3, title:'Flow', year:2023, genre:'Hoạt hình', rating:7.8, duration:'95 phút', poster:'images/flow.jpg', desc:'Dòng chảy của số phận và lựa chọn.', director:'Gints Zilbalodis', actors:'Animated cast', trailer:'videos/flow.mp4'},
  {id:4, title:'Jurassic World – Cuộc Chiến', year:2024, genre:'Hành động', rating:8.4, duration:'132 phút', poster:'images/jurassic.jpg', desc:'Khủng long quay lại thống trị trái đất.', director:'Colin Trevorrow', actors:'Chris Pratt, Bryce Dallas Howard', trailer:'videos/jurassic.mp4'},
  {id:5, title:'Năm Đêm Kinh Hoàng 2', year:2023, genre:'Kinh dị', rating:7.4, duration:'100 phút', poster:'images/nam-dem-kinh-hoang-2.jpg', desc:'Những đêm kinh hoàng tiếp tục.', director:'Emma Tammi', actors:'Josh Hutcherson', trailer:'videos/nam-dem-kinh-hoang-2.mp4'},
  {id:6, title:'Ngày Xưa Một Chuyện Tình', year:2022, genre:'Tình cảm', rating:8.0, duration:'118 phút', poster:'images/ngay-xua-co-mot-chuyen-tinh.jpg', desc:'Một chuyện tình nhẹ nhàng và cảm động.', director:'Victor Vũ', actors:'Miu Lê, Song Luân', trailer:'videos/ngay-xua-mot-chuyen-tinh.mp4'},
  {id:7, title:'Quán Kỳ Nam', year:2023, genre:'Kịch tính', rating:7.9, duration:'104 phút', poster:'images/quan-ky-nam.jpg', desc:'Một nhiệm vụ nguy hiểm đầy thử thách.', director:'Lương Đình Dũng', actors:'Hứa Vĩ Văn', trailer:'videos/quan-ky-nam.mp4'},
  {id:8, title:'Tử Chiến Trên Không', year:2023, genre:'Kịch tính', rating:8.2, duration:'140 phút', poster:'images/Tu-Chien-Tren-Khong.jpg', desc:'Cuộc chiến căng thẳng trên bầu trời.', director:'Joseph Kosinski', actors:'Tom Cruise', trailer:'videos/tu-chien-tren-khong.mp4'},
  {id:9, title:'Thám Tử Kiến', year:2023, genre:'Kinh dị', rating:7.2, duration:'102 phút', poster:'images/tham-tu-kien.jpg', desc:'Những bí ẩn rợn người trong khu rừng.', director:'Jordan Peele', actors:'Unknown', trailer:'videos/tham-tu-kien.mp4'},
  {id:10, title:'Trốn Chạy Tử Thần', year:2022, genre:'Hành động', rating:7.5, duration:'115 phút', poster:'images/Tron-chay-tu-than.jpg', desc:'Cuộc chạy trốn khốc liệt để sinh tồn.', director:'David R. Ellis', actors:'Jason Statham', trailer:'videos/tron-chay-tu-than.mp4'},
  {id:11, title:'Truy Tìm Long Diên Hương', year:2025, genre:'Hài', rating:7.6, duration:'108 phút', poster:'images/truy-tim-long-dien-huong.jpg', desc:'Hành trình tìm kho báu bí ẩn.', director:'Lý Hải', actors:'Trường Giang', trailer:'videos/truy-tim-long-dien-huong.mp4'},
  {id:12, title:'Yêu Nhầm Bạn Thân', year:2021, genre:'Tình cảm', rating:7.9, duration:'105 phút', poster:'images/yeu-nham-ban-than.jpg', desc:'Một chuyện tình dễ thương nhưng đầy giằng xé.', director:'Victor Vũ', actors:'Midu, Harry Lu', trailer:'videos/yeu-nham-ban-than.mp4'},
  {id:13, title:'Zootopia 2', year:2024, genre:'Hoạt hình', rating:8.3, duration:'112 phút', poster:'images/zootopia2.jpg', desc:'Nick và Judy trở lại trong cuộc phiêu lưu mới.', director:'Disney', actors:'Ginnifer Goodwin, Jason Bateman', trailer:'videos/zootopia2.mp4'}
];
const GENRES = ['Tất cả', ...Array.from(new Set(MOVIES.map(m=>m.genre)))];

// ===== STATE & DOM =====
let state = { filterGenre:'Tất cả', search:'', page:1 };

const genreListEl = document.getElementById('genre-list');
const moviesGridEl = document.getElementById('movies-grid');
const moviesTitleEl = document.getElementById('movies-title');
const searchEl = document.getElementById('search');
const paginationEl = document.getElementById('pagination');
const modalEl = document.getElementById('modal');
const modalBody = modalEl.querySelector('.modal-body');
const template = document.getElementById('movie-card-template');

// ===== INIT =====
function init(){
  renderGenres();
  loadStateFromURL();
  renderMovies();
  bindEvents();
  restoreFavoritesUI();
}

// ===== GENRES =====
function renderGenres(){
  genreListEl.innerHTML = '';
  GENRES.forEach(g=>{
    const btn = document.createElement('button');
    btn.className = 'genre-btn';
    if(g===state.filterGenre) btn.classList.add('active');
    btn.textContent = g;
    btn.addEventListener('click', ()=>{
      state.filterGenre=g;
      state.page=1;
      document.querySelectorAll('.genre-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      updateURL();
      renderMovies();
    });
    genreListEl.appendChild(btn);
  });
}

// ===== FILTER =====
function getFilteredMovies(){
  const s = state.search.trim().toLowerCase();
  return MOVIES.filter(m=>{
    const matchGenre = state.filterGenre==='Tất cả' ? true : m.genre===state.filterGenre;
    const actors = m.actors || '';
    const director = m.director || '';
    const matchSearch = s==='' ? true : (m.title.toLowerCase().includes(s) || actors.toLowerCase().includes(s) || director.toLowerCase().includes(s));
    return matchGenre && matchSearch;
  });
}

// ===== MOVIES GRID =====
function renderMovies(){
  const list = getFilteredMovies();
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total/MOVIES_PER_PAGE));
  if(state.page>pages) state.page=pages;

  const start = (state.page-1)*MOVIES_PER_PAGE;
  const subset = list.slice(start,start+MOVIES_PER_PAGE);

  moviesGridEl.innerHTML='';
  if(subset.length===0){
    moviesGridEl.innerHTML='<p>Không tìm thấy phim nào.</p>';
  } else {
    subset.forEach(m=>{
      const node = template.content.cloneNode(true);
      node.querySelector('.card-poster').src=m.poster;
      node.querySelector('.card-title').textContent=m.title;
      node.querySelector('.card-meta').textContent=`${m.year} • ${m.genre} • ${m.duration}`;

      node.querySelector('.btn-details').onclick=()=>openModal(m);
      node.querySelector('.btn-trailer').onclick=()=>openModal(m);

      const favBtn = node.querySelector('.fav-btn');
      favBtn.onclick=(e)=>{ e.stopPropagation(); toggleFavorite(m.id,favBtn); };
      if(isFavorite(m.id)) favBtn.classList.add('active');

      moviesGridEl.appendChild(node);
    });
  }

  moviesTitleEl.textContent = state.filterGenre==='Tất cả' ? 'Phim nổi bật' : `Thể loại: ${state.filterGenre}`;
  renderPagination(pages);
}

// ===== PAGINATION =====
function renderPagination(pages){
  paginationEl.innerHTML='';
  if(pages<=1) return;
  for(let i=1;i<=pages;i++){
    const btn = document.createElement('button');
    btn.className='page-btn';
    btn.textContent=i;
    if(i===state.page) btn.style.opacity='0.6';
    btn.onclick=()=>{ state.page=i; updateURL(); renderMovies(); window.scrollTo({top:0,behavior:'smooth'}); };
    paginationEl.appendChild(btn);
  }
}

// ===== MODAL =====
function openModal(m){
  modalBody.innerHTML = `
    <img class="modal-poster" src="${m.poster}" alt="${m.title}">
    <div class="modal-info">
      <h2>${m.title} (${m.year})</h2>
      <p><strong>Đạo diễn:</strong> ${m.director || 'Đang cập nhật'}</p>
      <p><strong>Diễn viên:</strong> ${m.actors || 'Đang cập nhật'}</p>
      <p><strong>Thời lượng:</strong> ${m.duration || 'Đang cập nhật'}</p>
      <p style="margin-top:8px">${m.desc}</p>
      <p style="margin-top:8px"><strong>Đánh giá:</strong> ${m.rating}/10</p>
      <video controls width="100%" style="border-radius:8px; margin-top:12px">
        <source src="${m.trailer}" type="video/mp4">
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      <button id="fav-modal" class="btn-details" style="margin-top:12px">❤ Thêm vào yêu thích</button>
    </div>
  `;

  const favBtn = document.getElementById('fav-modal');
  if(isFavorite(m.id)) favBtn.textContent='❤ Đã yêu thích';
  favBtn.addEventListener('click', ()=>{
    toggleFavorite(m.id);
    favBtn.textContent=isFavorite(m.id)?'❤ Đã yêu thích':'❤ Thêm vào yêu thích';
  });

  modalEl.setAttribute('aria-hidden','false');
}

function closeModal(){
  modalEl.setAttribute('aria-hidden','true');
  modalBody.innerHTML='';
}

// ===== FAVORITES =====
const FAVORITES_KEY='filmview_favs';
function getFavorites(){ return JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]'); }
function saveFavorites(arr){ localStorage.setItem(FAVORITES_KEY,JSON.stringify(arr)); }
function isFavorite(id){ return getFavorites().includes(id); }
function toggleFavorite(id,btnEl){
  const f=getFavorites();
  const idx=f.indexOf(id);
  if(idx===-1) f.push(id); else f.splice(idx,1);
  saveFavorites(f);
  if(btnEl) btnEl.classList.toggle('active');
  restoreFavoritesUI();
}
function restoreFavoritesUI(){
  document.querySelectorAll('.fav-btn').forEach(b=>{
    const title=b.closest('.card').querySelector('.card-title').textContent;
    const m=MOVIES.find(x=>x.title===title);
    if(m && isFavorite(m.id)) b.classList.add('active'); else b.classList.remove('active');
  });
}

// ===== EVENTS =====
function bindEvents(){
  searchEl.oninput=()=>{ state.search=searchEl.value; state.page=1; updateURL(); renderMovies(); };
  document.getElementById('modal-close').onclick=closeModal;
  modalEl.onclick=(e)=>{ if(e.target===modalEl) closeModal(); };
  document.getElementById('btn-home').onclick=()=>document.getElementById('hero').scrollIntoView({behavior:'smooth'});
  document.getElementById('btn-genres').onclick=()=>document.getElementById('genres-section').scrollIntoView({behavior:'smooth'});
  window.onpopstate=()=>{ loadStateFromURL(); renderMovies(); };
}

// ===== URL =====
function updateURL(){
  const p=new URLSearchParams();
  if(state.filterGenre!=='Tất cả') p.set('genre',state.filterGenre);
  if(state.search) p.set('q',state.search);
  if(state.page>1) p.set('page',state.page);
  history.replaceState({},'',`${location.pathname}?${p.toString()}`);
}
function loadStateFromURL(){
  const p=new URLSearchParams(location.search);
  state.filterGenre=p.get('genre')||'Tất cả';
  state.search=p.get('q')||'';
  state.page=parseInt(p.get('page'))||1;
  searchEl.value=state.search;
}

// ===== START =====
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();
