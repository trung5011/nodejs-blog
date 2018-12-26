
let createFilterStatus = async (currentStatus,collection) =>{
	const currentModel = require(__path.__path_schema+collection);

	let statusFilter = [
		{name:'ALL',value:'all',count:0,link:'#',class:'default'},
		{name:'Active',value:'active',count:0,link:'#',class:'default'},
		{name:'InActive',value:'inactive',count:0,link:'#',class:'default'},
	];
	// statusFilter.forEach((item, index)=>{
	for(let index = 0; index < statusFilter.length ; index++){
		let item = statusFilter[index];
		let condition ={};

		if(item.value!== "all") {
			condition = {status:item.value};
		}
		
		if(item.value === currentStatus) {
			statusFilter[index].class = 'success';
		}

		await currentModel.countDocuments(condition).then((data)=>{
			statusFilter[index].count = data
		});
	};
	return statusFilter;
}
module.exports = {
	createFilterStatus :createFilterStatus,
};