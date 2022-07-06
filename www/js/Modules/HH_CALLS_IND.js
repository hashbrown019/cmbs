
let indv_list____ = undefined
let ____SELECTED_IND_ID = undefined
let _____isNewRecord = false
let ___res_fields = ""
let SEL_HH_ID_FOR_IND = undefined
let is_newIND_data =false

//-----------------------------------------------------------------
function ____submit_info_ind(){
	var form_field = document.forms[1]
	var submitted = {}

	for (var i = 0; i < form_field.length; i++) {
		println(form_field[i].name+" :: "+form_field[i].value)

		if(form_field[i].name.indexOf("[") ==-1 || form_field[i].name.indexOf("]") ==-1 ){
			submitted[form_field[i].name ] = form_field[i].value
		}
		else{
			var main_key = form_field[i].name.split("[")[0]
			var sub_key = form_field[i].name.split("[")[1].replace("[","").replace("]","")
			if(!submitted[main_key]){submitted[main_key] = {} }
			if(!submitted[main_key][sub_key]){submitted[main_key][sub_key] = []}
			
			submitted[main_key][sub_key].push(form_field[i].value)
		}
	}
	submitted['animal_list'] = JSON.stringify(submitted['animal_list'] )
	submitted['benefits'] = JSON.stringify(submitted['benefits'] )
	submitted['job_preference'] = JSON.stringify(submitted['job_preference'] )
	submitted['list_registered_motor'] = JSON.stringify(submitted['list_registered_motor'] )
	submitted['work_experience'] = JSON.stringify(submitted['work_experience'] )
	submitted['edication_background'] = JSON.stringify(submitted['edication_background'] )
	submitted['profile_image'] = JSON.stringify(SEL_IMG )
	SEL_IMG = []

	for (var i = 0; i < FIELD_X_IND.length; i++) {delete submitted[FIELD_X_IND[i]]}
	if(_____isNewRecord){
		submitted["added_date"] = new Date().toISOString().slice(0, 19).replace('T', ' ')
		LS_IND_HH.push(____SELECTED_IND_ID)
	}
	submitted['latest_edit_date'] = new Date().toISOString().slice(0, 19).replace('T', ' ')

	submitted['record_id'] = ____SELECTED_IND_ID;
	submitted['geo_map_group_id'] = ____SELECTED_IND_ID;
	

	// __DATA_TO_SYNC.data.individual.push(submitted)
	_readFileEntry("to_beSync.txt",function (res){
		var old_inp = JSON.parse(res)
		var isalreadyadded = false
		var entry_status = ""
		var index_same = 0
		for (var i = 0; i < old_inp.data.individual.length; i++) {
			if(old_inp.data.individual[i].record_id==submitted.record_id){
				isalreadyadded = true
				index_same = i
				break
			}
		}


		if(isalreadyadded){
			entry_status = "Editted";
			old_inp.data.individual[index_same]=submitted
		}else{
			entry_status = "Added";
			old_inp.data.individual.push(submitted)
		}

		var answer = window.confirm("The Entry is now "+entry_status+"\nContinue ?");
		if (answer) {
			println(old_inp.length+ " == Entry for updated list")
			__createNewFileEntry("to_beSync.txt",JSON.stringify(old_inp),function(){
				alert("Data : "+ ____SELECTED_IND_ID + " is added for synchronization")
				$ID('IND_sample_modal_ind_info').style.display='none'
				no_edit()
				// goto("hh_home_screen.html?data="+url_args['data'])
				if(_____isNewRecord){
					println("NEW INd ADD to HH : "+ ____SELECTED_IND_ID)
					add_to_ind_ltable(____SELECTED_IND_ID,DATA.record.individual)
				}
			})
		}
		else {
			alert("Data : "+ ____SELECTED_IND_ID + " is NOT BE ADDED for synchronization")
			$ID('IND_sample_modal_ind_info').style.display='none'
			no_edit()
		}


		
	})

}

function _go_edit(){
	$ID("_bttnHid").style.display = "block";
	$ID("_btn_edit").style.display = "none"
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = false);
	println("editting")
}
function no_edit(){
	$ID("_bttnHid").style.display = "none";
	$ID("_btn_edit").style.display = "block";
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
}

