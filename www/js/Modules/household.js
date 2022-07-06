
let DATA = undefined
let data_ = JSON.parse(url_args['data']);
let indv_list = undefined
let SELECTED_IND_ID = undefined
let isNewRecord = false

$send({
	action : DOMAIN+"/api/login",
	method : "POST",
	data : JSON.stringify(data_),
	func : function (ress) {
		var resp = JSON.parse(ress);DATA=resp
		if(!resp.success){$ID('modal_login_loading').style.display='none';println(" * Error in Fetching Data");}
		else{$ID('modal_login_loading').style.display='none';println(" * Fetching Data Done");}
		indv_list = DATA.record.individual
		println(resp)
		get_hh_list()
		
	}
})

function get_hh_list(){
	var ls_hh_init = ""
	for (var i = 0; i < indv_list.length; i++) {
		ls_hh_init += `
			<div class="x-container x-card x-round-large x-white" onclick="get_ind_data(`+i+`)">
				<div class=" x-col s6">
					<span class="x-tiny">
						<span class="x-text-grey">Name<br></span><span>`+indv_list[i].first_name+" "+indv_list[i].middle_name+" "+indv_list[i].last_name+" "+indv_list[i].ext_name+`</span>
					</span><br>
					<span class="x-tiny">
						<span class="x-text-grey">Birthday<br></span><span>`+indv_list[i].birthdate+`</span>
					</span
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
	$ID('indv_list').innerHTML = ls_hh_init
}