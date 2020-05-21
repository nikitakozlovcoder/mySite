(function(){
    let opened = true;
    let hamburger = document.querySelector('.hamburger');
    let header = document.querySelector('header');

    hamburger.addEventListener('click', (e)=>{

        hamburger.classList.toggle('hamburger_close');
        header.classList.toggle('closed');

    });


})();



