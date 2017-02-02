"use strict";
// The handles are created because the functions can not be used before declared
const init_handle = () => {init()}
const skipper_handle = () => {skipper()}

// Initialize the objects  when page is ready
let dev_mode = init_handle
// This mode is for skipping steps during development testing
// dev_mode = skipper_handle
$(dev_mode)

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
	$(".avatar_container #avatar_img").animate({width: '40vh', height: '40vh'}, 800)
	$(".avatar_container #avatar_img").fadeTo(1800, 1, avatar_intro_post)	
}

// After fade in of avatar image
const avatar_intro_post = () => {
	$(".audio_avatar_intro")[0].pause()
	$(".avatar_container .intro_box").show()
	$(".audio_intro_box_expand")[0].play()
	$(".avatar_container .intro_box").animate({width: '36vw'}, 800, intro_box_post)
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
	if(char_pos >= type_str.length) {
		simulate_typing_post()
	} else {
		setTimeout(simulate_typing, 130, {typing_obj, char_pos});
	}
}

// Function to convert viewport value into pixel
function viewport_to_pixel( val ) {
	const percent = val.match(/[\d.]+/)[0] / 100
	const unit = val.match(/[vwh]+/)[0]
	return (unit == 'vh' ? $(window).height() : $(window).width()) * percent +'px'
}

// After simulating the typing
const simulate_typing_post = () => {
	$(".audio_instruction_flyby")[0].play()
	const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
	$(".instruction_box .instruction_msg1").animate({"margin-left": new_left}, 400, instruction_msg1_flyby_post)
}

// After flying first instruction message
const instruction_msg1_flyby_post = () => {
	$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
	setTimeout(() => {$(".audio_instruction_flyby")[0].play()}, 800);
	const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
	$(".instruction_box .instruction_msg2").delay(800).animate({"margin-left": new_left}, 400, instruction_msg2_flyby_post)
}

// After flying second instruction message
const instruction_msg2_flyby_post = () => {
	$(".instruction_box .instruction_msg2").css({"margin": "0 auto", "margin-top": 20})

	$(document).on("click", close_intro)
	$(document).on("keypress", close_intro)
}

// Click and Keypress event listener after introduction of avatar
const close_intro = () => {
	$(document).off("click")
	$(document).off("keypress")	
	$(".avatar_intro").fadeTo(1200, 0, fading_avatar_intro_post)
}

// After fading out avatar intro
const fading_avatar_intro_post = () => {
	$(".avatar_intro").remove()
	$(".avatar_container").css({"border": "0.8vh solid #3A494D", "border-radius": "0.6vw", width:"50vh", height: "41vh", "margin-top":"10.2vh"})
	$(".avatar_container #avatar_img").css({"margin-top":"0px"}).animate({width: '11vw', height: '11vw'}, 800)
	$(".avatar_container").animate({width: '14vw', height: '11vw', margin: "0.8vw"}, 800)
}

// Skipper function to skip through the steps
const skipper = () => {
	$("noscript").remove()
	$("#detect_ie").remove()
	$(".ie_block_script").remove()
	$(".not_ready").remove()
	$(".avatar_container #avatar_img").css({width: '40vh', height: '40vh', opacity: 1})
	// avatar_intro_post()
	$(".avatar_container .intro_box").show()
	$(".avatar_container .intro_box").css({width: '36vw'})
	// intro_box_post()
	$(".intro_box").text($(".intro_box").data("text"))
	// simulate_typing_post()
	$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
	// instruction_msg1_flyby_post()
	$(".instruction_box .instruction_msg2").css({"margin": "0 auto"})
	$(document).on("click", close_intro)
	$(document).on("keypress", close_intro)
	// instruction_msg2_flyby_post()
	$(".avatar_intro").remove()
	$(".avatar_container #avatar_img").css({"margin-top":"0px", width: '11vw', height: '11vw'})
	$(".avatar_container").css({"border": "0.5vh solid #3A494D", "border-radius": "0.6vw", width: '14vw', height: '11vw', margin: "0.8vw"})
	// fading_avatar_intro_post()
}
