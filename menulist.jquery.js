/*
 * jQuery Plugin menulist
 * @author Quentin Supernant
 * @created 2012-05-08
 * @updated 2012-05-08
 */
(function($) {
	
	var __menuListData = [];
	var __menuList_count = 0;
	
	$.menuList = {
		p: {
			arrow		:true,
			hotclick	:true
			
		}
	};
	
	
    $.fn.menuList = function(params) {
   
        if ($(this).length == 0) return;
        
        return $(this).each(function() {
			var $this = $(this);
			var p = $.extend({}, $.menuList.p);
			__menuList_count++;
			
			$.extend(p, params);
			
			p.$container = $this;
			
			p.id = p.id || "menuList" + __menuList_count;
		
			$this.css('position', 'relative');
			$this.css('padding-right', '10px');
			$this.find('ul.menuList').remove();
			
			if(p.arrow) {
				$this.append('<span class="menuList-arrow">&nbsp;</span>');
			}
			
			if(p.hotclick) {
				$this.unbind('.menulist').bind('click.menulist', function() {
					$this.triggerHandler('menulist-toggle');
				});
			}
			
			if(p.trigger) {
				var pid = p.id;
				$(p.trigger).unbind('.menulist').bind('click.menulist', function() {
					$this.triggerHandler('menulist-toggle');
				});
			}
			
			__menuListData[p.id] = p;
			
			var menuList = '<ul '
			+ (p.id?'id="' + p.id + '" ':'') 
			+ 'class="menuList box' 
			+ (p.css?' ' + p.css:'') + '"' 
			+ (p.width?' style="width:' + p.width + '"':'') 
			+ '>';
			
			if(p.title)
			{
				menuList += '<li class="menuList-title">' + p.title + '</li>';	
			}
			
			var hasPlus = false;
			for(var i = 0; i < p.items.length; i++)
			{
				p.items[i].action = p.items[i].action || 'close';
				p.items[i].visible = (p.items[i].visible == undefined?true:p.items[i].visible);
				menuList += '<li class="menuList-item index' + i
					+ (p.items[i].css?' ' + p.items[i].css:'')
					+ (p.items[i].checkbox?' checkbox':'') 
					+ (p.items[i].ico?' img':'')
					+ (p.items[i].plus?' plus':'') + '"'
					+ (!p.items[i].visible?' style="display:none"':'')
					+ '>' 
					+ (p.items[i].checkbox?' <div class="item-checkbox' + ((typeof(p.items[i].checked) != 'function')?(p.items[i].checked?' CHECKED':''):'') + '"></div>':'') 
					+ (p.items[i].ico?' <img class="item-img" src="' + p.items[i].ico + '" />':'')
					+ '<span class="item-index">' + i + '</span>' 
					+ '&nbsp;<span class="item-text">' 
					+ (p.items[i].href?'<a href="' + p.items[i].href + '">' + p.items[i].label + '</a>':p.items[i].label)
					+ '</span></li>';
				if(p.items[i].plus) {
					hasPlus = true;
				}
			}
			if(hasPlus) {
				menuList += '<li class="menuList-plus">...</li>';
			}
			menuList += '</ul>';
			$this.append(menuList);
			
			$this.bind('click.menulist', function(e) {
				e.stopPropagation();
			})
			.unbind('menulist-toggle').bind('menulist-toggle', function(e) {
				// Hide all menuList
				var $el = $(this).find('ul.menuList');
				var isVisible = !$el.is(':visible');
				$('ul.menuList').hide();
				
				if(isVisible)
				{
					var id = $el.attr('id');
					var p = __menuListData[id];
					$.each(p.items, function(index) {
						if(typeof(this.checked) == 'function') {
							var b = this.checked(e, this, p);
							if(b) {
								$el.find('.index' + index + ' .item-checkbox').addClass('CHECKED');
							} else {
								$el.find('.index' + index + ' .item-checkbox').removeClass('CHECKED');
							}
						}
					});
					
					$el.find('li.plus').hide();
					$el.find('li.menuList-plus').show();
					var w = $('body').width();
					var h = $('body').height();

					$el.show();
										
					var parent_offset = p.$container.offset(); 
					
					var offset = $el.offset();
					var w$el = offset.left + $el.width();
					var h$el = offset.top + $el.height();
					
					if(p.position == 'top') {
						$el.css('margin-top', -($el.height() + p.$container.height()));
					}
					if(p.position == 'middle') {
						$el.css('margin-top', -($el.height() + p.$container.height()) / 2);
					}
					
					if(w$el > w) {
						$el.css('margin-left', -(w$el - w + 5));
					}
					if(h$el > h) {
						$el.css('margin-top', -(h$el - h + 5));
					}
					if($el.bringToFront) {
						$el.bringToFront();
					}
				} else {
					$el.hide('fast');
				}
				return false;
			}).find('.menuList-arrow').bind('click', function(e) {
				$this.triggerHandler('menulist-toggle');
				e.stopPropagation();
			});
	
			$this.find('li.menuList-plus').bind('click', function(e) {
				e.stopPropagation();
				$(this).hide();
				$(this).parents('.menuList:first').find('li.plus').show('fast');
			});
			
			$this.find('li.menuList-item').bind('click.menuList', function(e) {
					var $parent = $(this).parents('.menuList:first');
					var id = $parent.attr('id');
					var p = __menuListData[id];
					var index = parseInt($(this).find('.item-index:first').html());
					var pitem = p.items[index];
					var checked;
					if(pitem.action == 'close') {
						$parent.hide();
					}
					if(pitem.checkbox) {
						if(typeof(pitem.checked) == 'function') {
							checked = !pitem.checked(e, pitem, p);
						} else {
							checked = !pitem.checked;
							pitem.checked = checked;
						}
					}
					var ret = true;
					if(typeof(pitem.click) == 'function') { pitem.click(e, pitem, p, checked); }
					if(typeof(p.onClick) == 'function') { ret = p.onClick(e, pitem, p); }
					if(checked) {
						$(this).find('.item-checkbox').addClass('CHECKED');
					} else {
						$(this).find('.item-checkbox').removeClass('CHECKED');
					}
					e.stopPropagation();
			});
        });
		
    };
    
})(jQuery);

$(document).bind('click', function() {
	$('ul.menuList').hide('slow');
});
