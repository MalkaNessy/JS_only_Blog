var model = false;
var screen_ = false;

function Model ()
{
	console.log('class-defenition Model start');
 	//содержит список постов и комментариев	
this.data = {0: {id:0, type: "post", text: "post1", title: "title post 1", comments: {0:{id:3, text: "comment to post 1"},1:{id:6, text: "comment to post 1_2"} } },
 
            1: {id:1, type: "post", text: "post2", title: "title post 2", comments:{0:{id:4, text: "comment to post 2" }}},
			
			2: {id: 2, type: "post", text: "post3", title: "title post 3", comments:{0:{id:5, text: "comment to post 3"  }}},
                           
			};
	
	/* this.data = {0: {id:0, type: "post", text: "post1", title: "title post 1", par_id: -1}, 
               1: {id:1, type: "comment", text: "comment to post1", par_id: 0},
               6: {id:6, type: "comment", text: "comment to post1_2", par_id: 0},
               2: {id: 2, type: "post", text: "post2", title: "title post 2", par_id: -1},
               3: {id: 3, type: "comment", text: "comment to post 2", par_id: 2},
               4: {id: 4, type: "post", text: "post3", title: "title post 3", par_id: -1},
               5: {id:5, type: "comment", text: "comment to post 3", par_id: 4}
               }; */
			   
	this.postList = [];
	
	
	// загружает дату 
	this.load_data = function(data) 
	{  
		console.log('model.load_data/*data*/ start');
		this.data = data;// присваивает дату 
		postList = model.posters_for_all_pages();
		console.log("model.load_data end, postList: " + postList);
		
	}
	
	// возвращает список всех постов (не комментариев)
	this.posters_for_all_pages = function () 
	{
		console.log('model.posters_for_all_pages start');
		var posts = [];
		for (var key in this.data) 
		{
			posts.push (this.data[key]);
		}
		posts = posts.reverse();
		console.log("posters_for_all_pages, posts: " + posts);
		return posts;
	}
	
	//показывает комментарии к данному посту
	this.comments_to_show_list = function (post_id)
	{
		console.log('model.comments_to_show_list /*post_id*/ start');
		var comments = [];
		for (var key in this.data) {
			if (this.data[key].par_id == post_id)
			{
				comments.push (this.data[key]);
			}
		}
		comments = comments.reverse();
		return comments;
    }
	
	//сохранение поста или комментария //save max post id
	this.save_post = function () 
	{
		console.log('model.save_post start');
		this.search_= false;//?/? maybe only add
		if (this.mode.name =='add') 
		{
			var new_post_id = this.max_post_id+1;
			var par_id = this.mode.par_id;
			var input_title = $("#title").val();
			var input_text = $("#textarea").val();
					   
			if (par_id==-1)
			{ 
				var new_post = {id: new_post_id, type: "post", text: input_text, title: input_title, par_id: par_id};
			}
			else
				new_post = {id: new_post_id, type: "comment", text: input_text, par_id: par_id};
			
			this.to_read_mode();
			this.data[new_post_id]=new_post;
			this.max_post_id=new_post_id;
			if (par_id==-1) {
			  this.update_posters();
			  this.go_to_page(1);
			}
			this.to_storage();
		}

		if (this.mode.name=='edit') {
			var post_id = this.mode.post_id;
			this.to_read_mode ();//delete all the object, not just change the state
			this.data[post_id].title = $("#title").val();
			this.data[post_id].text = $("#textarea").val();
			this.to_storage();
		}
	}
	
};


