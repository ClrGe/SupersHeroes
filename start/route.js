// ---------------------------------------------------------
// SvelteKit Starter: here we determine based on the ./run
// runtime, in which we're passing the ROUTE_FOLDER as the
// input.
// ---------------------------------------------------------

let folder = process.env.ROUTE_FOLDER
let hooks = 'sveltekit-default'

switch (folder) {
	// this is a fake way to demonstrate logged in
	case 'superheros':
	case 'superheros-in':
		folder = 'superheros'
		hooks = 'laravel-sanctum-fake-logged-in'
		break

	// this is a fake way to demonstrate logged out
	case 'superheros-out':
		folder = 'superheros'
		hooks = 'laravel-sanctum-fake-logged-out'
		break

	// check the give route folder if laravel sanctum
	// thus it will be re-routed to superheros
	case 'superheros-laravel-sanctum':
		folder = 'superheros'
		hooks = 'laravel-sanctum'
		break

	case undefined:
		folder = 'demo'
		hooks = 'sveltekit-default'
		break
}

export default { folder, hooks }
