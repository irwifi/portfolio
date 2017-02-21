"use strict";
// The handles are created because the functions can not be used before declared
const skipper_handle = () => {skipper()}
const portrait_handle = () => {check_portrait()}
let dev_mode = portrait_handle
// This mode is for skipping steps during development testing
dev_mode = skipper_handle
$(dev_mode)

// Pending Tasks Class
class Pending_task {
	constructor() {
		this.task_array = []
	}

	add_task(new_task) {
		this.task_array.push(new_task)
	}

	execute_tasks() {
		for(let task in this.task_array) {
			this.task_array[task].call()
		}
	}
}

const pending_task = new Pending_task();

// Checks for the portrait mode
const check_portrait = () => {
	// Remove the noscript block
	$("noscript").remove()

	// Remove IE block script and messages
	$("#detect_ie").remove()

	// Checks if the browser is in Portrait mode
	if(window.innerHeight > window.innerWidth) {
		// Get the modal
		const modal = document.getElementById('detect_portrait')
		modal.style.display = "block"

		// Get the <span> element that closes the modal
		const span = document.getElementsByClassName("close")[0]

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none"
			init()
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none"
				init()
			}
		}
	} else {
		init()
	}
}

// Initialize the page
const init = () => {
	// Remove the Portrait mode script
	$("#detect_portrait").remove()
	
	// Remove the loading screen once the page is ready
	$(".not_ready").remove()
		
	// Make the avatar appear
	$(".audio_avatar_intro")[0].play()
	$(".avatar_container #avatar_img").animate({width: '21.8vw', height: '21.8vw'}, 500)
	$(".avatar_container #avatar_img").fadeTo(700, 1, avatar_intro_post)
}

// After fade in of avatar image
const avatar_intro_post = () => {
	$(".audio_avatar_intro")[0].pause()
	$(".avatar_container .intro_box").show()
	$(".audio_intro_box_expand")[0].play()
	$(".avatar_container .intro_box").animate({width: '36vw'}, 400, intro_box_post)
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
		setTimeout(simulate_typing, 70, {typing_obj, char_pos});
	}
}

// After simulating the typing
const simulate_typing_post = () => {
	$(".audio_intro_type")[0].pause()
	$(".audio_instruction_flyby1")[0].play()
	const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
	$(".instruction_box .instruction_msg1").animate({"margin-left": new_left}, 200, instruction_msg1_flyby_post)
}

// After flying first instruction message
const instruction_msg1_flyby_post = () => {
	setTimeout(() => {$(".audio_instruction_flyby1")[0].pause()}, 400)
	setTimeout(() => {$(".audio_instruction_flyby2")[0].play()}, 400)
	$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
	const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
	$(".instruction_box .instruction_msg2").css({"margin-top": "1.1vw"})
	$(".instruction_box .instruction_msg2").delay(400).animate({"margin-left": new_left}, 200, instruction_msg2_flyby_post)
}

// After flying second instruction message
const instruction_msg2_flyby_post = () => {
	$(".instruction_box .instruction_msg2").css({"margin": "0 auto", "margin-top": "1.1vw"})
	$(".click_press_touch").css({"top": "37vw", "left": "72vw"}).show(200)
	$(document).on("click", intro_close)
	$(document).on("keypress", intro_close)
}

// Click and Keypress event listener for intro closing
const intro_close = () => {
	$(document).off("click")
	$(document).off("keypress")
	$(".click_press_touch").hide()
	$(".avatar_intro").fadeTo(400, 0, fading_avatar_intro_post)
}

