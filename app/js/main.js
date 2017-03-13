"use strict";
// The handles are created because the functions can not be used before declared
const skipper_handle = () => {skipper()}
const portrait_handle = () => {check_portrait()}
let dev_mode = portrait_handle
// This mode is for skipping steps during development testing
dev_mode = skipper_handle
$(dev_mode)

// Class Audio Controller
class Audio_controller {
	constructor() {
		this.last_audio = null
	}

	play_audio(audio_name) {
		$("." + audio_name)[0].play()
		this.last_audio = audio_name
	}

	pause_audio(remove_status = true) {
		if(this.last_audio !== null) {
			$("." + this.last_audio)[0].pause()
			if(remove_status === true) {
				$("." + this.last_audio).attr("data-src", $("." + this.last_audio).attr("src"))
				$("." + this.last_audio).attr("src", "")
			}
		}
	}
}
const audio_controller = new Audio_controller();

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
		this.clear_task()
	}

	clear_task() {
		this.task_array = []
	}
}
const pending_task = new Pending_task();

// Class Document Event for managing various events on document level
class Doc_event {
	constructor() {
		this.event_function = null
		this.function_param = null
		this.event_skip = false
		this.remove_skip = false
	}

	add_event(param) {
		this.event_function = param.event_function
		this.function_param = param.function_param
		this.unsuspend_event()
	}

	skip_event() {
		this.event_skip = true
	}

	unskip_event() {
		this.event_skip = false
	}

	check_event_skip() {
		if(this.event_skip === true) {
			this.event_skip = false
			return true
		}
	}

	suspend_event() {
		$(document).off("click")
		$(document).off("keypress")
	}

	unsuspend_event() {
		if(this.event_function !== null) {
			$(document).on("click", () => {this.event_function(this.function_param)})
			$(document).on("keypress", () => {this.event_function(this.function_param)})
		}
	}

	remove_event() {
		if(this.remove_skip === true) {
			this.remove_skip = false
		} else {
			this.event_function = null
			this.function_param = null
			this.suspend_event()
		}
	}

	skip_remove() {
		this.remove_skip = true
	}
}
const doc_event = new Doc_event();

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
	avatar_module.avatar_intro()
}

// Show icon to click, press or touch
const click_press_touch_show = (param) => {
	$(".click_press_touch").css({"top": param.top, "left": param.left}).show(200)
	doc_event.add_event({"event_function": click_event_validator, "function_param": param.event_function})
	pending_task.add_task(() => {$(".click_press_touch").hide(300)})
	pending_task.add_task(() => {doc_event.remove_event()})
}

// Click event validator
const click_event_validator = (event_function) => {
	if(doc_event.check_event_skip() === true) {return false}
	else {event_function()}
}

// Close overlay screen
const close_overlay = () => {
	pending_task.execute_tasks()
	$(".modal_overlay").off("click")
	$(".modal_overlay").hide()
	doc_event.unsuspend_event()
	doc_event.skip_event()
}