function __get_fields_ind(__index){ //FUNCTION : Getting info of Selected Individual on the List
	println("__index====================")
	println(__index)
	if(indv_list____[__index]==undefined){
		__selected_ind = gen_code(4)
		____SELECTED_IND_ID = gen_code(5)
		_____isNewRecord = true

	}
	else{
		var __selected_ind = indv_list____[__index]
		_____isNewRecord = false
		____SELECTED_IND_ID = __selected_ind.record_id
		$ID('_edit_buttons').style.display = "block"
	}
	var ffields_2 = ""
	var arr_list = []
	___flist = ___res_fields
	// ___flist = (JSON.parse(___res_fields).fields)
	// println(___flist)
	var element = $ID("ind_fields2");
	types_ = {}
	for (var i = 0; i < ___flist.length; i++) {
		var Tt =  ___flist[i].property.type
		types_[Tt] = Tt;
		if(___flist[i].name!="profile_info"){
			var VAL = __selected_ind[___flist[i].name]
			if(VAL==undefined || VAL=="undefined"){VAL=""}
			println(VAL)
			if(___flist[i].property.sub_type != null){Tt = ___flist[i].property.sub_type}
			if(Tt == "text" || Tt == "date" || Tt == "number"){
				ffields_2 += `
				<span class="x-text-grey">`+___flist[i].label+`</span>
				<input value="`+VAL+`" type='`+Tt+`'  name="`+___flist[i].name+`"id='`+___flist[i].name+`' class='ins_f_ x-input x-border x-round-large' placeholder='`+___flist[i].label+`'  />`
			}
			if(Tt == "select"){
				var _opt = ''
				var _keys = Object.keys(___flist[i].option)
				for (var ii = 0; ii < _keys.length; ii++) {
					_opt += `<option value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
					
				}
				ffields_2 += `
				<span class="x-text-grey">`+___flist[i].label+`</span>
				<select value="`+VAL+`" class='ins_f_ x-select x-border x-round-large' name="`+___flist[i].name+`" id=`+___flist[i].name+`>`+_opt+`</select>`
			}
			if(Tt == "radio"){
				var _opt = ''
				var _keys = ___flist[i].option
				for (var ii = 0; ii < _keys.length; ii++) {
					_opt += `<option class="ins_f_" value='`+_keys[ii]+`'>`+_keys[ii]+`</option>`
					
				}
				ffields_2 += `
				<span class="x-text-grey">`+___flist[i].label+`</span>
				<select value="`+VAL+`" class='ins_f_ x-select x-border x-round-large' name="`+___flist[i].name+`" id=`+___flist[i].name+`>`+_opt+`</select>`
			}

			if(Tt == "html" || Tt =="json" || ___flist[i].property.type == "html"){
				// continue
				ffields_2 += `` + ___flist[i].option
			}

			if(Tt == "label"){
				var disp_ = "none"
				var class_ = "FIELDS"
				if(___flist[i].label.indexOf("checkbox")==-1){disp_="block";class_=""}
				ffields_2 += `</div><hr><b class="" onmouseup="___show_drop_fields_ind(`+i+`)">`+___flist[i].label+`</b><br><div id="FIELDS_`+i+`" class="`+class_+` x-leftbar x-padding" style="display:`+disp_+`;">`
			}
			ffields_2 +='<br>'
		} // SKIPPED FIILED


	}
	element.innerHTML = ffields_2
	add_class2class("table",'x-table','x-border');
	add_class2class("table-responsive",'x-responsive');
	add_class2class("img-responsive","x-img","x-image","x-center")
	add_class2class("firstfld","x-input","x-border")
	add_class2class("add-row","x-btn","x-round-large","x-blue")
	$ID('IND_sample_modal_ind_info').style.display='block' // IND for Data
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = true);
	___popu_add_row()
}

let ____temp_f_sel = 0


function ___show_drop_fields_ind(ind){
	var c_f = $CLASS("FIELDS")
	var sel_f = $ID("FIELDS_"+ind)
	// println(sel_f)
	for (var i = 0; i < c_f.length; i++) {c_f[i].style.display = "none"}
	if(____temp_f_sel==ind){
		sel_f.style.display = "none"
	}
	else{
		sel_f.style.display = "block"
		____temp_f_sel = ind
	}
}



function ___get_ind_data(ids,HH_id){////////TO BE CALLED FROM HH
	SEL_HH_ID_FOR_IND = HH_id
	indv_list____ = DATA.record.individual
	___res_fields=DATA.fields.individual
	var index = undefined
	var is_exist = false
	for (var i = 0; i < indv_list____.length; i++) {
		println(" index = "+ index)
		if(indv_list____[i].record_id==ids){
			alert(i+" .. data found = "+ids)
			is_exist = true
			break
		}
		
	}
	if(is_exist){
		index = i
	}

	println(ids +"////////////"+index)
	
	var __selected_ind = indv_list____[index]
	// ____SELECTED_IND_ID = indv_list____[index]
	__get_fields_ind(index)

}

function addnew_hh_ind(){
	indv_list____ = DATA.record.individual
	___res_fields=DATA.fields.individual
	__get_fields_ind()
	$ID('_edit_buttons').style.display = "block"
	go_edit()
	const inputs = document.querySelectorAll('.ins_f_');
	inputs.forEach(input => input.disabled = false);
}

// --------------------



function ___popu_add_row(){
	var add_btn = $CLASS("add-row")
	println("getting add buttons -==-=-=-=-=-=-=-=--=-=-=")
	for (var i = 0; i < add_btn.length; i++) {
		add_btn[i].id="_btn_"+i
		var ___ID_NAME = "_div"+i+"div_0"
		add_btn[i].parentNode.parentNode.id = ___ID_NAME
		println(add_btn[i].parentNode.parentNode.id)
		add_btn[i].addEventListener("click", function() {
			____duplicate(this.parentNode.parentNode.id)
		})
	}
}

function ____duplicate(id_name_) {
	var id_name = id_name_.split("_")[0]
	var iii = parseInt(id_name_.split("_")[1])
	var original = $ID(id_name+"_" + iii);
	var clone = original.cloneNode(true); // "deep" clone
	clone.id = id_name + ++ iii; // there can only be one element with an ID
	var clonebtn = clone.querySelectorAll("button")
	for (var i = 0; i < clonebtn.length; i++) {
		clonebtn[i].innerText = "Remove"
		clonebtn[i].classList.add("x-btn","x-block","x-red")
		clonebtn[i].removeEventListener("click", function() {})
		clonebtn[i].addEventListener("click", function() {
			this.parentNode.parentNode.remove()
		})

	}
	// clone.onclick = ____duplicate; // event handlers are not cloned
	original.parentNode.appendChild(clone);
}