// After fading out avatar intro
const fading_avatar_intro_post = () => {
	$(".avatar_intro").remove()
	$(".avatar_container").css({width:"27.36vw", height: "21.8vw","top": "5.7vw", "left": "36vw", "position":"absolute"})
	$(".avatar_container #avatar_img").css({"margin-top":"0"}).animate({width: '10.45vw', height: '10.45vw'}, 700)
	$(".avatar_container").animate({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw", "top": "0", "left": "0"}, 700, avatar_minimize_post)
}

// After minimizing the avatar
const avatar_minimize_post = () => {
	$(".avatar_container #avatar_img").hide()
	$(".avatar_container").addClass("avatar_container_min")
	$(".map_container").show()
	$(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.")
	$(".quote_container").show(600)
	$(document).on("click", map_intro_close)
	$(document).on("keypress", map_intro_close)
	// $(".map_container").on("click", map_maximize)
}

// Maximizing the map
/*const map_maximize = () => {
	$(document).off("click")
	$(document).off("keypress")
	// $(".map_container").addClass("modal")
}*/

// Click and Keypress event listener for map intro closing
const map_intro_close = () => {
	$(document).off("click")
	$(document).off("keypress")	

	$(".quote_container").hide(600)
	$(".map_container").animate({"width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}, 600, map_minimize_post)
}

// After minimizing map
const map_minimize_post = () => {
	$(".map_container").css({"background-size":  "14vw 10.45vw"}).addClass("map_container_min")
	$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.")
	$(".quote_container").show(600)
	$(".sign_post_container .sign_post_location").text("Welcome")
	$(".sign_post_container .sign_post_next").text("About Me")
	$(".sign_post_container").show()
	$(".sign_post_container").animate({"bottom": "0"},800, sign_post_fall_post)
}

// After falling of sign post
const sign_post_fall_post = () => {
	$(".sign_post_container .sign_post_red_arrow").show()
	$(".sign_post_container div").addClass("animate")
	pending_task.add_task(sign_post_red_arrow_remove)
	$(document).on("click", sign_post_blink_post)
	$(document).on("keypress", sign_post_blink_post)
	$(".sign_post_next_hover").on("click", sign_post_next_click)
}

// Remove the sign_post_red_arrow
const sign_post_red_arrow_remove = () => {
	$(".sign_post_container .sign_post_red_arrow").hide(300)
}

// Functionality of on click event for next arrow of the sign post
const sign_post_next_click = () => {
	pending_task.execute_tasks()
	about_me_init()
}

// About Me Initialization
const about_me_init = () => {
	$(document).off("click")
	$(document).off("keypress")
	$(".quote_container").hide(600)
	$(".sign_post_container div").animate({"opacity": "1"},600).hide()
	$(".quote_container").text("This is how I look.").show(600)
	$(".sign_post_container .sign_post_next").text("My Strength")
	$(".sign_post_container .sign_post_location").text("About Me")
	$(".sign_post_container div").show()
	$(".content_display_container").show()
	$(".content_display_container .content_about_me").show()
}

// After blinking the red arrow
const sign_post_blink_post = () => {
	$(document).off("click")
	$(document).off("keypress")
	$(".sign_post_container div").animate({"opacity":"0"}, 600)
	$(".sign_post_container .sign_post_red_arrow").hide(400, dissolve_post_location_post)
}

// After hiding the text of the sign post
const dissolve_post_location_post = () => {
	about_me_init()
}

// Skipper function to skip through the steps
const skipper = () => {
	// check_portrait()
		$("noscript").remove()
		$("#detect_ie").remove()
		$(".ie_block_script").remove()
	// init()
		$("#detect_portrait").remove()
		$(".not_ready").remove()
		$(".avatar_container #avatar_img").css({width: '21.8vw', height: '21.8vw', opacity: 1})
	// avatar_intro_post()
		$(".avatar_container .intro_box").show()
		$(".avatar_container .intro_box").css({width: '36vw'})
	// intro_box_post()
	// simulate_typing_post()
		$(".intro_box").text($(".intro_box").data("text"))
		$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
	// instruction_msg1_flyby_post()
		$(".instruction_box .instruction_msg2").css({"margin": "0 auto", "margin-top":"1.1vw"})
	// instruction_msg2_flyby_post()
		$(".click_press_touch").css({"top": "37vw", "left": "72vw"}).show()
		$(document).on("click", intro_close)
		$(document).on("keypress", intro_close)
	// intro_close()
		$(".click_press_touch").hide()
		$(document).off("click")
		$(document).off("keypress")
	// fading_avatar_intro_post()
		$(".avatar_intro").remove()
		$(".avatar_container #avatar_img").css({"margin-top":"0", width: '10.45vw', height: '10.45vw'})
		$(".avatar_container").css({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw"})
	// avatar_minimize_post()
		$(".avatar_container #avatar_img").hide()
		$(".avatar_container").addClass("avatar_container_min")
		$(".map_container").show()
		$(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.").show()
		$(document).on("click", map_intro_close)
		$(document).on("keypress", map_intro_close)
	// map_intro_close()
		$(document).off("click")
		$(document).off("keypress")
		$(".quote_container").hide()
		$(".map_container .map").css({"max-width": "14vw", "min-width": "14vw"})
		$(".map_container").css({"width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"})
	// map_minimize_post()
		$(".map_container").css({"background-size":  "14vw 10.45vw"}).addClass("map_container_min")
		$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.").show()
		$(".sign_post_container .sign_post_location").text("Welcome")
		$(".sign_post_container .sign_post_next").text("About Me")
		$(".sign_post_container").show()
		$(".sign_post_container").css({"bottom": "0"})
	// sign_post_fall_post()
		$(".sign_post_container .sign_post_red_arrow").show()
		$(".sign_post_container div").addClass("animate")
		$(document).on("click", sign_post_blink_post)
		$(document).on("keypress", sign_post_blink_post)
	// sign_post_blink_post()
		$(document).off("click")
		$(document).off("keypress")
		$(".sign_post_container .sign_post_red_arrow").hide()
	// dissolve_post_location_post()
		$(".quote_container").text("This is how I look.")
		$(".sign_post_container .sign_post_next").text("My Strength")
		$(".sign_post_container .sign_post_location").text("About Me")
		$(".content_display_container").show()
		$(".content_display_container .content_about_me").show()
}