// Avatar block module
const avatar_module = (() => {
	// Make the avatar appear
	const avatar_intro = () => {
		audio_controller.play_audio("audio_avatar_intro")
		$(".avatar_container #avatar_img").animate({width: '21.8vw', height: '21.8vw'}, 500)
		$(".avatar_container #avatar_img").fadeTo(700, 1, avatar_intro_box_show)
	}

	// Show avatar intro box
	const avatar_intro_box_show = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_intro_box_expand")
		$(".avatar_container .intro_box").show()
		$(".avatar_container .intro_box").animate({width: '36vw'}, 400, intro_box_text_show)
	}

	// Show the intro box text
	const intro_box_text_show = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_intro_type")

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
			instruction_msg1_show()
		} else {
			setTimeout(simulate_typing, 70, {typing_obj, char_pos});
		}
	}

	// Show instruction message 1
	const instruction_msg1_show = () => {
		audio_controller.pause_audio()
		audio_controller.play_audio("audio_instruction_flyby1")
		const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
		$(".instruction_box .instruction_msg1").animate({"margin-left": new_left}, 200, instruction_msg2_show)
		setTimeout(() => {$(".instruction_box .instruction_msg1").css({"margin": "0 auto"})}, 600)
	}

	// Show instruction message 2
	const instruction_msg2_show = () => {
		setTimeout(audio_controller.play_audio, 400, "audio_instruction_flyby2")
		const new_left = ($(".instruction_box").css("width").replace('px', '') - $(".instruction_msg").css("width").replace('px', '')) / 2
		$(".instruction_box .instruction_msg2").css({"margin-top": "1.1vw"})
		$(".instruction_box .instruction_msg2").delay(400).animate({"margin-left": new_left}, 200,
			() => {click_press_touch_show({"event_function": intro_close, "top": "37vw", "left": "72vw"})})
		setTimeout(() => {$(".instruction_box .instruction_msg2").css({"margin": "1.1vw auto"})}, 1000)
	}

	// Click and Keypress event listener for intro closing
	const intro_close = () => {
		pending_task.execute_tasks()
		$(".avatar_intro").fadeTo(400, 0, avatar_minimize)
		setTimeout(() => {$(".avatar_intro").hide()}, 1000)
	}

	// Minimizing of avatar
	const avatar_minimize = () => {
		$(".avatar_container").css({width:"27.36vw", height: "21.8vw","top": "5.7vw", "left": "36vw", "position":"absolute"})
		$(".avatar_container #avatar_img").css({"margin-top":"0"}).animate({width: '10.45vw', height: '10.45vw'}, 700)
		$(".avatar_container").animate({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw", "top": "0", "left": "0"}, 700, map_module.map_intro)
		setTimeout(
			() => {
				$(".avatar_container #avatar_img").hide()
				$(".avatar_container").addClass("avatar_container_min")
			}, 600
		)
	}

	return {
		avatar_intro,
		avatar_intro_box_show,
		intro_box_text_show,
		instruction_msg1_show,
		instruction_msg2_show,
		intro_close,
		avatar_minimize
	}
})()

