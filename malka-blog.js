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
					   
	this.postList = [];
	this.max_post_id = 3;
	
	// загружает дату 
	this.load_data = function(data) 
	{  
		console.log('model.load_data/*data*/ start');
		this.data = data;// присваивает дату 
		this.postList = model.posters_for_all_pages();
		this.update_max_post_id(); // обновляет счетчик максимального количества записей
		console.log("model.load_data end, postList: " + this.postList + "max_post_id: " + this.max_post_id);
		
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
	
	//сохранение поста или комментария //save max post id
	this.save_post = function () 
	{
		console.log('model.save_post start');
			var new_post_id = this.max_post_id+1;
			var input_title = $("#title").val();
			var input_text = $("#textarea").val();
			var new_post = {id: new_post_id, type: "post", text: input_text, title: input_title, comments: {}};
			
				//new_post = {id: new_post_id, type: "comment", text: input_text, par_id: par_id};
			
			
			this.data[new_post_id]=new_post;
			console.log("this.data[new_post_id]: " + this.data[new_post_id]);
			this.max_post_id=new_post_id;
			this.postList = this.posters_for_all_pages();
			console.log("save_post new data: " + this.data);
			console.log("save_post postList: " + this.postList);
			$("#new_root_post_form").html("");
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
};


function Screen () 
{
	//показ блога на странице 
	this.show_posts_from_root = function (postList)
	{
		console.log("screen.show_posts_from_root start, postList: " + postList);
		
		var title = "";
		var title_html="";
		
		//var comments_html="comments here";
		var posts_html="";
		for (var i=0; i<postList.length; i++)
		{
			//console.log("postList[i] " + postList[i]);
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
					
					//console.log(" for start, i = " + i + ", key: " + key);
					var comment = postList[i].comments[key].text;
					
					//console.log("var comment: " + comment);
					comments_html += '<div class="comments">'+comment+'</div>';
					//console.log("for comment_html: " + comments_html);
					
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
		console.log("show_posts_from_root end, max_post_id: " + model.max_post_id + " model.postList: " + model.postList+" postList.length:"+postList.length);
		$("#posts").html (posts_html);
		
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
	
	//открыть форму добавления поста
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
};

function add_new_post_click ()
{ 
	console.log("add_new_post_click start");
	screen_.add_post_form();
    
}

function save_post_click ()
{
	console.log("save_post_click start");
	if ($("#textarea").val()||$("#title").val())
	{
		model.save_post();
		//screen_.hide_form_show_posts();
	}
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

$(document).ready(function()
{ 
	console.log('document.ready start');
	model = new Model ();
	screen_ = new Screen ();
	model.load_data(model.data);
	screen_.show_posts_from_root(model.postList);
	
	$("#add_post_button").click (function () {screen_.add_post_form()});//add_new_post_click();
	
});