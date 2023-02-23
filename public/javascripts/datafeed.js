// import { subscribeOnStream } from './streaming.js';

const configurationData = {
	supported_resolutions: ['1'],
	exchanges: [{
		value: '',
		name: 'Saham-Server',
		desc: 'Saham-Server',
	}],
	symbolType: [
		{
			name: "Forex",
			value: "Forex"
		}
	]

};

let symbolInterval;
const lastBarsCache = new Map();

export default {
	onReady: (callback) => {
		console.log('[onReady]: Method call');
		return setTimeout(() => {
			return callback(configurationData);
		}, 0);
	},

	searchSymbols: async (
		userInput,
		exchange,
		symbolType,
		onResultReadyCallback,
	) => {
		console.log('[searchSymbols]: Method call', userInput, exchange, symbolType);
		fetch('/api/symbol/mask?mask=Shares\*').then(response => {
		// fetch('/api/symbol/mask?mask=FX\*').then(response => {
			return response.json();
		}).then(json => {
			const map = json.map((val) => {
				return {
					symbol: val.Symbol,
					full_name: val.Symbol,
					description: val.Description,
					// exchange: "Saham",
					ticker: val.Symbol,
					type: "forex"
				}
			})
			onResultReadyCallback(map)
		});

	},

	resolveSymbol: async (
		symbolName,
		onSymbolResolvedCallback,
		onResolveErrorCallback,
	) => {
		console.log('[resolveSymbol]: Method call', symbolName);
		fetch(`/api/symbol/get?symbol=${symbolName}`).then(response => response.json())
			.then(json => {
				const symbolInfo = {
					ticker: json.Symbol,
					name: json.Symbol,
					description: json.Description,
					// type: 'forex',
					// session: '24x7',
					// timezone: 'Etc/UTC',
					// timezone: 'Asia/Qatar',
					// exchange: 'Saham',
					minmov: 1,
					pricescale: 10 ** parseInt(json.Digits),
					has_intraday: true,
					intraday_multipliers: ['1'],
					has_no_volume: true,
					has_weekly_and_monthly: true,
					supported_resolutions: configurationData.supported_resolutions,
					// supported_resolutions: ['1D'],
					volume_precision: 5,
					data_status: 'streaming',
				};
				onSymbolResolvedCallback(symbolInfo)
			})

		// return setTimeout(() => {
		// 	onSymbolResolvedCallback({
		// 		name: "AUD/CAD",
		// 		minmov: 1,
		// 		pricescale: 1,
		// 		session: "0900-1630",
		// 		timezone: "Etc/UTC"
		// 	})
		// }, 0)
	},
	// 1668038400000
	// 1668038400000
	getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
		console.log('[getBars]: Method call', resolution, symbolInfo, from, to, firstDataRequest);
		try {
			let data = await (await fetch(`/api/chart/get?symbol=${symbolInfo.ticker}&from=${from}&to=${to}&data=dohlcv`)).json();
			data = data.map((val) => {
				return {
					time: val[0] * 1000,
					open: val[1],
					high: val[2],
					low: val[3],
					close: val[4],
					volume: val[5],
				}
			})

			if (firstDataRequest) {
				lastBarsCache.set(symbolInfo.full_name, {
					...data[data.length - 1],
				});
			}
			console.log(data[data.length - 1])
			onHistoryCallback(data, { noData: false });
		} catch (error) {
			onErrorCallback(error)
		}
	},

	subscribeBars: (
		symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback
	) => {
		console.log('[subscribeBars]: Method call with subscribeUID:', symbolInfo)
		let transId = 0;
		symbolInterval = setInterval(() => {
			fetch(`/api/tick/last?symbols=${symbolInfo.ticker}`)
				.then(response => response.json())
				.then(json => {
					const data = json.answer[0];
					transId = json.trans_id;
					// Update BAR
					const lastBar = lastBarsCache.get(symbolInfo.full_name)
					let bar;
					// Check if nextbar greater than last bar
					var d = new Date(data.Datetime * 1000);
					if (d.setSeconds(0, 0) > lastBar.time) {
						bar = {
							time: data.Datetime * 1000,
							open: data.Bid,
							high: data.Bid,
							low: data.Bid,
							close: data.Bid,
						};
					} else {
						bar = {
							...lastBar,
							high: Math.max(lastBar.high, data.Bid),
							low: Math.min(lastBar.low, data.Bid),
							close: data.Bid,
							// time: lastBar.time,
							// time: parseInt(data.DatetimeMsc),
							// close: parseFloat(data.Bid),
							// high: parseFloat(data.Bid),
							// low: parseFloat(data.Bid),
							// open: 0.99491
						}
					}
					lastBarsCache.set(symbolInfo.full_name, bar)

					onRealtimeCallback(bar);
				})
		}, 1000)
		// subscribeOnStreaFm(
		// 	symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback
		// )

	},

	unsubscribeBars: (subscriberUID) => {
		console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
		clearInterval(symbolInterval)
	},
};
