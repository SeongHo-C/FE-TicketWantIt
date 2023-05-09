function loadingSpinner(e) {
  e.preventDefault();
  
  const spinnerModal = `
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
  `
  const spinnerModalWrap = document.createElement('div');
  spinnerModalWrap.className = 'spinnerWrap';
  spinnerModalWrap.innerHTML = spinnerModal;
  document.body.appendChild(spinnerModalWrap);
  
  setTimeout(() => {
    spinnerModalWrap.style.display = "none";
  }, 500);
}

window.addEventListener('load', loadingSpinner);

/*
window.addEventListener('load', () => {
  spinnerModalWrap.style.display = 'none';
});
}

loadingSpinner();
*/