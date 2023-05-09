function loadingSpinner() {
  const spinnerModal = `
        <div class="spinner">
            <div>
              <i class="ri-mail-fill"></i>
            </div>
            <div class='bounce'>
              <div class="loading bounce1"></div>
              <div class="loading bounce2"></div>
              <div class="loading bounce3"></div>
            </div>
        </div>
  `
  const spinnerModalWrap = document.createElement('div');
  spinnerModalWrap.className = 'spinnerWrap';
  spinnerModalWrap.innerHTML = spinnerModal;
  document.body.appendChild(spinnerModalWrap);
  
   window.addEventListener('load', () => {
     spinnerModalWrap.style.display = 'none';
   });
}
  
loadingSpinner();