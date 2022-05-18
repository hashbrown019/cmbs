
let DATA = undefined
let data_ = JSON.parse(url_args['data']);
let indv_list = undefined
let SELECTED_IND_ID = undefined
let isNewRecord = false
let res_fields = ""

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(cordova.file);
	println(" * individual Module Ready ===================");
	get_sync()
}

// get_sync()
function get_sync(){
	get_sync_offline()
	// $send({
	// 	action : DOMAIN+"/api/login",
	// 	method : "POST",
	// 	data : JSON.stringify(data_),
	// 	func : function (ress) {
	// 		var resp = JSON.parse(ress);DATA=resp
	// 		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
	// 		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
	// 		indv_list = DATA.record.individual
	// 		// _createNewFileEntry("user_data_records2.txt",ress)
	// 		res_fields=DATA.fields.individual
	// 		_createNewFileEntry("user_data_records2.txt",ress)
	// 		// println(resp)
	// 		get_indv_list()
	// 		alert("Data Syncronization completed")
	// 		// __getf__()
			
	// 	}
	// })
}

function get_sync_offline(){
	_readFileEntry("user_data_records2.txt",function (resp){
		var resp = JSON.parse(resp);DATA=resp
		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
		indv_list = DATA.record.individual
		res_fields=DATA.fields.individual
		get_indv_list()
		// alert("Data Syncronization completed")
	})

}

// function __getf__(){
// 	$send({
// 		action : DOMAIN+'/api/fields',
// 		method : POST,
// 		data : JSON.stringify({"access":{"user_id":DATA.credential.user_id,"session_id":DATA.credential.session_id},"module":{"name":"individual"}}),
// 		func : function (res){
// 			res_fields=res;
// 			println(" list field initialized")
// 			_createNewFileEntry("req_fields.txt",ress)
// 		}
// 	})
// }


//-----------------------------------------------------------------
function submit_info_ind(){
	var form_field = document.forms[0]
	var submitted = {}
	for (var i = 0; i < form_field.length; i++) {
		if(form_field[i].name.indexOf("[") ==-1 || form_field[i].name.indexOf("]") ==-1 ){
			submitted[form_field[i].name ] = form_field[i].value
		}
		else{
			var main_key = form_field[i].name.split("[")[0]
			var sub_key = form_field[i].name.split("[")[1].replace("[","").replace("]","")
			if(!submitted[main_key]){submitted[main_key] = {} }
			submitted[main_key][sub_key] = []
			submitted[main_key][sub_key].push(form_field[i].value)
		}
	}
	submitted['animal_list'] = JSON.stringify(submitted['animal_list'] )
	submitted['benefits'] = JSON.stringify(submitted['benefits'] )
	submitted['job_preference'] = JSON.stringify(submitted['job_preference'] )
	submitted['list_registered_motor'] = JSON.stringify(submitted['list_registered_motor'] )
	submitted['work_experience'] = JSON.stringify(submitted['work_experience'] )
	submitted['edication_background'] = JSON.stringify(submitted['edication_background'] )

	for (var i = 0; i < FIELD_X_IND.length; i++) {delete submitted[FIELD_X_IND[i]]}

	submitted['record_id'] = SELECTED_IND_ID
	
	if(isNewRecord){submitted["added_date"] = new Date().toISOString().slice(0, 19).replace('T', ' ')}
	submitted['latest_edit_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')

	// __DATA_TO_SYNC.data.individual.push(submitted)
	_readFileEntry("to_beSync.txt",function (res){
		var old_inp = JSON.parse(res)
		old_inp.data.individual.push(submitted)
		println(old_inp.length+ " == Entry for updated list")
		_createNewFileEntry("to_beSync.txt",JSON.stringify(old_inp))
		
	})

	alert("Data : "+ SELECTED_IND_ID + " is added for syncronization")
	$ID('_sample_modal_ind_info').style.display='none'
	no_edit()
}

