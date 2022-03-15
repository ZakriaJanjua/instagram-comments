const axios = require("axios");
const fs = require("fs");

const makeRequests = () => {
	let finalResult = [];
	let config = {
		method: "get",
		url: "https://www.instagram.com/p/CZNUi-ioDk1/?__a=1&withCookies",
		headers: {
			Cookie: 'insta login cookie',
		},
	};

	axios(config)
		.then(function (response) {
			let id = response.data.items[0].id.split("_")[0];
			id = BigInt(id);
			axios({
				method: "get",
				url: `https://i.instagram.com/api/v1/media/${id}/comments/?can_support_threading=true&permalink_enabled=false`,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 Instagram 12.0.0.16.90 (iPhone9,4; iOS 10_3_3; en_US; en-US; scale=2.61; gamut=wide; 1080x1920)",
					Cookie: 'insta login cookie',
				},
			})
				.then((response) => {
					finalResult.push(response.data);
					let next_min_id = encodeURI(response.data.next_min_id);
					if (next_min_id) {
						for (let i = 0; i < 5; i++) {

							if (next_min_id) {
								axios({
									method: "get",
									url: `https://i.instagram.com/api/v1/media/${id}/comments/?can_support_threading=true&min_id=${next_min_id}`,
									headers: {
										"User-Agent":
											"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 Instagram 12.0.0.16.90 (iPhone9,4; iOS 10_3_3; en_US; en-US; scale=2.61; gamut=wide; 1080x1920)",
										Cookie: 'insta login cookie',
									},
								})
									.then((response) => {
										finalResult.push(response.data);
										console.log(response.data)
                                        fs.writeFile(
                                            "response.json",
                                            JSON.stringify(finalResult.toString()),
                                            (err) => {
                                                if (err) console.error(err);
                                                console.log("written");
                                            }
                                        );
										next_min_id = response.data.next_min_id;
									})
									.catch((err) => console.error(err));
							} else {
								break;
							}
						}
						
						return finalResult;
					} else {
						
						return finalResult;
					}
				})
				.catch((err) => console.error(err));
		})
		.catch(function (error) {
			console.error(error);
		});
};
makeRequests();
