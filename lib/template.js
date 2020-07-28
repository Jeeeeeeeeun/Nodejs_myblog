module.exports = {
    HTML:function(title, list, body, control){
      return `
      <!doctype html>
      <html>
      <head>
        <title>J BLog - ${title}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/stylesheets/master.css" tpye="text/css">
      </head>
      <body>
        <script>
            function log(text) {
                var str = document.getElementsByTagName("textarea").value;
                str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
                document.getElementsByTagName("textarea").value = str;
            }
        </script>

        <div id="inner">
            <h1><a href="/" id="head_title">J's Blog</a></h1>
            
            <div id="blog_body">
                ${body}
            </div>
        
            <div id="blog_list" style="list-style:none;">
            ${list}
            </div>
            
            
            <div id="control">
            ${control}
            </div>
        </div>
      
      </body>
      </html>
      `;
    },
    
    
    list:function(filelist){
      var list = `<div> <h4>글 리스트</h4>`;
      var i = 0;
      while(i < filelist.length){
        list = list + `<a href="/page/${filelist[i]}">${filelist[i]}</a><br>`;
        i++;
      }
      list = list+'</div>';
      return list;
    }
  }
  