// Map block module
const map_module = (() => {
	// Map introduction
	const map_intro = () => {
		$(".map_container").removeClass("map_container_min").show()
		$(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.").show(600)
		$(".map_location").on("click", function() {map_location_click($(this).data("location"))})
		pending_task.add_task(map_minimize)
		setTimeout(click_press_touch_show, 600, {"event_function": map_intro_close, "top": "37vw", "left": "76vw"})
	}

	// Click and Keypress event listener for map intro closing
	const map_intro_close = () => {
		pending_task.execute_tasks()
		$(".quote_container").hide(600)
		setTimeout(sign_post_module.sign_post_intro, 700)
	}

	// Click event of map location
	const map_location_click = (map_location) => {
		doc_event.skip_event()
		$(".map_container_min").off("click")
		window[map_location + "_init"]()
	}

	// Maximizing the map
	const map_maximize = () => {
		$(".map_container_min").off("click")
		doc_event.skip_event()
		doc_event.suspend_event()
		$(".map_container").removeClass("map_container_min")
		$(".map_container").css({"background-size":  "51.7vw 38.6vw"})
		$(".map_container").animate({"width": "51.7vw", "height": "38.7vw", "margin": "0.5vw 0.8vw", "top": "8vw", "left": "24vw"}, 600)
		$(".modal_overlay").show()
		$(".modal_overlay").on("click", close_overlay)
		pending_task.add_task(() => {$(".modal_overlay").hide()})
		pending_task.add_task(map_minimize)
	}

	// Minimize the map
	const map_minimize = () => {
		$(".map_container").animate({"width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}, 600)
		setTimeout(() => {
			$(".map_container").css({"background-size":  "14vw 10.45vw"}).addClass("map_container_min")
			$(".map_container_min").on("click", map_maximize)
		}, 500)
	}

	return {
		map_intro,
		map_intro_close,
		map_maximize,
		map_minimize
	}
})()

// Sign post block module
const sign_post_module = (() => {
	// Sign post introduction
	const sign_post_intro = () => {
		$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.").show(600)
		$(".sign_post_container .sign_post_location").text("Welcome")
		$(".sign_post_container .sign_post_next").text("About Me")
		$(".sign_post_container").show()
		$(".sign_post_next_hover").on("click", sign_post_next_click)
		$(".sign_post_container").animate({"bottom": "0"},800, sign_post_red_arrow_show)
	}

	// Showing sign post red arrow
	const sign_post_red_arrow_show = () => {
		$(".sign_post_container .sign_post_red_arrow").show()
		$(".sign_post_container div").addClass("animate")
		pending_task.add_task(sign_post_red_arrow_remove)
		setTimeout(click_press_touch_show, 600, {"event_function": sign_post_blink_post, "top": "37vw", "left": "62vw"})
	}

	// Remove the sign_post_red_arrow
	const sign_post_red_arrow_remove = () => {
		$(".sign_post_container .sign_post_red_arrow").hide(300)
	}

	// After blinking the red arrow
	const sign_post_blink_post = () => {
		pending_task.execute_tasks()
		$(".sign_post_container div").animate({"opacity":"0"}, 600)
		$(".sign_post_container .sign_post_red_arrow").hide(400, about_me_init)
	}

	// Functionality of on click event for next arrow of the sign post
	const sign_post_next_click = () => {
		pending_task.execute_tasks()
		window[$(".map_location:contains('" + $(".sign_post_location").text() + "')" + " + .map_location").data("location") + "_init"].call()
	}

	return {
		sign_post_intro,
		sign_post_red_arrow_show,
		sign_post_red_arrow_remove,
		sign_post_blink_post,
		sign_post_next_click
	}
})()

// Map location shift actions
const location_shift = (params) => {
	pending_task.execute_tasks()
	$(".map_pointer").attr("class", "map_pointer map_pointer_" + params.map_location)
	$(".map_crosshair").attr("class", "map_crosshair map_crosshair_" + params.map_location)
	$(".sign_post_container div").animate({"opacity": "1"},600).hide()
	$(".sign_post_next_hover").on("click", sign_post_module.sign_post_next_click)
	$(".quote_container").hide(600)
	$(".content_display_container .content_subcontainer").hide()
	$(".sign_post_container .sign_post_location").text($(".map_" + params.map_location).text())
	$(".sign_post_container .sign_post_next").text($(".map_" + params.map_location + " + .map_location").text())
	$(".sign_post_container").css({"bottom": "0"}).show()
	$(".sign_post_container div").show()
	$(".content_display_container").show()
	$(".content_display_container .content_" + params.map_location).show()
	if(params.quote_text !== undefined) {
		$(".quote_container").html(params.quote_text).show(600)
	}
}

// Welcome Initialization
function welcome_init() {
	pending_task.clear_task()
	doc_event.unskip_event()
	doc_event.remove_event()
	$(".map_container").off("click")
	$(".map_location").off("click")
	$(".map_container").css({"background-size": "51.7vw 38.6vw", "width": "51.7vw", "height": "38.7vw", "top": "13.3vw", "left": "24vw"})//.removeClass("map_container_min")
	$(".map_container").hide()
	$(".quote_container").hide()
	$(".sign_post_container").hide()
	$(".content_display_container").hide()
	$(".click_press_touch").hide()

	$(".avatar_container").css({"position": "relative", "width": "100vw", "margin": "0"}).removeClass("avatar_container_min")
	$(".avatar_container #avatar_img").css({"margin-top":"6vw"})
	avatar_module.avatar_intro()
}

// About Me Initialization
function about_me_init() {
	location_shift({"map_location": "about_me", "quote_text": "This is how I look."})
}

// Strength Initialization
function strength_init() {

}

// Skills Initialization
function skills_init() {

}

// Education Initialization
function education_init() {

}

// Experience Initialization
function experience_init() {

}

// Portfolio Initialization
function portfolio_init() {

}

// Interests Initialization
function interests_init() {
	location_shift({"map_location": "interests", "quote_text": "This is how I waste my time.."})
}

// Testimonial Initialization
function testimonial_init() {
	location_shift({"map_location": "testimonial", "quote_text": "Coming Soon.."})
}

// Address Initialization
function address_init() {
	location_shift({"map_location": "address", "quote_text": "I live here.. Nepal <br/> My email address is - <span style='font-size: 3vw; color:#FF0;'>IRWIFI@GMAIL.COM</span>"})
}

// Resume Initialization
function resume_init() {
	location_shift({"map_location": "resume", "quote_text": "You can download my resume here. <br/> Click below to download resume in PDF or Word format.\
		<br/> Check your download folder once you click on the file type."})
}

// End Initialization
function end_init() {
	location_shift({"map_location": "end"})
}

// Start Over
function start_over_init() {
	$(".modal_overlay").css("z-index", "90").show()
	$(".modal_overlay").on("click", () => {
		close_overlay()
		$(".start_over").hide()
		$(".modal_overlay").css("z-index", "88")
	})
	$(".start_over").show()
	$(".start_over").on("click", () => {
		close_overlay()
		$(".start_over").hide()
		$(".modal_overlay").css("z-index", "88")
		welcome_init()
	})
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
	// /* Avatar block */
	{
		// avatar_module.avatar_intro()
			// $(".avatar_container #avatar_img").css({width: '21.8vw', height: '21.8vw', opacity: 1})
		// avatar_module.avatar_intro_box_show()
			// $(".avatar_container .intro_box").css({width: '36vw'}).show()
		// avatar_module.intro_box_text_show()
			// $(".intro_box").text($(".intro_box").data("text"))
		// avatar_module.instruction_msg1_show()
			// $(".instruction_box .instruction_msg1").css({"margin": "0 auto"})
		// avatar_module.instruction_msg2_show()
			// $(".instruction_box .instruction_msg2").css({"margin": "0 auto", "margin-top":"1.1vw"})
			// $(".click_press_touch").css({"top": "37vw", "left": "72vw"}).show()
			// click_press_touch_show({"event_function": avatar_module.intro_close, "top": "37vw", "left": "72vw"})
		// avatar_module.intro_close()
			// pending_task.execute_tasks()
			// $(".avatar_intro").hide()
		// avatar_module.avatar_minimize()
			$(".avatar_container #avatar_img").css({"margin-top":"0", width: '10.45vw', height: '10.45vw'}).hide()
			$(".avatar_container").css({width: '16.5vw', height: '10.45vw', margin: "0.5vw 0.8vw", "top": "0", "left": "0"})
			$(".avatar_container").addClass("avatar_container_min")
	}
	map_module.map_intro()
		// $(".map_container").show()
		// $(".quote_container").html("This is an Interactive Map of the tour. You can click on any location at any time and I will take you there.<br/>Press any key or Click to continue.").show()
		// click_press_touch_show({"event_function": map_module.map_intro_close, "top": "37vw", "left": "76vw"})
	// // map_module.map_intro_close()
	// 	pending_task.execute_tasks()
	// 	$(".quote_container").hide()
	// 	$(".map_container").css({"background-size":  "14vw 10.45vw", "width": "14vw", "height": "10.45vw", "margin": "0.5vw 0.8vw", "top": "0", "left": "83.8vw"}).addClass("map_container_min")
	// 	$(".map_container_min").on("click", map_module.map_maximize)
	// // sign_post_module.sign_post_intro()
	// 	$(".quote_container").html("This shows the Current and Next location on the tour.<br/>Press any key or Click to continue.").show()
	// 	$(".sign_post_container .sign_post_location").text("Welcome")
	// 	$(".sign_post_container .sign_post_next").text("About Me")
	// 	$(".sign_post_container").css({"bottom": "0"}).show()
	// 	$(".sign_post_next_hover").on("click", sign_post_module.sign_post_next_click)
	// // sign_post_module.sign_post_red_arrow_show()
	// 	$(".sign_post_container .sign_post_red_arrow").show()
	// 	$(".sign_post_container div").addClass("animate")
	// 	pending_task.add_task(sign_post_module.sign_post_red_arrow_remove)
	// 	click_press_touch_show({"event_function": sign_post_module.sign_post_blink_post, "top": "37vw", "left": "62vw"})
	// // sign_post_module.sign_post_blink_post()
	// 	pending_task.execute_tasks()
	// 	$(".sign_post_container .sign_post_red_arrow").hide()
	// // 	about_me_init()
}
