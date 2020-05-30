(function(){
    let open = false;
    let hamburger = document.querySelector('.hamburger');
    let header = document.querySelector('header');
    let links = document.querySelector('.header_nav').querySelectorAll('a');

    links.forEach((el)=>{
        el.addEventListener('click', (e)=>{
            if (open)
            {
                hamburger.classList.toggle('hamburger_close');
                header.classList.toggle('closed');
                open = false;
            }

        });
    });

    hamburger.addEventListener('click', ()=>{
        open = !open;
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
function isViewed(el)
{
    if (el.getBoundingClientRect().top < window.innerHeight-65 &&  el.getBoundingClientRect().bottom>65)
    {
        return true;

    }
    return false;
}
(function () {
    let active = false;
    let container_left = document.querySelector('.skills_container-left');
    let container_right = document.querySelector('.skills_container-right');
    window.addEventListener('scroll', ()=>{
        if ((isViewed(container_left) || isViewed(container_right)) && !active)
        {
            active = true;
            document.querySelectorAll('.skills_container_skill_wrap').forEach( el => {
                let text =  el.querySelector('.skills_container_skill_percentage');
                let progress = el.querySelector('.skills_container_skill_progress_show');
                let percentage = progress.getAttribute('progress');

                let data = 0;
                let interval = setInterval(()=>{

                    data++;
                    progress.style.width = data+"%";
                    text.innerHTML = data+"%";
                    if (data==percentage)
                    {
                        clearInterval(interval);
                    }
                }, 20);
            });
        }

    });



})();

(function () {
    let container = document.querySelector('.latest_projects_container ');
    if (container === null)
    {
        return;
    }
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


    function scroll(el) {

        let rect = el.getBoundingClientRect();
        let dist = rect.top + window.pageYOffset;
       // window.scrollTo({top: dist-50, behavior:"smooth"});
        let chank = -(window.pageYOffset -dist)/50;
        let down = true;
        if (window.pageYOffset >dist)
        {
            down = false;

        }

        let interval = setInterval(()=>{

            if (!down && window.pageYOffset === 0)
            {
                clearInterval(interval);
                return;
            }
            if (down && document.body.clientHeight === window.pageYOffset + window.innerHeight)
            {
                clearInterval(interval);
                return;
            }
            if (down && window.pageYOffset+65 >= dist)
            {
                clearInterval(interval);
                return;
            }
            if(!down && window.pageYOffset+50 <= dist)
            {
                clearInterval(interval);
                return;
            }
            window.scrollTo(0, window.pageYOffset+chank);


        }, 10);

    }





(function () {

    let links = Array.from(document.querySelectorAll('a')).filter(link => link.getAttribute( "href" )[0] === '#');
    console.log(links);

    links.forEach((el)=>{

        el.addEventListener('click', (e)=>{
            e.preventDefault();
           scroll(document.querySelector(el.getAttribute('href')));
        });

    })


})();


function animateAll(elems)
{
    elems.forEach((el)=>{

        if (isViewed((el)))
        {
            let time = el.getAttribute('data-time') || 0;

            setTimeout(()=>{
                console.log(time);
                el.classList.add(el.getAttribute('data-animate'));
            }, time)

        }
    })
}

(function () {
    let elems = document.querySelectorAll('.animate__animated');
    animateAll(elems);
    window.addEventListener('scroll', function() {

            animateAll(elems);

    });

})();
(function () {
    let form = document.querySelector('.contact_form');
    if ( form === null) {
        return;

    }

    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        let name = form.querySelectorAll('input')[0].value;
        let mail = form.querySelectorAll('input')[1].value;
        let text = form.querySelector('textarea').value;
        let msg = {
          name: name,
          mail: mail,
          message: text
        };
        mail.value = "";
        name.value = "";
        text.value = "";
        fetch('/sendmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(msg)
        })
    });
})();
