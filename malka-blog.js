var model = false;
var screen_ = false;

function Model ()
{
	console.log('class-defenition Model start');
 	//содержит список постов и комментариев	
this.data = {0: {id:0, type: "post", text: "post1", title: "title post 1", comments: {0:{id:0, text: "comment to post 1"},1:{id:1, text: "comment to post 1_1"} } },
 
            1: {id:1, type: "post", text: "post2", title: "title post 2", comments:{0:{id:0, text: "comment to post 2" }}},
			
			2: {id: 2, type: "post", text: "post3", title: "title post 3", comments:{0:{id:0, text: "comment to post 3"  }, 1:{id:1, text: "comment to post 3_1"  }}},
                           
			};
					   
	this.postList = [];
	this.max_post_id = 3;
	this.max_comment_id = 5;
	
	// загружает дату 
	this.load_data = function(data) 
	{  
		console.log('model.load_data/*data*/ start');
		this.data = data;// присваивает дату 
		this.postList = model.posters_for_all_pages();
		this.update_max_post_id(); // обновляет счетчик максимального количества записей
		//console.log("model.load_data end, postList: " + this.postList + "max_post_id: " + this.max_post_id);
		
	}
	
	// возвращает список всех постов 
	this.posters_for_all_pages = function () 
	{
		console.log('model.posters_for_all_pages start');
		var posts = [];
		for (var key in this.data) 
		{
			posts.push (this.data[key]);
		}
		//posts = posts.reverse();
		
		return posts;
	}
	
	//возвращает список всех комментов к данному посту
	this.comments_to_post = function (post_id)
	{
		var comments_list = [];
		for (key in this.postList[post_id].comments)
		{
			comments_list.push (this.postList[post_id].comments[key]);
		}
		return comments_list;
	}
	
	//обновляет максимальное количество постов (нужно для добавления id к следующему посту)
	this.update_max_post_id = function () //вызывается из model.load_data 
	{
		console.log('model.update_max_post_id start');
		var max_ = -1;
		for (key in this.data)
		{
			key = parseInt (key);
			if (max_<key) 
			{
			   max_ = key
			};
		}
		this.max_post_id = max_;
	}
	
	//обновляет максимальное количество комментариев (нужно для добавления id к следующему комментарию)
	this.update_max_comment_id = function (post_id) //
	{
		console.log('model.update_max_comment_id start');
		var max_ = -1;
		for (key in this.data[post_id].comments)
		{
			key = parseInt (key);
			if (max_<key) 
			{
			   max_ = key
			};
		}
		this.max_comment_id = max_;
	}
	
	//сохранение поста 
	this.save_post = function () 
	{
		console.log('model.save_post start');
		var new_post_id = this.max_post_id+1;
		var input_title = $("#title").val();
		var input_text = $("#textarea").val();
		var new_post = {id: new_post_id, type: "post", text: input_text, title: input_title, comments: {}};
						
		this.data[new_post_id]=new_post;
		this.max_post_id=new_post_id;
			
		this.postList = this.posters_for_all_pages();
			
		$("#new_root_post_form").html("");
		screen_.show_posts_from_root(model.postList);
			
	}
	
	//сохранение отредактированного поста
	this.save_edited_post = function(post_id)
	{
		console.log('model.save_edited_post start');
		console.log('post_id: ' + post_id);
		console.log('model.data ['+ post_id+'].text: ' + model.data [post_id].text);
		var input_title = $("#title").val();
		var input_text = $("#textarea").val();
		model.data [post_id].title = input_title;
		model.data [post_id].text = input_text;
		console.log('model.data ['+ post_id+'].text: ' + model.data [post_id].text);
		
		$(".post_text").html("");
		screen_.show_posts_from_root(model.postList);
	}
	
	//удаление поста, принимает id поста
	this.delete_post = function (post_id)
    {
		console.log('model.delete_post /*post_id*/ start');
		delete this.data [post_id];
		
        this.update_max_post_id();
		this.postList = this.posters_for_all_pages();
		screen_.show_posts_from_root(model.postList);
     //this.to_storage();
	}
	
	//сохранение комментария
	this.save_comment = function (post_id) 
	{
		console.log('model.save_comment start, post_id: ' + post_id);
			this.update_max_comment_id(post_id);
			console.log("max_comment_id: "+  this.max_comment_id);
		
			var new_comment_id = this.max_comment_id+1;
			console.log("new_comment_id: " + new_comment_id);
			var input_text = $("#textarea").val();
			var new_comment = {id: new_comment_id, text: input_text};
						
			this.postList[post_id].comments[new_comment_id] = new_comment;
			for (key in model.postList[post_id].comments)
			{console.log("post_id: "+ post_id + " comments keys:" + key);
			}
			
			this.max_comment_id=new_comment_id;
			this.postList = this.posters_for_all_pages();
			$("#new_post_form"+post_id).html("");
		    screen_.show_posts_from_root(model.postList);
			
	}
};


