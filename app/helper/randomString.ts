export function randomString() {
	const chars = "0123456789!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	const string_length = 20;
	let randomstring = '';
	for (let i=0; i < string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}
