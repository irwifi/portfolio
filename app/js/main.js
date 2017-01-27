const skipper = () => {
	$("noscript").remove()
	$("#detect_ie").remove()
	$(".ie_block_script").remove()
	$(".not_ready").remove()
	$(".avatar_container #avatar_img").css({width: '400px', height: '400px', opacity: 1})
	avatar_intro_post()	
}

// Initialize the page
const init = () => {
	// Remove the noscript block
	$("noscript").remove()

	// Remove IE block script and messages
	$("#detect_ie").remove()
	$(".ie_block_script").remove()

	// Hide intro box
	$(".avatar_container .intro_box").hide()

	// Remove the loading screen once the page is ready
	$(".not_ready").remove()
		
	// Make the avatar appear
	$(".audio_avatar_intro")[0].play()
	$(".avatar_container #avatar_img").animate({width: '400px', height: '400px'}, 800)
	$(".avatar_container #avatar_img").fadeTo(1800, 1, avatar_intro_post)	
}

// Initialize the objects  when page is ready
let dev_mode = init
// This mode is for skipping steps during development testing
dev_mode = skipper
$(dev_mode)

// After fade in of avatar image
const avatar_intro_post = () => {
	$(".audio_avatar_intro")[0].pause()
	$(".avatar_container .intro_box").show()
	$(".audio_intro_box_expand")[0].play()
	$(".avatar_container .intro_box").animate({width: '700px'}, 800, intro_box_post)
}

// After expansion of intro box
const intro_box_post = () => {
	$(".audio_intro_box_expand")[0].pause()
	$(".audio_intro_type")[0].play()

	// Simulate the typing of introduction words
	simulate_typing( {"typing_obj": ".intro_box", "char_pos": -1})
}

// Simulate typing
const simulate_typing = (params) => {
	const typing_obj = params.typing_obj
	const char_pos = params.char_pos + 1
	const type_str = $(typing_obj).data("text")

	$(typing_obj).text(type_str.substring(0, char_pos))
	if(char_pos >= type_str.length) return;
	setTimeout(simulate_typing, 130, {typing_obj, char_pos});
}