function Screen () 
{
	//показ блога на странице 
	this.show_posts_from_root = function (postList)
	{
		console.log("screen.show_posts_from_root start, postList: " + postList);
		var title = "";
		var title_html="";
		var posts_html="";
		for (var i = postList.length-1; i >= 0; i--) //(var i=0; i<postList.length; i++)
		{
			console.log("i: " + i );
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
				var comments_list = model.comments_to_post(i);
				var comments_html ="";
				for (var key = comments_list.length-1; key >= 0; key--)//key in postList[i].comments
				{	
					console.log("show_posts for, postList[ " + i + "], key: " + key);
					var comment = postList[i].comments[key].text;
					console.log("postList[ " + i + "].comments[" + key + "].text: " + comment);
					var comment_id = postList [i].comments[key].id;
					//console.log("show_posts for, postList[ " + i + "].comments[" + key + "].id: " + comment_id);
					comments_html += '<div class="comments" id="comment'+i+comment_id+'">'+comment+'</div>';
					
				}
			}
			
			title_html = '<div class="title">' + title + '</div>';
		
		    posts_html +='<div class="post" id="post'+postList[i].id+'">'+ title_html +
						'<div class="post_text">'+ postList[i].text + '</div>'+
						'<div class="buttons">'+
						  '<div class="button edit_button" id="edit'+postList[i].id+'" onclick="edit_click('+postList[i].id+');">Edit </div>'+
						  '<div class="button delete_button" id="delete'+postList[i].id+'" onclick="delete_click('+postList[i].id+');">Delete </div>'+
						  '<div class="button comment_button" id="comment'+postList[i].id+'" onclick="comment_click('+postList[i].id+', \'new_post_form'+postList[i].id+'\');">Comment</div>'+
					   '</div>'+
						'<div class="new_post_form" id="new_post_form'+postList[i].id+'">'+
						comments_html+'</div></div>';
			//console.log("postList[i].comments.length:"+postList[i].comments);

	    }
		console.log("show_posts_from_root end");
		
		$("#posts").html ( posts_html);
		
	}
		
		
	//открыть форму добавления поста
	this.add_post_form = function ()
	{
		console.log("screen.add_post_form start");
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
	
	//открыть форму добавления комментария
	this.add_comment_form = function (post_id)
	{
		console.log("screen.add_post_form start");
		var input_title_html='<input type="text" id="title">';
		$("#new_post_form"+post_id).html( input_title_html +
						  '<textarea id="textarea" name="post"></textarea>'+//why need name
						  '<div class="buttons">'+
						  '<div class="button" onclick="save_comment_click();">Save</div>'+
						  '<div class="button" onclick="hide_comment_form();">Cancel</div>'+
						  '</div>');
		$("#textarea").cleditor();
		//this.update_buttons();
	}
	
	//спрятать форму 
	this.hide_comment_form = function ()
	{
		console.log("screen.hide_form start");
		$(".new_post_form").html("");
	}
	
	//открыть форму редактирования поста
	this.show_edit_form = function (post_id)
	{
		console.log("screen.show_edit_form start, post_id: " + post_id);
		var post = model.data [post_id];
		console.log("model.data [post_id]: " + model.postList [post_id]); 
		 
		
		$("#post"+post.id+'>.post_text').html('<textarea id="textarea" name="post">'+post.text+'</textarea>'+
							'<div class="buttons">'+
							'<div class="button" class="save_button" onclick="save_post_click('+post_id+');">Save</div>'+
							'<div class="button" class="cancel_button" onclick="cancel_click();">Cancel</div>'+
							'</div>');
		
		$("#post"+post.id+'>.title').html('<input type="text" name="title" id="title", value="'+post.title+'">');
		
	  $("#textarea").cleditor();
	  //this.update_buttons();
	}
	
	
	
	
};

function add_new_post_click ()
{ 
	console.log("add_new_post_click start");
	screen_.add_post_form();
    
}

function save_post_click (post_id)
{
	console.log("save_post_click start, post_id: " + post_id);
	if ($("#textarea").val()||$("#title").val())
	{
		console.log("save_post_click value, post_id: " + post_id);
		
		if(post_id===undefined)
		{
			console.log("post_id===undefined  " + post_id);
			model.save_post();
			
		}
		
		else 
		{
			console.log("post_id !== undefined  " + post_id);
			model.save_edited_post(post_id);
		}
		//;
	}
}

function edit_click (post_id)
{
	console.log("edit_click start");
	//model.to_edit_mode (post_id);
	screen_.show_edit_form (post_id);
	
}

function cancel_click ()
{
	console.log("cancel_click start");
	screen_.hide_form();
}

 function delete_click (post_id)
{
	console.log("delete_click start");
	
		if (confirm ('Are you sure?')) 
		{
			model.delete_post(post_id);
			
			screen_.show_posts_from_root(model.postList);
					
		}
	console.log("delete_click end ");
}
 
 function comment_click (post_id)
{	
	console.log("comment_click  start");
	//model.add_post_form (post_id);
	screen_.add_comment_form(post_id);
}

function save_comment_click (post_id)
{
	console.log("save_comment_click start");
	if ($("#textarea").val()||$("#title").val())
	{
		model.save_comment(post_id);
		//screen_.hide_form_show_posts();
	}
}
$(document).ready(function()
{ 
	console.log('document.ready start');
	model = new Model ();
	screen_ = new Screen ();
	model.load_data(model.data);
	screen_.show_posts_from_root(model.postList);
	
	$("#add_post_button").click (function () {screen_.add_post_form()});//add_new_post_click();
	
});