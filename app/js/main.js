// Initialize the page
const init = () => {
	// Remove the noscript block
	$("noscript").remove()

	// Remove IE block script and messages
	$("#detect_ie").remove()
	$(".ie_block_script").remove()

	// Remove the loading screen once the page is ready
	$(".not_ready").remove()
		
	// Make the avatar appear
	$(".avatar_container #avatar_img").animate({width: '400px', height: '400px'}, 800, avatar_init_ready)
	$(".avatar_container #avatar_img").fadeTo(800, 1)	
}

// Initialize the objects  when page is ready
$(init)

const avatar_init_ready = () => {
}
