jQuery(function($) {	
	$('input.currency-converter-field-amount').each(function() {
		var $converter_input = $(this);
		var $conversion_table_toggle = $("<div class='currency-converter-table-toggle'></div>");
				
		$converter_input.parent().append($conversion_table_toggle);
		
		var thisConversionTable = new ConversionTable({ $toggle: $conversion_table_toggle, $input: $converter_input });
		$conversion_table_toggle.click($.proxy(thisConversionTable.toggle, thisConversionTable));
	})		
});

var ConversionTable = function(options) {	
	var defaults = {		
		$toggle: null,
		$input: null
	}
	
	this.$el = null;
	this.options = jQuery.extend(defaults, options);
};

ConversionTable.prototype.get_table = function() {
	if(!this.$el) {
		this.$el = jQuery("<table class='conversion-table'><tr><th>Currency</th><th>Rate</th></tr><tr class='loading-rows'><td colspan='2'>Loading...</td></tr></table>");
		var _this = this;
		jQuery.ajax({			
			url:Drupal.settings.currency_converter_field.basepath + '/exchange_rates/rates.xml',
			dataType:'xml',
			cache:true,
			success:function(xml) {
				//this should go through a common api to get the adjusted base in USD but I do not have time for that
				var usd_rate = jQuery(xml).find("Cube[currency='USD']").attr('rate');				
				_this.$el.find(".loading-rows").remove();
				jQuery(xml).find('Cube>Cube>Cube').each(function() {					
					var adjusted_rate = jQuery(this).attr('rate') / usd_rate;
					_this.$el.append(jQuery("<tr><td>" + jQuery(this).attr('currency') + "</td><td>" + adjusted_rate.toFixed(4) + "</td></tr>"));
				});
			},
			error:function() {
				_this.$el.find(".loading-rows td").text('There was an error getting exchange rates, make sure the rates.xml file exists in your module folder.');
			}
		})
		this.$el
			.insertAfter(this.options.$toggle)
			.hide();
	} 
	
	return this.$el;
}

ConversionTable.prototype.toggle = function() {
	var $table = this.get_table();	
	$table.slideToggle();
}