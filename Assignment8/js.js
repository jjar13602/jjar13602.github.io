function showFilter() {
    const filterForm = document.getElementById('filterContent');
    if (filterForm.style.display === 'none' || filterForm.style.display === '') {
        filterForm.style.display = 'block';
    } else {
        filterForm.style.display = 'none';
    }
}

function showAddNew() {
    const addForm = document.getElementById('newContent');
    if (addForm.style.display === 'none' || addForm.style.display === '') {
        addForm.style.display = 'flex';
    } else {
        addForm.style.display = 'none';
    }
}

function filterArticles() {
    const opinionChecked = document.getElementById('opinionCheckbox').checked;
    const recipeChecked = document.getElementById('recipeCheckbox').checked;
    const updateChecked = document.getElementById('updateCheckbox').checked;

    const articles = document.querySelectorAll('#articleList article');

    articles.forEach(article => {
        const type = article.className;
        if ((type === 'opinion' && opinionChecked) ||
            (type === 'recipe' && recipeChecked) ||
            (type === 'update' && updateChecked)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

function addNewArticle() {
    const title = document.getElementById('inputHeader').value.trim();
    const text = document.getElementById('inputArticle').value.trim();
    
    if (!title || !text) {
        alert('Please fill in both title and text.');
        return;
    }
    
    const opinionRadio = document.getElementById('opinionRadio');
    const recipeRadio = document.getElementById('recipeRadio');
    const lifeRadio = document.getElementById('lifeRadio');
    
    let type, markerText;
    if (opinionRadio.checked) {
        type = 'opinion';
        markerText = 'Opinion';
    } else if (recipeRadio.checked) {
        type = 'recipe';
        markerText = 'Recipe';
    } else if (lifeRadio.checked) {
        type = 'update';
        markerText = 'Update';
    } else {
        alert('Please select an article type.');
        return;
    }
    

    const articleList = document.getElementById('articleList');
    const newArticle = document.createElement('article');
    newArticle.className = type;
    newArticle.id = 'a' + (articleList.children.length + 1); 
    
    newArticle.innerHTML = `
        <span class="marker">${markerText}</span>
        <h2>${title}</h2>
        <p>${text}</p>
        <p><a href="moreDetails.html">Read more...</a></p>
    `;
    
    articleList.appendChild(newArticle);

    document.getElementById('inputHeader').value = '';
    document.getElementById('inputArticle').value = '';
    opinionRadio.checked = false;
    recipeRadio.checked = false;
    lifeRadio.checked = false;
    
    document.getElementById('newContent').style.display = 'none';
}
