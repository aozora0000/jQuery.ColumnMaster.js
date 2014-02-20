/*
 *  Name 	: Jquery Column Master
 *  Version : 0.1
 *  Author	: kohei kinoshita
 */
(function($){
	$.fn.columnMaster = function(options) {
		/*
		* 	Construct
		*/
		var obj = new Object();
		obj.target = $(this);
		obj.selector = $(this).selector;
		obj.options = $.extend({
			btnCol			: 		1,	// Delete/Addition Button Column Number
			RowSelector		: 		"tbody > tr",
			dataName		: 		"data",
			fadeInterval	: 		800,
			button 			: {
				add 		: 		'<button type="button" class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-plus"></span></button>',
				del 		: 		'<button type="button" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-minus"></span></button>',
			},
			RowLimit		: 		false, 	//Max Row Size Limit
			LimitAlert		: 		"Limit %d Rows!!!"
		},options);

		/*
		*	InitializeMethod
		*/
		// All Rows Get Method
		obj.rowGetAction = function() {
			obj.row = obj.target.find(options.RowSelector);
		}
		//Table Row as Input name attribute setting
		obj.Initialize = function() {
			//Get All Row
			obj.rowGetAction();
			//Table Row DOM Object
			obj.pureRow = obj.row.eq(0).clone(true);
			obj.pureRow.find("input,textarea").each(function() {
				if($(this).attr("type") !== "checkbox") {
					$(this).val("");
				} else {
					$(this).prop("checked",false);
				}
			});
			$(obj.row).each(function(i) {
				$(this).find("input,select,textarea").each(function() {
					$(this).attr("name",obj.options.dataName+"["+i+"]["+$(this).attr("data-name")+"]");
				});
			});
		}
		/*
		 *	ActionMethod
		 */
		//Delete Button Action
		obj.delAction =  function() {
			$(document).on("click","[data-role=delete]",function() {
				var target = $(this).parents()[1];
				$(target).animate({opacity:0},options.fadeInterval,function() {
					$(this).remove();
				});
			});
		}
		//Add Button Action
		obj.AddAction = function() {
			$(document).on("click","[data-role=add]",function() {
				if(!obj.isLimit()) {
					return false;
				}
				var target = $(this).parents()[1];
				var self = $(this).parent().clone();
				$(this).parent().animate({opacity:0},options.fadeInterval,function() {
					$(this).remove();
					$(target).append(
						$(obj.pureRow).css("opacity",0).animate({opacity:1},options.fadeInterval,function() {
							$(target).append(
								$(self).css("opacity",0).animate({opacity:1},options.fadeInterval)
							)
						})
					);
					obj.Initialize();
					obj.setDeleteButton();
				});
			});
		}
		/*
		 *	Add Action Button Method
		 */
		obj.setDeleteButton = function() {
			//Initialize Add Delete Button in Rows
			obj.row.each(function(i) {
				$(this).find("td").eq(obj.options.btnCol -1)
				.empty()
				.css("text-align","center")
				.append(
					$(obj.options.button.del).attr("data-role","delete")
				);
			});
		}
		obj.setAddButton =function () {
			//Initialize ADD Additional Button Last_ROW
			$(obj.row).parent().append(
				$('<td></td>').css("text-align","center")
				.append(
					$(obj.options.button.add).attr("data-role","add")
				)
			);
		}
		/*
		 *	Row Limit Method
		 */
		obj.alert = function() {
			var message = obj.options.LimitAlert.replace("\%d",obj.options.RowLimit);
			alert(message);
		}
		obj.countRow = function () {
			var row = $(obj.selector).find("tr");
			return row.length;
		}
		obj.isLimit = function() {
			if(obj.options.RowLimit !== false && obj.countRow() > obj.options.RowLimit) {
				obj.alert();
				return false;
			} else {
				return true;
			}
		}
		//Initialize Execute
		obj.Initialize();
		obj.setDeleteButton();
		obj.setAddButton();
		obj.delAction();
		obj.AddAction();
	}
})(jQuery);