function Screen () 
{
	//показ блога на странице 
	this.show_posts_from_root = function ()
	{
		console.log("screen.show_posts_from_root start");
		var title = "";
		var title_html="";
		
		//var comments_html="comments here";
		var posts_html="";
		for (var i=0; i<postList.length; i++)
		{
			console.log("postList[i] " + postList[i]);
			if (postList[i].title) 
			{
				title = postList[i].title;
			}
			else 
			{
				title = "***";
			}
			if (postList[i].comments)
			{
				var comments_html ="";
				for (key in postList[i].comments)
				{
					
					console.log(" for start, i = " + i + ", key: " + key);
					var comment = postList[i].comments[key].text;
					
					console.log("var comment: " + comment);
					comments_html += '<div class="comments">'+comment+'</div>';
					console.log("for comment_html: " + comments_html);
					
				}
				
			}
			
			title_html = '<div class="title">' + title + '</div>';
		
		    posts_html += title_html +
						'<div class="post_text">'+ postList[i].text + '</div>'+
						'<div class="buttons">'+
						  '<div class="button edit_button" id="edit'+postList[i].id+'" onclick="edit_click('+postList[i].id+');">Edit </div>'+
						  '<div class="button delete_button" id="delete'+postList[i].id+'" onclick="delete_click('+postList[i].id+');">Delete </div>'+
						  '<div class="button comment_button" id="comment'+postList[i].id+'" onclick="comment_click('+postList[i].id+', \'new_post_form'+postList[i].id+'\');">Comment</div>'+
					   '</div>'+
						'<div class="new_post_form" id="new_post_form'+postList[i].id+'"></div>'+
						comments_html;
						

	    }
	
		$("#posts").html (posts_html);
		//return ;
	}
		
		
	
		


	//показ постов на странице
	this.show_posts = function (posts_to_show)
	{
		console.log("screen.show_posts start");
		if (posts_to_show.length==0) 
		{
			return "";
		}
		else
		{
			var posts_html='';
			var post = {};
			for (var i=0; i<posts_to_show.length; i++)
			{
				post = posts_to_show[i];
				posts_html=posts_html+'<div class="'+post.type+'" id="post'+post.id+'">'+this.show_post(post)+'</div>';
			}
		}
   
		return posts_html;
	}

	//показ одного поста
	this.show_post = function (post)
	{
		console.log("screen.show_post start");
		var title = "";
		var title_html="";
		var comments = model.comments_to_show_list(post.id);
		var comments_html="";
		if (comments.length > 0)
		{ 
			comments_html = 'Comments: <br>' + this.show_posts(comments);
		}
		if (post.type == "post") 
		{
			if (post.title) 
			{
				title = post.title;//later remake with prototype!!!!!!!
			}
			else 
			{
				title = "***";
			}
			title_html = '<div class="title">' + title + '</div>';
		}
		var post_html = title_html+
						'<div class="post_text">'+ post.text + '</div>'+
						'<div class="buttons">'+
						  '<div class="button edit_button" id="edit'+post.id+'" onclick="edit_click('+post.id+');">Edit </div>'+
						  '<div class="button delete_button" id="delete'+post.id+'" onclick="delete_click('+post.id+');">Delete </div>'+
						  '<div class="button comment_button" id="comment'+post.id+'" onclick="comment_click('+post.id+', \'new_post_form'+post.id+'\');">Comment</div>'+
					   '</div>'+
						'<div class="new_post_form" id="new_post_form'+post.id+'"></div>'+
						'<div class="comments">'+comments_html+'</div>';

	  return post_html;
	}
	
	
	//открыть форму добавления поста
	this.add_post_form = function ()
	{
		console.log("screen.add_post_form start");
		/* var form_id = "";
		if (model.mode.par_id == -1) 
		{
			var input_title_html='<input type="text" id="title">';
			form_id = "new_root_post_form";
		}
		else 
		{
			input_title_html="";
			form_id = "new_post_form" + model.mode.par_id;
		} 
		var form_id = "new_root_post_form";*/
		var input_title_html='<input type="text" id="title">';
		$("#new_root_post_form").html( input_title_html +
						  '<textarea id="textarea" name="post"></textarea>'+//why need name
						  '<div class="buttons">'+
						  '<div class="button" onclick="save_post_click();">Save</div>'+
						  '<div class="button" onclick="cancel_click();">Cancel</div>'+
						  '</div>');
		$("#textarea").cleditor();
		//this.update_buttons();
	}
	
};

function add_new_post_click ()
{ 
	console.log("add_new_post_click start");
	if (model.search_==false) 
	{
		//model.add_post_form (-1);
		screen_.add_post_form();
    }
}


$(document).ready(function()
{ 
	console.log('document.ready start');
	model = new Model ();
	screen_ = new Screen ();
	model.load_data(model.data);
	screen_.show_posts_from_root();
	
	$("#add_post_button").click (function () {screen_.add_post_form()});//add_new_post_click();
});