function get_fields_ind(__index){ //FUNCTION : Getting info of Selected Individual on the List
	if(indv_list[__index]==undefined){
		selected_ind = gen_code(4)
		SELECTED_IND_ID = gen_code(5)
		isNewRecord = true
	}
	else{
		var selected_ind = indv_list[__index]
		SELECTED_IND_ID = selected_ind.record_id
		$ID('edit_buttons').style.display = "block"
	}



	var ffields_1 = ""
	var arr_list = []
	flist = res_fields
	// flist = (JSON.parse(res_fields).fields)
	// println(flist)
	var element = $ID("ind_fields1");
	types_ = {}
	for (var i = 0; i < flist.length; i++) {
		var Tt =  flist[i].property.type
		types_[Tt] = Tt;
		if(flist[i].property.sub_type != null){Tt = flist[i].property.sub_type}
		if(Tt == "text" || Tt == "date" || Tt == "number"){
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<input value="`+selected_ind[flist[i].name]+`" type='`+Tt+`'  name="`+flist[i].name+`"id='`+flist[i].name+`' class='ins_f_ x-input x-border x-round-large' placeholder='`+flist[i].label+`'  />`
		}
		if(Tt == "select"){
			var _opt = ''
			var _keys = Object.keys(flist[i].option)
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
				
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}
		if(Tt == "radio"){
			var _opt = ''
			var _keys = flist[i].option
			for (var ii = 0; ii < _keys.length; ii++) {
				_opt += `<option class="ins_f_" value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
				
			}
			ffields_1 += `
			<span class="x-text-grey">`+flist[i].label+`</span>
			<select value="`+selected_ind[flist[i].name]+`" class='ins_f_ x-select x-border x-round-large' name="`+flist[i].name+`" id=`+flist[i].name+`>`+_opt+`</select>`
		}

		if(Tt == "html" || Tt =="json" || flist[i].property.type == "html"){
			ffields_1 += `` + flist[i].option
		}

		if(Tt == "label"){
			var disp_ = "none"
			var class_ = "FIELDS"
			if(flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
			ffields_1 += `</div><hr><b class="" onmouseup="show_drop_fields_ind(`+i+`)">`+flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
		}
		ffields_1 +='<br>'

	}
	element.innerHTML = ffields_1
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")
	$ID('_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
}

let temp_f_sel = 0
function show_drop_fields_ind(ind){
	var c_f = $CLASS("FIELDS")
	var sel_f = $ID("FIELDS_"+ind)
	// println(sel_f)
	for (var i = 0; i < c_f.length; i++) {c_f[i].style.display = "none"}
	if(temp_f_sel==ind){
		sel_f.style.display = "none"
	}
	else{
		sel_f.style.display = "block"
		temp_f_sel = ind
	}
}

function ind_search_field(search_item){
	var search_arr  = search_item.split(" ")
	var ls_inv_init = ""
	$ID('modal_login_loading').style.display='block'
	var res_counter = 0
	for (var i = 0; i < indv_list.length; i++) {
		if(search_str_arr(JSON.stringify(indv_list[i]),search_arr)){
			ls_inv_init += `
				<div class="x-container x-card x-round-large x-white" onclick="get_ind_data(`+i+`)">
					<div class=" x-col s6">
						<span class="x-tiny">
							<span class="x-text-grey">Name<br></span><span>`+indv_list[i].first_name+" "+indv_list[i].middle_name+" "+indv_list[i].last_name+" "+indv_list[i].ext_name+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Birthday<br></span><span>`+indv_list[i].birthdate+`</span>
						</span>
					</div>
					<div class="x-container x-col s6">
						<span class="x-tiny">
							<span class="x-text-grey">Status<br></span><span >`+indv_list[i].group_status+`</span>
						</span><br>
						<span class="x-tiny">
							<span class="x-text-grey">Contact Number <br></span>`+indv_list[i].contact_no+`<span></span>
						</span>
					</div>
				</div>`
			res_counter += 1
		}
	}
	$ID('search_note').innerHTML = "<span>Showing <b>"+res_counter+"</b> Results</span>"
	$ID('indv_list').innerHTML = ls_inv_init
	$ID('modal_login_loading').style.display='none'

}

function get_indv_list(){
	var ls_inv_init = ""
	for (var i = 0; i < indv_list.length; i++) {
		ls_inv_init += `
			<div class="x-container x-card x-round-large x-white" onclick="get_ind_data(`+i+`)">
				<div class=" x-col s6">
					<span class="x-tiny">
						<span class="x-text-grey">Name<br></span><span>`+indv_list[i].first_name+" "+indv_list[i].middle_name+" "+indv_list[i].last_name+" "+indv_list[i].ext_name+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Birthday<br></span><span>`+indv_list[i].birthdate+`</span>
					</span>
				</div>
				<div class="x-container x-col s6">
					<span class="x-tiny">
						<span class="x-text-grey">Status<br></span><span >`+indv_list[i].group_status+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Contact Number <br></span>`+indv_list[i].contact_no+`<span></span>
					</span>
				</div>
			</div>`
	}
	$ID('indv_list').innerHTML = ls_inv_init
}

function get_ind_data(index_){
	get_fields_ind(index_) 
	var selected_ind = indv_list[index_]
}

function gotto_ind(){
	// alert(window.location.href)
	goto("hh_home_screen.html?data="+url_args['data'])
	// goto("hh_home_screen.html?data="+url_args['data'])
}