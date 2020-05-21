(function(){

    let hamburger = document.querySelector('.hamburger');
    let header = document.querySelector('header');

    hamburger.addEventListener('click', ()=>{

        hamburger.classList.toggle('hamburger_close');
        header.classList.toggle('closed');

    });

    window.addEventListener('scroll', ()=> {
        if (pageYOffset>50)
        {
            header.classList.add('scrolling');
        }
        else
        {
            header.classList.remove('scrolling');
        }

    });
})();

(function () {
    document.querySelectorAll('.skills_container_skill_wrap').forEach( el => {
           let text =  el.querySelector('.skills_container_skill_percentage');
           let progress = el.querySelector('.skills_container_skill_progress_show');
           let percentage = progress.getAttribute('progress');
           progress.style.width = percentage+"%";
           let data = 0;
           let interval = setInterval(()=>{

                data++;
               text.innerHTML = data+"%";
               if (data==percentage)
               {
                   clearInterval(interval);
               }
           }, 10);
    });
})();

(function () {
    let container = document.querySelector('.latest_projects_container ');
    document.querySelectorAll('.latest_projects_control').forEach((el, i, arr)=>{

        el.addEventListener('click', (e)=>{
            arr.forEach((c)=>{
                c.classList.remove('latest_projects_control-active');
            });
            arr[i].classList.add('latest_projects_control-active');
            container.style.left = -100*i + "vw";
        });


    });


})();
