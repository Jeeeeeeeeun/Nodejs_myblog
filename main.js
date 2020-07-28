var express = require('express');
var app = express();
const port = 3000
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('path');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');
const bodyParser = require('body-parser');
const { response } = require('express');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('*', (request, response, next) => { 
    fs.readdir('./data', (error, filelist) => {
      request.list = filelist; 
      next();
    })
  })


// ROUTING

// HOME
app.get('/', function(req, res) {
    var title = "나의 다이어리";
    var description = "Node.js로 구현한 나의 일기장";
    var list = template.list(req.list);

    var body = `<h2>${title}</h2>${description} 
        <br><br> <img src="/images/my_img.jpg" style="width:300px; display:block; margin:0px auto;">`;
    var control = `<button onclick='location.href="/create"'>새글쓰기</a>`;
    var html = template.HTML(title, list, body, control);
    res.send(html);
});


//READ
app.get('/page/:pageId', (request, response, next) => { 
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err) {
        next(err);
        }
        else{
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
        });
        var list = template.list(request.list);

        var body =  `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`;
        var control =  ` <button onclick="location.href='/create'">새글쓰기</button>
        <button onclick='location.href="/update/${sanitizedTitle}"'>수정하기</button>
        <form action="/delete" method="post" style="display:inline;">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input id="del" type="submit" value="삭제하기">
        </form>`;

        var html = template.HTML(sanitizedTitle, list, body, control);
        response.send(html);
        }
    });
});


//CREATE - GET
app.get('/create', (request, response) => { 
    var title = 'WEB - create';
    var list = template.list(request.list);
    var body = `
        <form action="/create" method="post">
        <p><input id="title" type="text" name="title" placeholder="title"></p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input id="sub_button" type="submit" onclick="return log();" value="글쓰기">
        </p>
        </form>
        `
    var control = '';

    var html = template.HTML(title, list, body, control);
    response.send(html);
});


//CREATE - POST
app.post('/create', (request, response) => { 
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/page/${title}`);
    });
});


//UPDATE - GET
app.get('/update/:pageId', (request, response) => { 
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var list = template.list(request.list);
        var body = `
            <form action="/update" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input id="title" type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                <input id="sub_button" type="submit">
                </p>
            </form>
            `;
        var control =  `<button onclick='location.href="/create"'>create</button> <button onclick='location.href="/update/${title}"'>update</button>`;

        var html = template.HTML(title, list, body, control);
        response.send(html);
    });
});


//UPDATE - POST
app.post('/update', (request, response) => { 
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;

    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/page/${title}`);
        });
    });
});
  

//DELETE
app.post('/delete', (request, response) => { 
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
    });
});


//ERROR
app.use((request, response, next) => {
    response.status(404).send(" 페이지를 찾을 수 없습니다 ;-( ");
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));