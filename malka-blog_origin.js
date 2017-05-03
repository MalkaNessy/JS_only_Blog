var model = false;
var screen_ = false;

function Model ()
{
	 
	console.log('class-defenition Model start');
 	//содержит список постов и комментариев						
	this.data = {0: {id:0, type: "post", text: "post1", title: "title post 1", par_id: -1}, 
               1: {id:1, type: "comment", text: "comment to post1", par_id: 0},
               6: {id:6, type: "comment", text: "comment to post1_2", par_id: 0},
               2: {id: 2, type: "post", text: "post2", title: "title post 2", par_id: -1},
               3: {id: 3, type: "comment", text: "comment to post 2", par_id: 2},
               4: {id: 4, type: "post", text: "post3", title: "title post 3", par_id: -1},
               5: {id:5, type: "comment", text: "comment to post 3", par_id: 4}
               };
	this.mode = {name: "read"}; //режим (по умолчанию чтения)
	//this.buttons = {"add_new_post_button":true, "comment_button":true, "save_button":true, "cancel_button":true, "edit_button":true, "delete_button":true, "search_button":true}
	this.max_post_id = 6; //показывает сколько всего постов и комментов в дате
	this.current_page = -1; //**
	this.items_on_page = 3;//количество записей на странице **
	this.first_post_to_show = -1; //**
	this.last_post_to_show = -1; //**
	this.pages_exist = false; //**
	this.page_count = -1; //**
	this.search_= false; //**
	this.posters = []; //**
	this.search_input = ""; //**
	
	// загружает дату и подготавливает все для показа на странице
	this.load_data = function(data) 
	{  
		console.log('model.load_data/*data*/ start');
		this.data = data;// присваивает дату 
		//this.update_max_post_id(); // обновляет счетчик максимального количества записей
		this.posters = this.posters_for_all_pages();//проходится по дате, вынимает все посты (не комменты) и возвращает их
		this.update_pages_count();
	}
	
	// возвращает список всех постов (не комментариев)
	this.posters_for_all_pages = function () 
	{
		console.log('model.posters_for_all_pages start');
		var posts = [];
		for (var key in this.data) 
		{
			if (this.data[key].par_id == -1)//if this is a post and not comment. I can write if (type == post)
			{
				posts.push (this.data[key]);
			}
		}
		posts = posts.reverse();
		return posts;
	}
	
	//берет существующую дату и передает в браузер в виде списка с ключом
	this.to_storage = function ()
    {
		console.log('model.to_storage start');
		var model_json_new=JSON.stringify(model.data);
		localStorage.setItem("posters", model_json_new);
    }
	
	// обновляет счетчик максимального количества записей
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
  
	//режим добавления (поста или комментария), принимает id записи (поста или комментария) 
	this.to_add_mode = function (par_id)//вызывается из model.add_post_form
    {
		console.log('model.to_add_mode /*par_id*/ start');
		this.mode = {name: "add", par_id: par_id};
    }
	
	//режим чтения блога	
	this.to_read_mode = function ()
    {
		console.log('model.to_read_mode start');
		this.mode = {name: "read"}//type?????
    }
	
	//режим редактирования (поста или комментария), принимает id поста???
	this.to_edit_mode = function (post_id)
	{
		console.log('model.to_edit_mode /*post_id*/ start');
		this.mode = {name: "edit", post_id: post_id}//type?????
	}

	//удаление поста, принимает id поста
	this.delete_post = function (post_id)
    {
		console.log('this.delete_post /*post_id*/ start');
		delete this.data [post_id];// ??? что это такое
		for (key in this.data) 
		{
			if (this.data[key].par_id==post_id) 
			{
				delete this.data[key];
			}
		} 
     this.update_posters();
     this.to_storage();
	}
	
	
 
	// обновляет список постов, либо отфильтованых, либо всех
	this.update_posters = function () 
	{
		console.log('model.update_posters start');
		if (this.search_) 
		{
			this.posters = this.filter_posts();
		}
		else 
			this.posters = this.posters_for_all_pages();

		this.update_posts_count();
	}

	// обновляет количество постов ??? вызвая обновление количества страниц что это такое
	this.update_posts_count = function () 
	{
		console.log('model.update_posts_count start');
		this.update_pages_count();
	}

	// фильтрация постов
	this.filter_posts = function () //just for title
	{
		console.log('model.filter_posts start');
		var all_posts = this.posters_for_all_pages();//???maybe save to this.posters
		var filtered_posters = [];
		for (var i in all_posts) 
		{
			if (all_posts[i].title.toLowerCase().indexOf(this.search_input.toLowerCase())!=-1||all_posts[i].text.toLowerCase().indexOf(this.search_input.toLowerCase())!=-1)
			{
				filtered_posters.push (all_posts[i]);
			}
		}
		//this.posts_count=filtered_posters.length;
		return filtered_posters;
	}

	
	//возвращает список постов для данной страницы
	this.posts_to_show_list = function ()
    {
		console.log('model.posts_to_show_list start');
		var posts_to_show = this.posters;
		if (this.pages_exist)
		{
			posts_to_show = posts_to_show.slice (this.first_post_to_show, this.last_post_to_show);
		}
		return posts_to_show;
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

	//берет номер страницы и вычисляет ее первый и последний пост
    this.go_to_page = function (pageNum) 
	{
		console.log('model.go_to_page /*pageNum*/ start');
		this.current_page = pageNum;
		this.first_post_to_show = this.items_on_page*(this.current_page-1);
		this.last_post_to_show = this.first_post_to_show+this.items_on_page;
    }

	//обновляет количество страниц //is called every time I change the number of posts
    this.update_pages_count = function () 
	{
		console.log('model.update_pages_count start');
		this.page_count = Math.floor(this.posters.length/this.items_on_page);
		if (this.posters.length % this.items_on_page > 0) 
		{
			this.page_count++;
		}
		
		if (this.posters.length > this.items_on_page) 
		{
			if (!this.pages_exist) 
			{
				this.go_to_page (1);
				this.pages_exist = true;
			}
		}
		else
			this.pages_exist = false;

		if (this.current_page > this.page_count) 
		{
			this.current_page = this.page_count;
		}
		
		this.go_to_page(this.current_page);
    }

	//вызывает функцию, переключающую режим в "добавление"
	this.add_post_form = function (par_id) 
	{
		console.log('model.add_post_form /*par_id*/ start');
		if (this.mode.name=="read") 
		{
			//var new_post_id = this.max_post_id+1;
			this.to_add_mode (par_id);
		}
	}
 
	//принимает инпут, возвращает список отфильтрованных постов
	this.do_search = function (input)
	{
		console.log('model.do_search /*input*/ start');
		this.search_= true;
		this.search_input = input;
		this.update_posters();
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
	 
console.log('class-defenition Model end');
}

function Screen () 
{
	console.log("class-defenition Screen start");

	//закрывает форму редактирования после сохранения поста
	this.hide_form_show_posts = function ()// вызывается save_post_click  
	{
		console.log("screen.hide_form_show_posts start");
		$(".new_post_form").html("");
		this.show_posts_from_root();
	}

	//пагинация ??? что это
	this.pagination = function ()//write pagination myself!!!
	{
		console.log("screen.pagination start");
		$("#pages").pagination({
			items: model.posters.length,
			itemsOnPage:model.items_on_page,
			onPageClick: function (pageNum) 
				{
					console.log("onPageClick:pageNum: " + pageNum)
					model.go_to_page(pageNum);
					screen_.show_posts_from_root();
					model.current_page = pageNum;
					//var start = model.items_on_page*(pageNum-1);
					//var end = start+model.items_on_page;
					// $(posts).hide().slice (start,end).show();
				},
			currentPage:model.current_page,
			cssStyle: 'light-theme'
		});
	}

	//показ блога на странице: посты и пагинация ??? 
	this.show_posts_from_root = function ()
	{
		console.log("screen.show_posts_from_root start");
		var posts_to_show = model.posts_to_show_list();
		$("#posts").html (this.show_posts(posts_to_show));
		if (model.pages_exist)
		{			
			this.pagination ();
		}
		else 
		{
			$("#pages").pagination("destroy");
		}
		this.update_buttons();
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

	//скрыть кнопку "show_all", которая появляется после того как сделан поиск
	this.show_all_button = function ()
	{
		console.log("screen.show_all_button start");
		$("#search_input").val("");
		$(".show_all_button").hide();
	}

	//??? еще одна функция для спрятать форму 
	this.hide_form = function ()
	{
		console.log("screen.hide_form start");
		$(".new_post_form").html("");
	}

	//еще одна функция для спрятать форму  //for cancel button
	this.hide_edit_form = function ()
	{
		console.log("screen.hide_edit_form start");
		var post_id = model.mode.post_id;
		$('#post' + post_id).html(this.show_post(model.data[post_id]));
		/*$('#post'+post_id+'>.title').html(model.data[post_id].title);*/
	}

	//открыть форму добавления поста
	this.add_post_form = function ()
	{
		console.log("screen.add_post_form start");
		var form_id = "";
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
		$("#"+ form_id).html( input_title_html +
						  '<textarea id="textarea" name="post"></textarea>'+//why need name
						  '<div class="buttons">'+
						  '<div class="button" onclick="save_post_click();">Save</div>'+
						  '<div class="button" onclick="cancel_click();">Cancel</div>'+
						  '</div>');
		$("#textarea").cleditor();
		this.update_buttons();
	}

	//открыть форму редактирования поста
	this.show_edit_form = function ()
	{
		console.log("screen.show_edit_form start");
		if (model.mode.name!="edit") 
		{
			return;
		}
		var post_id = model.mode.post_id;
		var post = model.data [post_id];
		$("#post"+post.id+'>.post_text').html('<textarea id="textarea" name="post">'+post.text+'</textarea>'+
							'<div class="buttons">'+
							'<div class="button" class="save_button" onclick="save_post_click();">Save</div>'+
							'<div class="button" class="cancel_button" onclick="cancel_click();">Cancel</div>'+
							'</div>');
		if (post.type=='post')
		{
			$("#post"+post.id+'>.title').html('<input type="text" name="title" id="title", value="'+post.title+'">');
		}
	  $("#textarea").cleditor();
	  this.update_buttons();
	}

	//обновляет scc кнопок, добавляет "disabled" в зависимости от режима
	this.update_buttons = function ()
	{
		console.log("update_buttons start");
		//add-post-button
		if (model.search_)
		{
			$("#add_post_button").addClass("disabled");
		}
		else
		{
			if (model.mode.name=="read")
			  $("#add_post_button").removeClass("disabled");
			else
			  $("#add_post_button").addClass("disabled");
		}
		//comment_button, delete button, edit_button, search_button and show_all_button
		if (model.mode.name=="read") 
		{
			$(".comment_button").removeClass("disabled");
			$(".delete_button").removeClass("disabled");
			$(".edit_button").removeClass("disabled");
			$(".search_button").removeClass("disabled");
			$(".show_all_button").removeClass("disabled");
		}
		else 
		{
			$(".comment_button").addClass("disabled");
			$(".delete_button").addClass("disabled");
			$(".edit_button").addClass("disabled");
			$(".search_button").addClass("disabled");
			$(".show_all_button").addClass("disabled");
		}
	}
	
console.log("class-defenition Screen end");
}

//--callbacks on clicks

function comment_click (post_id)
{	
	console.log("comment_click  start");
	model.add_post_form (post_id);
	screen_.add_post_form();
}

function add_new_post_click ()
{ 
	console.log("add_new_post_click start");
	if (model.search_==false) 
	{
		model.add_post_form (-1);
		screen_.add_post_form();
    }
}

function search_button_click ()
{
	console.log("search_button_click start");
	if (model.mode.name=="read") 
	{
		if ($("#search_input").val()) 
		{
		  var input=$("#search_input").val().toString();
		  model.do_search (input);
		  if (model.posters.length)
			screen_.show_posts_from_root();
		  else
			{
				$("#posts").html("Sorry, couldn't find anything");
				$("#pages").pagination("destroy");
				screen_.update_buttons();
			}
		  $(".show_all_button").show();
		}
	}
}

function show_all_button_click ()
{
	console.log("show_all_button_click start");
	model.search_ = false;
	screen_.show_all_button();
	model.update_posters();
	screen_.show_posts_from_root();
}

function cancel_click ()
{
	console.log("cancel_click start");
	if (model.mode.name =='add')
	{
		model.to_read_mode ();
		screen_.hide_form();
    }
	if (model.mode.name == 'edit')
	{
		screen_.hide_edit_form();
		model.to_read_mode ()
	}
	screen_.update_buttons();
 }

function edit_click (post_id)
{
	console.log("edit_click start");
	if (model.mode.name == 'read') 
	{
		model.to_edit_mode (post_id);
		screen_.show_edit_form ();
	}
}

function delete_click (post_id)
{
	console.log("delete_click start");
	if (model.mode.name == "read") 
	{
		if (confirm ('Are you sure?')) 
		{
			model.delete_post(post_id);
			screen_.show_posts_from_root();
		}
	}
}

function save_post_click ()
{
	console.log("save_post_click start");
	if ($("#textarea").val()||$("#title").val())
	{
		model.save_post();
		screen_.hide_form_show_posts();
	}
}


$(document).ready(function()
{ 
	console.log('document.ready start');
	model = new Model ();
	screen_ = new Screen ();
	if (typeof(Storage) !== "undefined") 
	{
		if (localStorage.getItem("posters"))
		{
			console.log('local storage contains posts');	 
			var data_json = localStorage.getItem("posters");
			model.load_data(JSON.parse (data_json));
			//model.data = JSON.parse (data_json);
		}
		else {
			console.log('local storage doesn\'t contains posts');
			model.data = {};
		}
    
  
  
		console.log(screen_);
		screen_.show_posts_from_root();

		$("#add_post_button").click (function () {add_new_post_click();});
		$(".search_button").click (function () {search_button_click();});
		$(".show_all_button").click (function () {show_all_button_click();});  

		$(".show_all_button").hide();

	    //localStorage.setItem("posters",JSON.stringify(model.data));
	}
    else 
	{
    alert ("Sorry, I see that you have no storage support");
    }


});

//json file work on disabling buttons disable search button when input empty, same with add post button

