function readURL(input, preview) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            preview.src =  e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}
function configure_form(obj)
{

    let form = document.querySelector('.post_form');
    form.action = '/posts/'+obj.id;
    form.style.display = 'block';
    let title = form.querySelector('input[name="title"]');
    let description = form.querySelector('textarea[name="description"]');
    let file = form.querySelector('input[name="thumbnail"]');
    let text = form.querySelector('textarea[name="text"]');
    let preview = form.querySelector('img');
    title.value = obj.title;
    description.value = obj.description;
    text.value = obj.text;
    preview.src = obj.img;

    file.addEventListener('change', (e)=>{
        let f = file.files[0];
        if (f && f['type'].split('/')[0] === 'image'){
            readURL(file, preview);
        }
        else
        {

            alert('Пожалуста, загрузите изображение');
            file.value = null;
        }

    });
    file.required = obj.id === 'new';

}

(function() {
    document.querySelector('.add_post').addEventListener('click', ()=>{

        configure_form({
            title:'',
            description:'',
            text: '',
            img:'',
            id: 'new'
        })
    });
})();

(function() {
    let posts = document.querySelectorAll('.admin_posts_post');
    posts.forEach((el)=>{
        let change =  el.querySelector('.admin_post_col_controls-change');
        if (!change) {
            return;
        }
        change.addEventListener('click', ()=>{
            let text = el.dataset.text;
            let id = el.dataset.id;
            let title = el.dataset.title;
            let description = el.dataset.description;
            let img = el.querySelector('.admin_post_col_img-image').src;
            configure_form({
                id: 'update/'+id,
                title:title,
                description: description,
                img: img,
                text: text
            })
        });
    });
})();
