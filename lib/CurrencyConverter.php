<?php

namespace cekolabs {
	
	class CurrencyConverter {
				
		public static function convert($amount_usd, $currency_code) {
			if($currency_code == 'USD') return $amount_usd;
			
			$currency_dict = array();
			
			$rates_file_location = realpath(drupal_get_path('module', 'currency_converter_field')) . "/exchange_rates/rates.xml";
			$xml = simplexml_load_string(file_get_contents($rates_file_location));
			foreach($xml->Cube->Cube->Cube as $rate_definition) {
				$currency_dict[(string)$rate_definition['currency']] = (float)$rate_definition['rate'];
			}
			
			//USD is not the currency base with the rates file I'm using, so I have to adjust it.
			$usd_rate = 1.0 / (float)$currency_dict['USD'];
			$requested_rate = $currency_dict[$currency_code];
			if(!$requested_rate) {
				return 'not available';
			}else{
				return number_format($requested_rate * $usd_rate * $amount_usd, 2);
			}						
		}
		
		public static function getCurrencySymbol($currency_code) {
			switch($currency_code) {
				case 'EUR':
					return '&pound;';
				case 'JPY':
					return '&yen;';
				case 'USD':
					return '$';									
			}
		}
		
	}
	
}