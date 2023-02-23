// Datafeed implementation, will be added later
import Datafeed from './datafeed.js';

// window.tvWidget = new TradingView.widget({
// 	symbol: 'AUDCAD', // default symbol
// 	interval: '6M', // default interval
// 	fullscreen: true, // displays the chart in the fullscreen mode
// 	container_id: 'tv_chart_container',
// 	datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
// 	library_path: '../charting_library/',
// });
window.tvWidget = new TradingView.widget({
	debug: true,
	 symbol: 'BTCUSD', // default symbol
	//symbol: 'AMZN', // default symbol
	interval: '1', // default interval
	fullscreen: true, // displays the chart in the fullscreen mode
	container_id: 'tv_chart_container',
	datafeed: Datafeed,
	library_path: '../charting_library/',
	symbol_search_request_delay: 1000,
	timezone: 'UTC',
});
